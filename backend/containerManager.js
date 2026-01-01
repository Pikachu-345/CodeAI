const Docker = require('dockerode');
const os = require('os');
const pty = require('node-pty');
const path = require('path');
const fs = require('fs');

const isWindows = os.platform() === 'win32';
const docker = new Docker({socketPath: isWindows ? '//./pipe/docker_engine' : '/var/run/docker.sock'}); 

class ContainerManager {
    constructor() {
        this.sessionsDir = path.join(process.cwd(), 'sessions');
        if(!fs.existsSync(this.sessionsDir)){
            fs.mkdirSync(this.sessionsDir);
        }
    }

    async createSession(sessionId){
        const sessionPath = path.join(this.sessionsDir, sessionId);
        if(!fs.existsSync(sessionPath)){
            fs.mkdirSync(sessionPath, { recursive: true });
            fs.writeFileSync(path.join(sessionPath, 'index.js'), `console.log("Hello from session ${sessionId}");`);
        }

        const container=await docker.createContainer({
            Image: 'base-image',
            name: `session_${sessionId}`,
            Tty: true,
            HostConfig: {
                Binds: [`${sessionPath}:/app`],
                PortBindings: {
                    "5173/tcp": [{ "HostPort": "0" }] 
                }
            }
        });
        await container.start();
        const data = await container.inspect();
        const hostPort = data.NetworkSettings.Ports['5173/tcp'][0].HostPort;
        return {
            containerId: container.id,
            port: hostPort,
            url: `http://localhost:${hostPort}`
        };
    }

    async stopSession(containerId) {
        const container = docker.getContainer(containerId);
        await container.stop();
        await container.remove();
    }

    async createTerminal(containerId,sessionId, socket) {
        // const shell = isWindows ? 'powershell.exe' : 'bash';
        const ptyProcess = pty.spawn('docker', ['exec', '-it', `session_${sessionId}`, '/bin/sh'], {
            name: 'xterm-color',
            cols: 80,
            rows: 24,
            cwd: process.cwd(),
            env: process.env
        });

        // Pipe Data: PTY -> Socket -> Browser
        ptyProcess.on('data', (data) => {
            socket.emit('terminal-output', data);
        });

        // Pipe Data: Browser -> Socket -> PTY
        socket.on('terminal-input', (data) => {
            ptyProcess.write(data);
        });

        socket.on('disconnect', () => {
            ptyProcess.kill();
        });
    }
};

module.exports = new ContainerManager();