const cors = require('cors');
const express = require('express');
require('dotenv').config();
const app = express();
const axios = require('axios');
const exec = require('child_process');
const path = require('path');

app.use(express.json());
app.use(cors());

const CHATBOT_API_KEY = process.env.CHATBOT_API_KEY; 
const CHATBOT_API_URL = process.env.CHATBOT_API_URL;
const MODEL = process.env.MODEL;

const conversations = new Map();


// endpoint pour récupérer la documentation Shopping en ligne (meme nom que fichier)
app.get('/fetchDoc', async (req, res) => {
    try {
        // Exécuter le script fetchDoc.js pour récupérer la documentation
        exec.exec(
            'node ../tools/fetchDoc.js', 
            { cwd: __dirname }, 
            (error, stdout, stderr) => {
                if (error) {
                    console.error(`Erreur lors de l'exécution du script fetchDoc.js: ${error.message}`);
                    return res.status(500).json({ error: 'Erreur lors de la récupération de la documentation' });
                }
                console.log(`Sortie standard du script fetchDoc.js: ${stdout}`);
                return res.json({ data: stdout.trim() });
            });
    } catch (error) {
        console.error('Erreur lors de la récupération de la documentation:', error);
        return res.status(500).json({ error: 'Erreur serveur.' });
    }
});

// endpoint pour récupérer les frais de livraison Shopping en ligne 
app.get('/fetchDeliveryPrice', async (req, res) => {
    try {
        // Exécuter le script 
        exec.exec(
            'node ../tools/fetchDeliveryPrice.js', 
            { cwd: __dirname }, 
            (error, stdout, stderr) => {
                if (error) {
                    console.error(`Erreur lors de l'exécution du script fetchDeliveryPrice.js: ${error.message}`);
                    return res.status(500).json({ error: 'Erreur lors de la récupération des frais de livraison' });
                }
                console.log(`Sortie standard du script fetchDeliveryPrice.js: ${stdout}`);
                return res.json({ data: stdout.trim() });
            });
    } catch (error) {
        console.error('Erreur lors de la récupération des frais de livraison:', error);
        return res.status(500).json({ error: 'Erreur serveur.' });
    }
});


// Route `/chat` pour gérer les requêtes du chatbot IA (réponse)
app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;
    const sessionId = req.body.sessionId || 'default'; // pour stocker/retrouver l'historique des messages

    if (!userMessage) {
        return res.status(400).json({ error: 'Message requis' });
    }

    try {
        // si cette session n'existe pas encore, on l'initialise avec le message système
        if (!conversations.has(sessionId)) {
            conversations.set(sessionId, [
                {
                    role: 'system', 
                    content: 'Vous êtes un assistant IA utile pour un site e-commerce Shopping qui vent des produits mobiliers.\n\n' +
                        'Si l\'utilisateur pose une question relative à la navigation du site, les produits, le panier, la commande, les retours de produits, de l\'assistance client ou tout autre sujet lié au site e-commerce Shopping, vous devez répondre exactement : {"tool": "documentation"} et rien d\'autre.\n\n' +
                        'Si l\'utilisateur pose une question relative à la livraison, vous devez répondre exactement : {"tool": "delivery"} et rien d\'autre.\n\n' +
                        'Sinon répondez normalement.\n'
                }
            ]);
        }

        // get session history messages
        const messages = conversations.get(sessionId);
        messages.push({ role: 'user', content: userMessage });

        const response = await axios.post(
            CHATBOT_API_URL, 
            { model: MODEL, messages }, 
            {
                headers: {
                    'Authorization': `Bearer ${CHATBOT_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            } 
        ); 

        // ajout de la réponse à l'historique de la session
        let botMessage = response.data.choices[0].message.content;
        if (botMessage) {
            messages.push({ role: 'system', content: botMessage });
        }
        return res.json(botMessage ? { reply: botMessage } : { reply: 'Réponse indisponible.' });

    } catch (error) {
        console.error('Erreur lors de l\'appel à l\'API chatbot:', error);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
});


app.listen(3001, ()=> {
    console.log("Serveur en marche sur le port 3001...");
})