const cors = require('cors');
const express = require('express');
require('dotenv').config();
const app = express();
const axios = require('axios');

app.use(express.json());
app.use(cors());

const CHATBOT_API_KEY = process.env.CHATBOT_API_KEY; 
const CHATBOT_API_URL = process.env.CHATBOT_API_URL;
const MODEL = process.env.MODEL;

const conversations = new Map();

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
                    content: 'Vous êtes un assistant IA utile pour un site e-commerce Shopping qui vent des produits mobiliers. Répondez aux questions de manière concise et claire.'
                }
            ]);
        }

        // get session history messages
        const messages = conversations.get(sessionId);
        // let messages; //messages[]

        messages.push({ role: 'user', content: userMessage });

        // messages = [
        //     {
        //         role: 'system', 
        //         content: 'Vous êtes un assistant IA utile pour un site e-commerce Shopping qui vent des produits mobiliers. Répondez aux questions de manière concise et claire.'
        //     },
        //     {
        //         role: 'user',
        //         content: userMessage
        //     }
        // ];
        
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
            messages.push({ role: 'bot', content: botMessage });
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