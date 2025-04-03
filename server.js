// Cargar variables de entorno
require('dotenv').config();

const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');

console.log("🔍 Verificando claves de Firebase en process.env:");
console.log("PROJECT_ID:", process.env.FIREBASE_PROJECT_ID);
console.log("PRIVATE_KEY:", process.env.FIREBASE_PRIVATE_KEY ? "Cargada" : "No encontrada");
console.log("CLIENT_EMAIL:", process.env.FIREBASE_CLIENT_EMAIL);

// Inicializar Firebase (Solo una vez)
admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
});

console.log("🚀 Firebase conectado con:", process.env.FIREBASE_PROJECT_ID);

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
        console.error('❌ Error al guardar en Firebase:', error);
        res.status(500).json({ error: 'Error al guardar el texto.' });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
