const Docker = require("dockerode");
const docker = new Docker();
const crypto = require('crypto');
const prisma = require('../lib/prisma')
const workSpaceService = require("../service/workspace/workSpaceService")

// Simple in-memory user cache to reduce bursty DB lookups (TTL: 15s)
const userCache = new Map(); // key: email, value: { data, expiresAt }
// Track in-flight lookups so concurrent requests share the same promise
const inflightUserRequests = new Map(); // key: email, value: Promise

async function getUserByEmailWithCache(email) {
  const now = Date.now();
  const cached = userCache.get(email);
  if (cached && cached.expiresAt > now) {
    return cached.data;
  }
  // De-duplicate concurrent lookups for the same email
  if (inflightUserRequests.has(email)) {
    return inflightUserRequests.get(email);
  }

  const fetchPromise = (async () => {
    // Minimal retry to withstand cold starts/connection pool timeouts
    const maxAttempts = 3;
    let lastError = null;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const user = await prisma.user.findUnique({ where: { email } });
        userCache.set(email, { data: user, expiresAt: Date.now() + 15000 });
        return user;
      } catch (err) {
        lastError = err;
        // Backoff a bit before retrying
        await new Promise(r => setTimeout(r, attempt * 250));
      }
    }
    throw lastError;
  })()
    .finally(() => {
      inflightUserRequests.delete(email);
    });

  inflightUserRequests.set(email, fetchPromise);
  return fetchPromise;
}

const deployWorkspace = async (req, res) => {
  let { username } = req.body;
  try {
    // Resolve username from authenticated user if not provided
    if (!username) {
      const dbUser = await getUserByEmailWithCache(req.user.email);
      if (!dbUser || !dbUser.username) {
        return res.status(400).json({ success: false, msg: "username missing and could not be resolved" });
      }
      username = dbUser.username;
    }

    const subdomain = `${username}.xemplar.live`;

    // If user already has a container, start it if exited, otherwise return info
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing?.container_id) {
      try {
        const container = docker.getContainer(existing.container_id);
        const info = await container.inspect();
        if (info.State.Status === "exited") {
          await container.start();
        }
        return res.status(200).json({
          success: true,
          data: {
            username,
            url: `https://${subdomain}`,
            container_id: existing.container_id
          }
        });
      } catch (e) {
        // fallthrough to create if container reference is stale
      }
    }

    // Create a new container and persist mapping
    const password = crypto.randomBytes(8).toString('hex');
    const salt = crypto.randomBytes(3).toString('hex');
    const container = await docker.createContainer({
      Image: 'codercom/code-server:4.102.2-39',
      name: `code-server-${username}-${salt}`,
      Env: [
        `PASSWORD=${password}`
      ],
      ExposedPorts: { '8080/tcp': {} },
      Labels: {
        "traefik.enable": "true",
        [`traefik.http.routers.${username}.rule`]: `Host(\`${subdomain}\`)`,
        [`traefik.http.routers.${username}.entrypoints`]: "websecure",
        [`traefik.http.routers.${username}.tls.certresolver`]: "myresolver",
        [`traefik.http.services.${username}.loadbalancer.server.port`]: "8080"
      },
      HostConfig: {
        AutoRemove: false,
        NetworkMode: "web",
        Memory: 512 * 1024 * 1024,
        CpuShares: 512,
      }
    });
    const containerID = container.id;
    await prisma.user.update({
      where: { username },
      data: { code_server_password: password, container_id: containerID }
    });

    await container.start();
    return res.status(200).json({
      success: true,
      data: { username, password, url: `https://${subdomain}`, container_id: containerID }
    });
  } catch (err) {
    console.error("Error deploying container:", err);
    return res.status(500).json({ success: false, msg: err.message });
  }
};
const reDeploy = async (req, res) => {
  let { workspaceID } = req.body;
  try {
    if (!workspaceID) {
      const dbUser = await getUserByEmailWithCache(req.user.email);
      workspaceID = dbUser?.container_id;
    }
    if (!workspaceID) return res.status(400).json({ success: false, msg: "workspaceID Missing" });
    await workSpaceService.restart(workspaceID);
    res.status(200).json({
      success: true,
      msg: "Container redeplyed successfully"
    })
  } catch (err) {
    console.error("Error Redeploying:", err);
    res.status(500).json({
      success: false,
      msg: err.message
    });
  }
}

const stopWorkSpace = async (req, res) => {
  let { workspaceID } = req.body;
  try {
    if (!workspaceID) {
      const dbUser = await getUserByEmailWithCache(req.user.email);
      workspaceID = dbUser?.container_id;
    }
    if (!workspaceID) return res.status(400).json({ success: false, msg: "workspaceID Missing" });
    await workSpaceService.stopContainer(workspaceID);
    res.status(200).json({
      success: true,
      msg: "Container stoppepd successfully"
    })
  } catch (err) {
    console.error("Error Stopping container:", err);
    res.status(500).json({
      success: false,
      msg: err.message
    });
  }

}

const startWorkSpace = async (req, res) => {
  let { workspaceID } = req.body;
  try {
    if (!workspaceID) {
      const dbUser = await getUserByEmailWithCache(req.user.email);
      workspaceID = dbUser?.container_id;
    }
    if (!workspaceID) return res.status(400).json({ success: false, msg: "workspaceID Missing" });
    await workSpaceService.startContainer(workspaceID);
    res.status(200).json({
      success: true,
      msg: "Container started successfully"
    })
  } catch (err) {
    console.error("Error Starting container:", err);
    res.status(500).json({
      success: false,
      msg: err.message
    });
  }

}
const getStatus = async (req, res) => {
  try {
    const user = req.user;
    // Prefer matching by email, as Supabase JWT sub is a UUID string and our schema uses BigInt IDs
    const dbUser = await getUserByEmailWithCache(user.email);

    if (!dbUser || !dbUser.container_id) {
      return res.json({ success: true, status: "absent", username: dbUser?.username || "" });
    }

    const container = docker.getContainer(dbUser.container_id);
    let status = "absent";
    try {
      const info = await container.inspect();
      status = info.State?.Status || "unknown";
    } catch (e) {
      // Fall back to absent if container cannot be inspected
      status = "absent";
    }

    res.json({
      success: true,
      status,
      username: dbUser.username,
      url: `https://${dbUser.username}.xemplar.live`,
      container_id: dbUser.container_id,
      password: dbUser.code_server_password || null
    });
  } catch (err) {
    console.error("Error getting status:", err);
    // Never 500 to the client; surface an "absent" status instead
    res.json({ success: true, status: "absent", username: "" });
  }
};

const getStream = async (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  });
  const user = req.user;
  let cachedContainerId = null;

  // Resolve once to avoid hammering the DB on every tick
  getUserByEmailWithCache(user.email)
    .then((dbUser) => {
      cachedContainerId = dbUser?.container_id || null;
      // Immediately emit first state
      void sendUpdate();
    })
    .catch((err) => {
      console.error("Stream bootstrap error:", err);
      res.write(`data: ${JSON.stringify({ status: "absent" })}\n\n`);
    });

  const sendUpdate = async () => {
    try {
      if (!cachedContainerId) {
        res.write(`data: ${JSON.stringify({ status: "absent" })}\n\n`);
        return;
      }
      const container = docker.getContainer(cachedContainerId);
      let status = "absent";
      try {
        const info = await container.inspect();
        status = info.State?.Status || "unknown";
      } catch (e) {
        status = "absent";
      }
      res.write(`data: ${JSON.stringify({ status, container_id: cachedContainerId })}\n\n`);
    } catch (err) {
      console.error("Stream error:", err);
      // keep connection alive but report absent
      res.write(`data: ${JSON.stringify({ status: "absent" })}\n\n`);
    }
  };

  const interval = setInterval(sendUpdate, 7000);
  req.on('close', () => { clearInterval(interval); });
};

const getMe = async (req, res) => {
  try {
    const user = req.user;
    const dbUser = await getUserByEmailWithCache(user.email);

    if (!dbUser) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    res.json({
      success: true,
      data: {
        username: dbUser.username,
        id: dbUser.id
      }
    });
  } catch (err) {
    console.error("Error getting user info:", err);
    res.status(500).json({ success: false, msg: err.message });
  }
};

module.exports = {
  deployWorkspace, stopWorkSpace, reDeploy, startWorkSpace, getStatus, getStream, getMe
};
