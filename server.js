// filepath: c:\Users\Usuario\Desktop\backend\server.js
require('dotenv').config();
const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');

// Inicializar Firebase
admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
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
