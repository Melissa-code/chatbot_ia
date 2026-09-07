# Chatbot IA

Ce projet est un exemple de site e-commerce avec un chatbot intégré, conçu pour être facilement réutilisable sur n’importe quel site web. Le chatbot est injecté via un script JavaScript autonome et peut être personnalisé avec différents thèmes visuels.

## Aperçu

<img src="./img/interface_chatbot.png" width="500" alt="interface du site avec le chatbot" />

## Fonctionnalités

- Landing page e-commerce moderne
- Section produits avec cartes visuelles
- Bouton flottant de chat disponible sur toute la page
- Fenêtre de discussion interactive
- Thèmes personnalisables : bleu, rouge, sombre
- Intégration simple via un seul fichier JavaScript
- Compatible avec une utilisation statique sans dépendances externes

## Stack technique

- HTML
- CSS
- JavaScript

## outils 

- Web Browser Preview (plugin VSCODE)

## Comment lancer le projet

1. Cloner le projet `git clone `
2. Se déplaceer dans le projet `cd chatbot_ia`
3. Ouvrir `index.html` dans votre navigateur
4. Le chatbot apparaît automatiquement dans le coin inférieur droit de la page.

## Intégration du chatbot

Le script du chatbot est chargé dans la page HTML avec :

```html
<script src="./chatbot/chatbot.js" theme="blue"></script>
```

### Thèmes disponibles pour personnaliser le Chatbot (ses couleurs)

Le paramètre `theme` accepte plusieurs valeurs :
- `blue`
- `red`
- `dark`

Exemple :

```html
<script src="./chatbot/chatbot.js" theme="dark"></script>
```


## Configuration de l'API Groq 

### 1. Créer un compte Groq 

- Se rendre sur [https://console.groq.com](https://console.groq.com)

### 2. Générer une clé API 

- Dans la Groq Console, aller dans la section **API Keys** et générer une clé 
- Lui donner un nom et la copier (⚠️ elle n'est affichée qu'une seule fois)

### 3. Configurer une variable d'environnement 

- dans `.env` non committé copier/coller la clé 

```env
CHATBOT_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx
CHATBOT_API_URL=https://api.groq.com/openai/v1/chat/completions
MODEL=openai/gpt-oss-20b
```

> Note : Groq a déprécié certains anciens modèles (comme `llama-3.1-8b-instant`).
Vérifie la liste des modèles actifs sur la [page des modèles Groq](https://console.groq.com/docs/models) 
avant de choisir

### 4. Installer les dépendances du serveur

```bash
npm install express cors axios dotenv
```

### 5. Créer le serveur Express

Le serveur (`server.js`) fait office de proxy sécurisé entre le widget chatbot 
(frontend) et l'API Groq : il évite d'exposer la clé API côté client

> ⚠️ Tester `/chat` directement dans le navigateur (barre d'adresse) renverra 
une erreur 404, car cette route n'accepte que les requêtes **POST**, pas **GET**.

Lancer le server `node chatbot/chatbotserver.js`

## Licence

Ce projet est fourni à titre d’exemple pédagogique.

