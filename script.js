document.addEventListener('DOMContentLoaded', () => {
  // Set up Quill editor
  const quill = new Quill('#editor', {
    theme: 'snow',
    modules: {
      toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['link', 'image'],
        ['clean']
      ]
    }
  });

  // Socket connection
  const socket = io();
  const params = new URLSearchParams(window.location.search);
  const docId = params.get('id') || generateId();
  document.getElementById('doc-id').textContent = docId;

  // Load document
  socket.emit('get-document', docId);

  socket.on('load-document', content => {
    if (content) quill.setContents(JSON.parse(content));
    quill.enable();
  });

  // Handle changes
  quill.on('text-change', (delta, oldDelta, source) => {
    if (source !== 'user') return;
    socket.emit('send-changes', delta);
  });

  socket.on('receive-changes', delta => {
    quill.updateContents(delta);
  });

  // Save functionality
  document.getElementById('save-btn').addEventListener('click', () => {
    const content = JSON.stringify(quill.getContents());
    socket.emit('save-document', content);
    alert('Document saved!');
  });

  function generateId() {
    return Math.random().toString(36).substring(2, 10);
  }
});
