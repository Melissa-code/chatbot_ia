/**
 * Chatbot AI : function called when the script is loaded in the page
 */
(function() {

  // ============================ data config ============================
  const COLOR_THEMES = {
    blue: {
      primary: '#007bff',
      background: '#f8f9fa',
      messageBg: '#e4e8f3',
      userMessageBg: '#00c8ff',
      botMessageBg: '#252e36',
      botText: '#ffffff',
      border: '#3a70e6', 
      shadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      shadowLight: '0 2px 4px rgba(0, 0, 0, 0.05)',
    },
    red: {
      primary: '#dc3545',
      background: '#f8f9fa',
      messageBg: '#6c757d',
      userMessageBg: '#ff4d4d',
      botMessageBg: '#252e36',
      botText: '#ffffff',
      border: '#f54242',
      shadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      shadowLight: '0 2px 4px rgba(0, 0, 0, 0.05)',
    },
    dark: {
      primary: '#343a40',
      background: '#212529',
      messageBg: '#495057',
      userMessageBg: '#fd6d0d',
      botMessageBg: '#343a40',
      botText: '#ffffff',
      border: '#6c757d',
      shadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      shadowLight: '0 2px 4px rgba(0, 0, 0, 0.05)',
    },
  }; // fin COLOR_THEMES


  // ============================== functions ==============================

  function getThemeColors() {
    const requestedTheme = document.currentScript?.getAttribute('theme') || 'blue';
    return COLOR_THEMES[requestedTheme] || COLOR_THEMES.blue;
  }

  function injectStyles(colors) {
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      #chatbot-open-btn {
        position: fixed; bottom: 20px; right: 20px; width: 50px; height: 50px;
        border-radius: 50%; border: 2px solid ${colors.border}; background: ${colors.primary};
        box-shadow: ${colors.shadow}; cursor: pointer; font-size: 20px; z-index: 9999;
      }
      #chatbot-window {
        display: none; position: fixed; bottom: 80px; right: 20px; width: 320px; height: 420px;
        border: 2px solid ${colors.border}; background: ${colors.background}; box-shadow: ${colors.shadow};
        border-radius: 10px; flex-direction: column; overflow: hidden; z-index: 9999; font-family: sans-serif;
      }
      #chatbot-header {
        background: ${colors.primary}; color: ${colors.botText}; padding: 12px;
        font-weight: bold; display: flex; justify-content: space-between; align-items: center;
      }
      #chatbot-close-btn { cursor: pointer; font-size: 18px; }
      #chatbot-messages {
        flex: 1; overflow-y: auto; padding: 10px; background: ${colors.messageBg};
        display: flex; flex-direction: column; gap: 8px;
      }
      .chat-msg-user {
        align-self: flex-end; background: ${colors.userMessageBg}; color: #000;
        padding: 6px 10px; border-radius: 8px; max-width: 80%; word-break: break-word;
      }
      #chatbot-input-container {
        display: flex; padding: 10px; background: ${colors.background};
        border-top: 1px solid ${colors.border}; gap: 5px;
      }
      #chatbot-input {
        flex: 1; padding: 6px; border: 1px solid ${colors.border}; border-radius: 5px; outline: none;
      }
      #chatbot-send-btn {
        padding: 6px 12px; border: 1px solid ${colors.border}; background: ${colors.primary};
        color: ${colors.botText}; border-radius: 5px; cursor: pointer;
      }
    `;
    document.head.appendChild(styleEl);
  }

  function buildDOM() {
    // btn fot opening the chatbot window
    const openBtn = document.createElement('button');
    openBtn.id = 'chatbot-open-btn';
    openBtn.innerHTML = '💬';

    // chatbot window
    const windowEl = document.createElement('div');
    windowEl.id = 'chatbot-window';
    windowEl.innerHTML = `
      <div id="chatbot-header">
        <span>Chatbot</span>
        <span id="chatbot-close-btn">&times;</span>
      </div>
      <div id="chatbot-messages"></div>
      <div id="chatbot-input-container">
        <input type="text" id="chatbot-input" placeholder="Saisissez votre message..." />
        <button id="chatbot-send-btn">Envoyer</button>
      </div>
    `;

    document.body.appendChild(openBtn);
    document.body.appendChild(windowEl);

    return {
      openBtn,
      windowEl,
      closeBtn: windowEl.querySelector('#chatbot-close-btn'),
      messagesEl: windowEl.querySelector('#chatbot-messages'),
      inputEl: windowEl.querySelector('#chatbot-input'),
      sendBtn: windowEl.querySelector('#chatbot-send-btn'),
    };
  }

  function addUserMessage(messagesContainer, text) {
    const msg = document.createElement('div');
    msg.className = 'chat-msg-user';
    msg.textContent = text; // Sécurité anti-XSS (!= innerHTML)

    messagesContainer.appendChild(msg);
    messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll automatique
  }

  // Events: clicks, keydowns
  function bindEvents(elements) {
    function handleSend() {
      const text = elements.inputEl.value.trim();
      if (!text) return;

      addUserMessage(elements.messagesEl, text);
      elements.inputEl.value = '';
    }

    // "envoyer" button click
    elements.sendBtn.addEventListener('click', handleSend);

    // Enter key press in input field
    elements.inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSend();
    });

    // Open/close chatbot window via open btn (chatbot)
    elements.openBtn.addEventListener('click', () => {
      if (elements.windowEl.style.display === 'flex') {
        elements.windowEl.style.display = 'none';
      } else {
        elements.windowEl.style.display = 'flex';
      } 
    });

    elements.closeBtn.addEventListener('click', () => {
      elements.windowEl.style.display = 'none';
    });
  }

  // =========================== main =============================

  function initChatbot() {
    const colors = getThemeColors(); 
    injectStyles(colors);            
    const elements = buildDOM();     
    bindEvents(elements);            
  }

  initChatbot();

})(); 