// filepath: c:\Users\Usuario\Desktop\backend\server.js
const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');

// Inicializar Firebase
const serviceAccount = require('./firebase-key.json'); // Asegúrate de tener tu archivo de clave de Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://console.firebase.google.com/u/0/project/notas-del-dia/database/notas-del-dia-default-rtdb/data/~2F?hl=es', // Reemplaza con tu URL de Firebase
});
const PORT = 3000;
const db = admin.firestore();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Servidor funcionando');
  });
  

// Ruta para guardar texto
app.post('/save-text', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Texto no proporcionado.' });
  }

  try {
    const docRef = await db.collection('texts').add({ text });
    const savedDoc = await docRef.get();

    res.json({ savedText: savedDoc.data().text });
  } catch (error) {
    console.error('Error al guardar en Firebase:', error);
    res.status(400).json({ error: 'Error al guardar el texto.' });
  }
});

// Iniciar servidor

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});