import { getMysteriousResponse, FINAL_MESSAGES } from './ai-assistant.js';

class MysteriousAssistant {
  constructor() {
    this.screen = document.getElementById('assistant-screen');
    this.input = document.getElementById('user-input');
    this.sendBtn = document.getElementById('send-btn');
    this.container = document.querySelector('.container');
    this.body = document.body;
    this.assistantFrame = document.getElementById('assistant-frame');
    
    this.messageCount = 0;
    this.isEnding = false;
    this.hasReceivedLastMessage = false;
    
    this.sendBtn.addEventListener('click', () => this.sendMessage());
    this.input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });
  }

  async sendMessage() {
    const userMessage = this.input.value.trim();
    if (!userMessage) return;

    // Disable input if the ending has occurred
    if (this.isEnding) {
      // Special case for the "one more thing" scenario
      if (this.hasReceivedLastMessage) {
        this.displayMessage(userMessage, 'user');
        this.input.value = '';
        await this.displayAIResponse(FINAL_MESSAGES.third);
        return;
      }
      return;
    }

    this.displayMessage(userMessage, 'user');
    this.input.value = '';

    try {
      this.messageCount++;
      
      // Gradually increase creepiness
      if (this.messageCount === 5) {
        this.body.classList.add('creepy-background');
      }
      
      if (this.messageCount === 8) {
        this.assistantFrame.classList.add('distorted-frame');
      }

      const aiResponse = await getMysteriousResponse(userMessage, this.messageCount);
      this.displayMessage(aiResponse, 'ai');

      // Add more intense creepy effects at higher message counts
      if (this.messageCount > 10) {
        this.addCreepyEffects();
      }

      // Check if this is the final message
      if (aiResponse.includes("Goodbye my friend")) {
        this.triggerFinalEnding();
      }

      // Check if this is the "one more thing" message
      if (aiResponse.includes("one...more...thing")) {
        this.hasReceivedLastMessage = true;
        this.input.disabled = false;
        this.sendBtn.disabled = false;
      }
    } catch (error) {
      this.displayMessage('Error connecting to the void...', 'ai');
    }
  }

  async displayAIResponse(message) {
    this.displayMessage(message, 'ai');
    this.isEnding = true;
    this.input.disabled = true;
    this.sendBtn.disabled = true;
  }

  triggerFinalEnding() {
    this.isEnding = true;
    this.input.disabled = true;
    this.sendBtn.disabled = true;

    // Create blood spatter effect
    const bloodSpatter = document.createElement('div');
    bloodSpatter.classList.add('blood-spatter');
    document.body.appendChild(bloodSpatter);

    // Add random blood drips
    for (let i = 0; i < 10; i++) {
      const bloodDrip = document.createElement('div');
      bloodDrip.classList.add('blood-drip');
      bloodDrip.style.left = `${Math.random() * 100}%`;
      bloodDrip.style.animationDelay = `${Math.random() * 1}s`;
      bloodSpatter.appendChild(bloodDrip);
    }

    // Create a black screen overlay
    const blackScreen = document.createElement('div');
    blackScreen.classList.add('final-black-screen');
    document.body.appendChild(blackScreen);

    // Clear previous content
    this.screen.innerHTML = '';

    // Display final messages with slow typing directly on the black screen
    const finalMessages = [FINAL_MESSAGES.first, FINAL_MESSAGES.second];
    const finalMessageElement = document.createElement('div');
    finalMessageElement.classList.add('message', 'ai-message');
    blackScreen.appendChild(finalMessageElement);

    // Slow typing effect for multiple messages
    let currentMessageIndex = 0;
    let displayedMessage = '';
    const typeMessage = () => {
      if (currentMessageIndex < finalMessages.length) {
        const currentMessage = finalMessages[currentMessageIndex];
        
        if (displayedMessage.length < currentMessage.length) {
          displayedMessage += currentMessage[displayedMessage.length];
          finalMessageElement.textContent = displayedMessage;
        
          setTimeout(typeMessage, 250 + Math.random() * 250);
        } else {
          // Move to next message after a pause
          setTimeout(() => {
            currentMessageIndex++;
            displayedMessage = '';
            
            // If this was the last message, re-enable input
            if (currentMessageIndex === finalMessages.length) {
              this.input.disabled = false;
              this.sendBtn.disabled = false;
              this.hasReceivedLastMessage = true;
            }
            
            typeMessage();
          }, 1500);
        }
      }
    };
    typeMessage();
  }

  addCreepyEffects() {
    // Randomly apply glitch effect to some messages
    const messages = this.screen.querySelectorAll('.message');
    if (messages.length > 0) {
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      randomMessage.classList.add('glitchy-text');
    }
  }

  displayMessage(message, type, isSlowTyping = false) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', `${type}-message`);
    
    // Mysterious glitchy effect
    messageElement.style.animation = 'fadeIn 0.5s forwards, glitch 1s linear infinite';
    
    // Simulate typing effect
    let displayedMessage = '';
    const typeMessage = () => {
      if (displayedMessage.length < message.length) {
        displayedMessage += message[displayedMessage.length];
        messageElement.textContent = displayedMessage;
        
        // Slower typing for final message
        const typingSpeed = isSlowTyping ? 
          250 + Math.random() * 250 :  // Slower typing (250-500ms)
          50;  // Normal typing speed
        
        setTimeout(typeMessage, typingSpeed);
      }
    };
    typeMessage();

    this.screen.appendChild(messageElement);
    this.screen.scrollTop = this.screen.scrollHeight;
  }
}

new MysteriousAssistant();