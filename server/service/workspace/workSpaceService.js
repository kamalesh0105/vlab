const Docker = require("dockerode");
const docker = new Docker();
const prisma = require('../../lib/prisma');

async function stopContainer(workspaceID) {
    const container = docker.getContainer(workspaceID);
    return await container.stop();
}

async function startContainer(workspaceID) {
    const status = await getContainerStatus(workspaceID);
    if (status === "running") {
        console.log("container already running..");
        return;
    }
    const container = docker.getContainer(workspaceID);
    return await container.start();
}

async function getContainerStatus(containerId) {
    const container = docker.getContainer(containerId);
    const data = await container.inspect();
    return data.State.Status; // "running", "exited", "paused"
}

async function restart(workspaceID) {
    const status = await getContainerStatus(workspaceID);
    if (status === "exited") {
        return await startContainer(workspaceID);
    }
    const container = docker.getContainer(workspaceID);
    return await container.restart();
}

module.exports = { startContainer, stopContainer, getContainerStatus, restart };
