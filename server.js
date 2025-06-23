const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/collabeditor', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Document Schema
const DocumentSchema = new mongoose.Schema({
  _id: String,
  content: String
});
const Document = mongoose.model('Document', DocumentSchema);

// Serve static files
app.use(express.static('public'));

// Socket.io connection
io.on('connection', socket => {
  socket.on('get-document', async docId => {
    const document = await findOrCreateDocument(docId);
    socket.join(docId);
    socket.emit('load-document', document.content);
    
    socket.on('send-changes', delta => {
      socket.broadcast.to(docId).emit('receive-changes', delta);
    });
    
    socket.on('save-document', async data => {
      await Document.findByIdAndUpdate(docId, { content: data });
    });
  });
});

async function findOrCreateDocument(id) {
  if (!id) return new Document();
  const document = await Document.findById(id);
  if (document) return document;
  return await Document.create({ _id: id, content: '' });
}

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
