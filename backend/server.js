const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');
const ContainerManager = require('./containerManager');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});
app.use(cors());
app.use(express.json());

io.on('connection', (socket) => {
  console.log('User connected to terminal');

  socket.on('attach-terminal', (containerId, sessionId) => {
    console.log(`Attaching terminal to container: ${containerId}, session: ${sessionId}`);
    ContainerManager.createTerminal(containerId, sessionId, socket);
  });
});

server.listen(4000, () => {
  console.log(`Backend Orchestrator with Terminal running on http://localhost:4000`);
});

app.post('/api/start', async (req, res) => {
    try {
        const { sessionId } = req.body;
        if (!sessionId) return res.status(400).json({ error: 'Session ID required' });

        console.log(`Starting environment for session: ${sessionId}`);
        const sessionInfo = await ContainerManager.createSession(sessionId);
        
        res.json({
            message: 'Environment ready',
            ...sessionInfo
        });
    } catch (error) {
        console.error('Docker Error:', error);
        res.status(500).json({ error: 'Failed to boot environment', details: error.message });
    }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Backend Orchestrator running on http://localhost:${PORT}`);
});