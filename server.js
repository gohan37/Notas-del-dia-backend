// filepath: c:\Users\Usuario\Desktop\backend\server.js
require('dotenv').config();
const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');

// Inicializar Firebase
const serviceAccount = {
    type: "service_account",
    project_id: process.env.PROJECT_ID,
    private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'), // Reemplaza \n por saltos de línea reales
    client_email: process.env.CLIENT_EMAIL
  };
  
  // Inicializar Firebase Admin
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });




console.log("Project ID:", process.env.PROJECT_ID); 
admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });
  const PORT = process.env.PORT || 3000; 
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