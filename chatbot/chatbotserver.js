const cors = require('cors');
const express = require('express');
require('dotenv').config();
const app = express();
const axios = require('axios');

app.use(express.json());
app.use(cors());

const CHATBOT_API_KEY = process.env.CHATBOT_API_KEY.trim(); 
const CHATBOT_API_URL = process.env.CHATBOT_API_URL.trim();
const MODEL = process.env.MODEL.trim();

// Route `/chat` pour gérer les requêtes du chatbot IA (réponse)
app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;
    const sessionId = req.body.sessionId || 'default';

    if (!userMessage) {
        return res.status(400).json({ error: 'Message requis' });
    }

    try {
        let messages; //messages[]

        messages = [
            {
                role: 'system', 
                content: 'Vous êtes un assistant IA utile pour un site e-commerce Shopping qui vent des produits mobiliers. Répondez aux questions de manière concise et claire.'
            },
            {
                role: 'user',
                content: userMessage
            }
        ];
        
        const response = await axios.post(
            CHATBOT_API_URL, 
            {
                model: MODEL,
                messages: messages,
            }, 
            {
                headers: {
                    'Authorization': `Bearer ${process.env.CHATBOT_API_KEY.trim()}`,
                    'Content-Type': 'application/json'
                }
            } 
        ); 

        let botMessage = response.data.choices[0].message.content;
        return res.json(botMessage ? { reply: botMessage } : { reply: 'Réponse indisponible.' });

    } catch (error) {
        console.error('Erreur lors de l\'appel à l\'API chatbot:', error);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
    
});


app.listen(3001, ()=> {
    console.log("Serveur en marche sur le port 3001...");
})