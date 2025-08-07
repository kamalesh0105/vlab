const Docker = require("dockerode");
const docker = new Docker();
const crypto = require('crypto');

const deployWorkspace = async (req, res) => {
  const username = "kamalesh11"; // Ideally from req.body
  const password = crypto.randomBytes(8).toString('hex');
  console.log(password) //have to store for next session
  const subdomain = `${username}.xemplar.live`;

  try {
    const container = await docker.createContainer({
      Image: 'codercom/code-server:4.102.2-39',
      name: `code-server-${username}`,
      Env: [
        `PASSWORD=${password}`
      ],
      ExposedPorts: {
        '8080/tcp': {}
      },
      Labels: {
        "traefik.enable": "true",
        [`traefik.http.routers.${username}.rule`]: `Host(\`${subdomain}\`)`,
        [`traefik.http.routers.${username}.entrypoints`]: "websecure",
        [`traefik.http.routers.${username}.tls.certresolver`]: "myresolver",
        [`traefik.http.services.${username}.loadbalancer.server.port`]: "8080"
      },
      HostConfig: {
        AutoRemove: true,
        NetworkMode: "web", // must match docker-compose
        Memory: 512 * 1024 * 1024,
        CpuShares: 512,
      }
    });

    await container.start();

    res.status(200).json({
      success: true,
      data: {
        username,
        password,
        url: `https://${subdomain}`
      }
    });

  } catch (err) {
    console.error("Error deploying container:", err);
    res.status(500).json({
      success: false,
      msg: err.message
    });
  }
};

module.exports = {
  deployWorkspace
};
