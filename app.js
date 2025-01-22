const { useState, useEffect, useMemo, useRef } = React;

function Startup({ onComplete }) {
  const [loadingText, setLoadingText] = useState('Initializing...');
  const [currentFact, setCurrentFact] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    const loadingSteps = [
      'Initializing...',
      'Loading system components...',
      'Connecting to network...',
      'Starting Discord 98...',
      'Almost ready...'
    ];

    const facts = [
      "Discord 98 was created to bring back the nostalgic feel of Windows 98",
      "The settings icon was drawn pixel by pixel",
      "Discord 98's startup sound is actually Windows 98's shutdown sound",
      "The cloud wallpaper was one of Windows 98's most iconic backgrounds",
      "You can right-click text to format it in bold or italic",
      "Mobile mode makes Discord 98 easier to use on phones",
      "The Azure theme is inspired by the classic Windows 98 look",
      "Discord 98 uses the original Windows 98 system font",
      "Each message is stored in a real-time database",
      "The window borders are exactly like Windows 98",
      "You can drag files directly into the chat",
      "Discord 98 supports both light and dark themes"
    ];
    
    // Create and play Windows 98 shutdown sound instead of startup
    const audio = new Audio('https://www.winhistory.de/more/winstart/ogg/win98logoff.ogg');
    audio.play().catch(e => console.log('Audio playback failed:', e));

    // Select one random fact at startup
    setCurrentFact(facts[Math.floor(Math.random() * facts.length)]);

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < loadingSteps.length) {
        setLoadingText(loadingSteps[currentStep]);
        currentStep++;
      }
    }, 600);

    // Start fade out after progress bar completes
    const fadeTimer = setTimeout(() => {
      setIsVisible(false);
      // Wait for fade animation to complete before removing
      setTimeout(onComplete, 500);
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearInterval(interval);
      audio.pause();
    };
  }, []);

  return (
    <>
      <div className={`startup-overlay ${!isVisible ? 'fade-out' : ''}`}></div>
      <div className={`startup window ${!isVisible ? 'fade-out' : ''}`}>
        <div className="title-bar">
          <div className="title-bar-text">Loading Discord 98...</div>
        </div>
        <div className="startup-content">
          <img src="discord 98 logo.png" alt="Discord 98" className="startup-logo" />
          <div className="startup-progress">
            <div className="startup-progress-bar"></div>
          </div>
          <div className="startup-text">{loadingText}</div>
          <div className="startup-fact">{currentFact}</div>
          <div className="startup-footer">We are not affiliated with Discord Inc.</div>
        </div>
      </div>
    </>
  );
}

function Settings({ onClose }) {
  const [mobileMode, setMobileMode] = useState(localStorage.getItem('mobileMode') === 'true');
  const [wallpaper, setWallpaper] = useState(localStorage.getItem('wallpaper') || 'azure');

  const wallpapers = [
    { id: 'azure', name: 'Azure', preview: 'https://win98icons.alexmeub.com/win98-icons/images/azure.jpg' },
    { id: 'clouds', name: 'Clouds', preview: 'https://win98icons.alexmeub.com/win98-icons/images/clouds.jpg' },
    { id: 'grass', name: 'Grass', preview: 'https://win98icons.alexmeub.com/win98-icons/images/grass.jpg' },
    { id: 'beach', name: 'Beach', preview: 'https://win98icons.alexmeub.com/win98-icons/images/beach.jpg' }
  ];

  const handleMobileModeChange = (e) => {
    const newMode = e.target.checked;
    setMobileMode(newMode);
    document.body.classList.toggle('mobile-mode', newMode);
    localStorage.setItem('mobileMode', newMode);
  };

  useEffect(() => {
    wallpapers.forEach(wp => {
      document.body.classList.remove(`wallpaper-${wp.id}`);
    });
    document.body.classList.add(`wallpaper-${wallpaper}`);
    localStorage.setItem('wallpaper', wallpaper);
  }, [wallpaper]);

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="settings-modal window">
        <div className="title-bar">
          <div className="title-bar-text">Settings</div>
          <div className="title-bar-controls">
            <button aria-label="Close" onClick={onClose}></button>
          </div>
        </div>
        <div className="window-body settings-content">
          <div className="settings-section">
            <label>
              <input
                type="checkbox"
                checked={mobileMode}
                onChange={handleMobileModeChange}
              />
              Mobile Mode
            </label>
            <p className="help-text">Optimizes layout for mobile devices</p>
          </div>
          
          <div className="settings-section">
            <label>Wallpaper</label>
            <div className="wallpaper-options">
              {wallpapers.map(wp => (
                <div
                  key={wp.id}
                  className={`wallpaper-option ${wallpaper === wp.id ? 'selected' : ''}`}
                  onClick={() => setWallpaper(wp.id)}
                >
                  <img src={wp.preview} alt={wp.name} />
                  <div className="wallpaper-name">{wp.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function renderFormattedMessage(message) {
  // Split the message into parts that are formatted and unformatted
  const parts = [];
  let currentIndex = 0;
  
  // Regular expressions for bold, italic, and mentions
  const boldRegex = /\*\*(.*?)\*\*/g;
  const italicRegex = /\*(.*?)\*/g;
  const mentionRegex = /@(\w+)/g;
  
  // Find all bold matches
  let boldMatch;
  while ((boldMatch = boldRegex.exec(message)) !== null) {
    if (boldMatch.index > currentIndex) {
      parts.push(message.slice(currentIndex, boldMatch.index));
    }
    parts.push(<strong key={`bold-${boldMatch.index}`}>{boldMatch[1]}</strong>);
    currentIndex = boldMatch.index + boldMatch[0].length;
  }
  
  // Get remaining text
  if (currentIndex < message.length) {
    let remainingText = message.slice(currentIndex);
    
    // Process italic in remaining text
    let italicParts = [];
    let lastIndex = 0;
    let italicMatch;
    
    while ((italicMatch = italicRegex.exec(remainingText)) !== null) {
      if (italicMatch.index > lastIndex) {
        italicParts.push(remainingText.slice(lastIndex, italicMatch.index));
      }
      italicParts.push(<em key={`italic-${italicMatch.index}`}>{italicMatch[1]}</em>);
      lastIndex = italicMatch.index + italicMatch[0].length;
    }
    
    if (lastIndex < remainingText.length) {
      italicParts.push(remainingText.slice(lastIndex));
    }
    
    parts.push(...italicParts);
  }
  
  return parts;
}

function TypingIndicator({ typingUsers }) {
  const [dots, setDots] = useState('');
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '') return '.';
        if (prev === '.') return '..';
        if (prev === '..') return '...';
        return '';
      });
    }, 500);
    
    return () => clearInterval(interval);
  }, []);

  if (typingUsers.length === 0) return null;
  
  let text = '';
  if (typingUsers.length === 1) {
    text = `${typingUsers[0]} is typing${dots}`;
  } else if (typingUsers.length === 2) {
    text = `${typingUsers[0]} and ${typingUsers[1]} are typing${dots}`;
  } else if (typingUsers.length === 3) {
    text = `${typingUsers[0]}, ${typingUsers[1]} and ${typingUsers[2]} are typing${dots}`;
  } else {
    text = `Several people are typing${dots}`;
  }

  return (
    <div className="typing-indicator">
      {text}
    </div>
  );
}

function MessageInput({ onSend, channel }) {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);
  const fileInputRef = useRef(null);
  const textInputRef = useRef(null);
  const room = useMemo(() => new WebsimSocket(), []);

  // Check if user can post in this channel
  const canPost = useMemo(() => {
    if (channel === 'announcements') {
      return room.party.client.username === 'SingusTheFatass';
    }
    return true;
  }, [channel, room.party.client.username]);

  const sanitizeText = (text) => {
    // Replace HTML special characters with their encoded versions
    let sanitized = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
      
    // Special handling for @everyone - only allow for specific user
    if (room.party.client.username !== 'SingusTheFatass') {
      sanitized = sanitized.replace(/@everyone/g, '@\u200Beveryone');
    }
    
    return sanitized;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canPost) return;
    
    const sanitizedText = sanitizeText(text.trim());
    
    if (sanitizedText || file) {
      // Check if the message contains only an image URL
      const imageUrlMatch = sanitizedText.match(/^https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp)$/i);
      if (imageUrlMatch && !file) {
        // If it's just an image URL, send it as an image
        onSend('', null, imageUrlMatch[0]);
      } else {
        onSend(sanitizedText, file);
      }
      setText('');
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleTextChange = async (e) => {
    // Get clipboard items if this is a paste event
    if (e.nativeEvent.inputType === 'insertFromPaste') {
      const clipboardItems = await navigator.clipboard.read().catch(() => []);
      
      for (const item of clipboardItems) {
        // Check if there's an image in the clipboard
        const imageType = item.types.find(type => type.startsWith('image/'));
        if (imageType) {
          const blob = await item.getType(imageType);
          const file = new File([blob], 'pasted-image.png', { type: imageType });
          
          // Use the existing file upload logic
          if (file.size > 50 * 1024 * 1024) {
            alert('File is too large. Please select a file under 50MB.');
            return;
          }
          setFile(file);
          return;
        }
      }
    }

    // Handle regular text input
    const newText = e.target.value.slice(0, 500);
    setText(newText);
      
    // Emit typing event
    if (newText.length > 0) {
      emitTyping();
    }
  };

  const emitTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      room.send({
        type: 'typing_start',
        channel: channel,
      });
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      room.send({
        type: 'typing_stop',
        channel: channel,
      });
    }, 3000);
  };

  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  const handleContextMenu = (e) => {
    e.preventDefault();
    if (!canPost) return;

    // Remove any existing context menus first
    const existingMenu = document.querySelector('.context-menu');
    if (existingMenu) {
      document.body.removeChild(existingMenu);
    }

    const input = textInputRef.current;
    setSelectionStart(input.selectionStart);
    setSelectionEnd(input.selectionEnd);

    if (input.selectionStart === input.selectionEnd) return;

    const contextMenu = document.createElement('div');
    contextMenu.className = 'context-menu window';
    contextMenu.innerHTML = `
      <div class="title-bar">
        <div class="title-bar-text">Format Text</div>
      </div>
      <div class="window-body" style="margin: 4px;">
        <button class="format-button" data-format="bold">Bold</button>
        <button class="format-button" data-format="italic">Italic</button>
      </div>
    `;

    // Get the position of the input element
    const inputRect = input.getBoundingClientRect();
    const selectedText = window.getSelection().toString();
    
    // Position the context menu above the input
    contextMenu.style.position = 'fixed';
    contextMenu.style.left = `${e.clientX}px`; // Position at cursor X
    contextMenu.style.top = `${inputRect.top - 80}px`; // Position above input with more space

    // Ensure the menu stays within viewport bounds
    requestAnimationFrame(() => {
      const menuRect = contextMenu.getBoundingClientRect();
      
      // Adjust horizontal position if menu goes off screen
      if (menuRect.right > window.innerWidth) {
        contextMenu.style.left = `${window.innerWidth - menuRect.width - 8}px`;
      }
      if (menuRect.left < 0) {
        contextMenu.style.left = '8px';
      }
      
      // If menu would go above viewport, position it below the input instead
      if (menuRect.top < 0) {
        contextMenu.style.top = `${inputRect.bottom + 8}px`;
      }
    });

    document.body.appendChild(contextMenu);

    const handleFormat = (format) => {
      const selectedText = text.slice(selectionStart, selectionEnd);
      let formattedText;
      
      if (format === 'bold') {
        formattedText = `**${selectedText}**`;
      } else if (format === 'italic') {
        formattedText = `*${selectedText}*`;
      }

      const newText = 
        text.slice(0, selectionStart) + 
        formattedText + 
        text.slice(selectionEnd);
      
      setText(newText);
      
      // Only try to remove if the menu still exists
      const menuToRemove = document.querySelector('.context-menu');
      if (menuToRemove && menuToRemove.parentNode) {
        document.body.removeChild(menuToRemove);
      }
    };

    const buttons = contextMenu.querySelectorAll('.format-button');
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        handleFormat(button.dataset.format);
      });
    });

    const handleClickOutside = (e) => {
      const menuToRemove = document.querySelector('.context-menu');
      if (menuToRemove && !menuToRemove.contains(e.target)) {
        if (menuToRemove.parentNode) {
          document.body.removeChild(menuToRemove);
        }
        document.removeEventListener('click', handleClickOutside);
      }
    };

    // Small delay to prevent the menu from immediately closing
    setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 0);
  };

  return (
    <form onSubmit={handleSubmit} className="message-input">
      <input
        ref={textInputRef}
        type="text"
        value={text}
        onChange={handleTextChange}
        onPaste={async (e) => {
          // Handle direct image paste
          const items = e.clipboardData?.items;
          if (!items) return;

          for (const item of items) {
            if (item.type.startsWith('image/')) {
              e.preventDefault();
              const file = item.getAsFile();
              if (file) {
                if (file.size > 50 * 1024 * 1024) {
                  alert('File is too large. Please select a file under 50MB.');
                  return;
                }
                setFile(file);
                return;
              }
            }
          }
        }}
        onContextMenu={handleContextMenu}
        placeholder={canPost ? `Type a message (${500 - text.length} characters remaining)...` : "You cannot send messages in this channel"}
        disabled={!canPost}
        maxLength={500}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={(e) => {
          const selectedFile = e.target.files[0];
          if (selectedFile) {
            if (selectedFile.size > 50 * 1024 * 1024) { // 50MB limit
              alert('File is too large. Please select a file under 50MB.');
              e.target.value = '';
              return;
            }
            const supportedTypes = [
              'image/jpeg',
              'image/png',
              'image/gif',
              'image/webp',
              'video/mp4',
              'video/webm',
              'video/ogg'
            ];
            if (!supportedTypes.includes(selectedFile.type)) {
              alert('Please select a supported image (JPEG, PNG, GIF, WEBP) or video (MP4, WEBM, OGG) file.');
              e.target.value = '';
              return;
            }
            setFile(selectedFile);
          }
        }}
        style={{ display: 'none' }}
        disabled={!canPost}
      />
      <button 
        type="button" 
        onClick={() => fileInputRef.current?.click()}
        className="image-button"
        disabled={!canPost}
      >
        📎
      </button>
      <button type="submit" disabled={!canPost}>Send</button>
      {file && (
        <div className="file-preview">
          <span>{file.name}</span>
          <button 
            type="button"
            onClick={() => {
              setFile(null);
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
            }}
          >
            ✕
          </button>
        </div>
      )}
    </form>
  );
}

function Message({ message, room, canDelete }) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);

  // Get reactions for this message
  const reactions = React.useSyncExternalStore(
    room.collection('reaction')
      .filter({ message_id: message.id })
      .subscribe,
    room.collection('reaction')
      .filter({ message_id: message.id })
      .getList
  );

  // Group reactions by emoji
  const groupedReactions = useMemo(() => {
    const groups = {};
    reactions.forEach(reaction => {
      if (!groups[reaction.emoji]) {
        groups[reaction.emoji] = {
          count: 0,
          users: new Set(),
          hasReacted: false
        };
      }
      groups[reaction.emoji].count++;
      groups[reaction.emoji].users.add(reaction.username);
      if (reaction.username === room.party.client.username) {
        groups[reaction.emoji].hasReacted = true;
      }
    });
    return groups;
  }, [reactions, room.party.client.username]);

  const emojis = ['👍', '❤️', '😂', '🎉', '🤔', '👎', '😎', '🔥', '✨', '🎮', '💻', '🌟'];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      await room.collection('message').delete(message.id);
    }
  };

  const handleReact = async (emoji) => {
    const existingReaction = reactions.find(r => 
      r.username === room.party.client.username && r.emoji === emoji
    );

    if (existingReaction) {
      await room.collection('reaction').delete(existingReaction.id);
    } else {
      await room.collection('reaction').create({
        message_id: message.id,
        emoji: emoji
      });
    }
    setShowEmojiPicker(false);
  };

  const renderMessageContent = (text) => {
    if (!text) return null;

    // Regular expressions for formatting
    const urlRegex = /(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/g;
    const mentionRegex = /@(\w+)/g;
    const parts = [];
    let lastIndex = 0;

    // Combined text processing for URLs and mentions
    const combinedRegex = new RegExp(`${urlRegex.source}|${mentionRegex.source}`, 'g');
    let match;

    while ((match = combinedRegex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        const beforeText = text.slice(lastIndex, match.index);
        if (beforeText.includes('*')) {
          parts.push(renderFormattedMessage(beforeText));
        } else {
          parts.push(beforeText);
        }
      }

      // Check if it's a URL or mention
      if (match[0].startsWith('http')) {
        // URL handling
        const url = match[0];
        parts.push(
          <a 
            key={`link-${match.index}`} 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: '#0000FF', textDecoration: 'underline' }}
          >
            {url}
          </a>
        );
      } else {
        // Mention handling
        const mention = match[0];
        const username = mention.slice(1); // Remove @ symbol
        const isMentionValid = username === 'everyone' ? 
          message.username === 'SingusTheFatass' : 
          true;

        parts.push(
          <span
            key={`mention-${match.index}`}
            style={{
              color: isMentionValid ? '#0000FF' : 'inherit',
              backgroundColor: isMentionValid ? 'rgba(0, 0, 255, 0.1)' : 'transparent',
              padding: '0 4px',
              borderRadius: '3px',
              fontWeight: isMentionValid ? 'bold' : 'normal'
            }}
          >
            {mention}
          </span>
        );
      }

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text after the last match
    if (lastIndex < text.length) {
      const remainingText = text.slice(lastIndex);
      if (remainingText.includes('*')) {
        parts.push(renderFormattedMessage(remainingText));
      } else {
        parts.push(remainingText);
      }
    }

    return parts;
  };

  return (
    <div className="message">
      <div className="message-header">
        <img 
          className="avatar" 
          src={`https://images.websim.ai/avatar/${message.username}`}
          alt={message.username} 
        />
        <div className="username-wrapper">
          <span className="username">{message.username}</span>
          {message.username === 'SingusTheFatass' && (
            <svg className="crown-icon" viewBox="0 0 20 20" fill="#FFD700">
              <path d="M2.5 6.5L5.5 15.5H14.5L17.5 6.5L12.5 9.5L10 4.5L7.5 9.5L2.5 6.5Z"/>
              <path d="M4 16.5H16V17.5H4V16.5Z"/>
            </svg>
          )}
        </div>
        <span className="timestamp">
          {new Date(message.created_at).toLocaleTimeString()}
        </span>
      </div>
      <div className="message-content">
        {renderMessageContent(message.text)}
        {(message.imageUrl || message.embedImageUrl) && (
          <div className="message-media">
            {(message.imageUrl || message.embedImageUrl).match(/\.(mp4|webm|ogg)$/i) ? (
              <video 
                src={message.imageUrl || message.embedImageUrl} 
                controls
                style={{ maxWidth: '100%', maxHeight: '400px' }}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <img src={message.imageUrl || message.embedImageUrl} alt="Uploaded content" />
            )}
          </div>
        )}
      </div>
      <div className="message-controls">
        <button 
          className="message-control-button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          😀
        </button>
        {canDelete && (
          <button 
            className="message-control-button"
            onClick={handleDelete}
          >
            🗑️
          </button>
        )}
      </div>
      {showEmojiPicker && (
        <div className="emoji-picker" ref={emojiPickerRef}>
          {emojis.map(emoji => (
            <button 
              key={emoji}
              className="emoji-button"
              onClick={() => handleReact(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
      {Object.entries(groupedReactions).length > 0 && (
        <div className="reactions">
          {Object.entries(groupedReactions).map(([emoji, data]) => (
            <button
              key={emoji}
              className={`reaction ${data.hasReacted ? 'active' : ''}`}
              onClick={() => handleReact(emoji)}
              title={Array.from(data.users).join(', ')}
            >
              {emoji} {data.count}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function UserPopup({ user, onClose }) {
  const [messageInput, setMessageInput] = useState('');
  const popupRef = useRef(null);
  const room = useMemo(() => new WebsimSocket(), []);
  const isOwnProfile = user.username === room.party.client.username;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim()) {
      // Here you would handle sending the DM
      console.log(`Sending message to ${user.username}: ${messageInput}`);
      setMessageInput('');
    }
  };

  return (
    <div className="user-popup window" ref={popupRef}>
      <div className="title-bar">
        <div className="title-bar-text">
          {user.username}
          {user.username === 'SingusTheFatass' && (
            <svg className="crown-icon" viewBox="0 0 20 20" fill="#FFD700">
              <path d="M2.5 6.5L5.5 15.5H14.5L17.5 6.5L12.5 9.5L10 4.5L7.5 9.5L2.5 6.5Z"/>
              <path d="M4 16.5H16V17.5H4V16.5Z"/>
            </svg>
          )}
        </div>
        <div className="title-bar-controls">
          <button aria-label="Close" onClick={onClose}></button>
        </div>
      </div>
      <div className="window-body user-popup-content">
        <div className="user-info">
          <img 
            className="user-popup-avatar" 
            src={user.avatarUrl} 
            alt={user.username} 
          />
          <div className="user-popup-details">
            <div className="user-popup-username">{user.username}</div>
            <div className="user-popup-status">
              <span className={`status-indicator ${user.online ? 'online' : 'offline'}`}></span>
              {user.online ? 'Online' : 'Offline'}
            </div>
          </div>
        </div>
        <div className="user-popup-badges">
          {user.badges?.map((badge, index) => (
            <div key={index} className="user-badge">
              {badge}
            </div>
          ))}
        </div>
        <div className="message-input-container">
          {isOwnProfile ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '8px', 
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '4px',
              color: '#fff',
              fontStyle: 'italic'
            }}>
              This is you silly, you can't message yourself!
            </div>
          ) : (
            <form onSubmit={handleSendMessage}>
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder={`Message @${user.username}`}
              />
              <button type="submit">
                <span role="img" aria-label="Send">😊</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function DirectMessageView({ selectedUser, onClose }) {
  const room = useMemo(() => new WebsimSocket(), []);
  const messagesRef = useRef(null);
  const [messageInput, setMessageInput] = useState('');

  // Get DM messages between current user and selected user ONLY
  const messages = React.useSyncExternalStore(
    room.collection('direct_message')
      .filter(msg => 
        (msg.from === room.party.client.username && msg.to === selectedUser?.username) ||
        (msg.from === selectedUser?.username && msg.to === room.party.client.username)
      )
      .subscribe,
    room.collection('direct_message')
      .filter(msg => 
        (msg.from === room.party.client.username && msg.to === selectedUser?.username) ||
        (msg.from === selectedUser?.username && msg.to === room.party.client.username)
      )
      .getList
  );

  useEffect(() => {
    // Scroll to bottom when messages update or user changes
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, selectedUser]);

  if (!selectedUser) {
    return (
      <div className="dm-content">
        <div className="dm-placeholder">
          Select a user to start messaging
        </div>
      </div>
    );
  }

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (messageInput.trim()) {
      await room.collection('direct_message').create({
        text: messageInput.trim(),
        from: room.party.client.username,
        to: selectedUser.username,
        timestamp: new Date().toISOString()
      });
      setMessageInput('');
    }
  };

  return (
    <div className="dm-chat">
      <div className="dm-header">
        <div className="dm-header-info">
          <img 
            className="avatar" 
            src={selectedUser.avatarUrl}
            alt={selectedUser.username} 
          />
          <span className="username">{selectedUser.username}</span>
        </div>
      </div>
      <div className="dm-messages" ref={messagesRef}>
        <div className="dm-start-message">
          This is the beginning of your direct message history with {selectedUser.username}.
        </div>
        {messages.map(message => (
          <div key={message.id} className={`message ${message.from === room.party.client.username ? 'sent' : 'received'}`}>
            <div className="message-header">
              <img 
                className="avatar" 
                src={`https://images.websim.ai/avatar/${message.from}`}
                alt={message.from} 
              />
              <span className="username">{message.from}</span>
              <span className="timestamp">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <div className="message-content">
              {message.text}
            </div>
          </div>
        ))}
      </div>
      <form className="dm-input" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder={`Message @${selectedUser.username}`}
          maxLength={500}
        />
      </form>
    </div>
  );
}

function App() {
  const room = useMemo(() => new WebsimSocket(), []);
  const [startupComplete, setStartupComplete] = useState(false);  
  const [currentView, setCurrentView] = useState('server'); 
  const [currentChannel, setCurrentChannel] = useState('general');
  const [showSettings, setShowSettings] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [notifications, setNotifications] = useState({
    messages: 0,
    server: 0
  });

  // Always call hooks unconditionally at the top level
  const messages = React.useSyncExternalStore(
    room.collection('message').filter({ channel: currentChannel }).subscribe,
    room.collection('message').filter({ channel: currentChannel }).getList
  );

  const peers = React.useSyncExternalStore(
    room.party.subscribe,
    () => room.party.peers
  );

  const users = React.useSyncExternalStore(
    room.collection('user').subscribe,
    room.collection('user').getList
  );

  useEffect(() => {
    const mobileMode = localStorage.getItem('mobileMode') === 'true';
    document.body.classList.toggle('mobile-mode', mobileMode);
  }, []);

  // Create user record when visiting
  useEffect(() => {
    const createUserRecord = async () => {
      // Get existing user record if it exists
      const existingUser = await room.collection('user')
        .filter({ username: room.party.client.username })
        .getList();

      // Only create if user doesn't exist
      if (existingUser.length === 0) {
        await room.collection('user').create({
          username: room.party.client.username,
          avatarUrl: `https://images.websim.ai/avatar/${room.party.client.username}`,
          last_seen: new Date().toISOString()
        });
      } else {
        // Update last seen time
        await room.collection('user').update(existingUser[0].id, {
          last_seen: new Date().toISOString()
        });
      }
    };
    
    createUserRecord();
  }, [room]);

  useEffect(() => {
    const wallpaper = localStorage.getItem('wallpaper') || 'azure';
    document.body.classList.add(`wallpaper-${wallpaper}`);
  }, []);

  useEffect(() => {
    room.onmessage = (event) => {
      const data = event.data;
      if (data.type === 'typing_start' && data.channel === currentChannel) {
        setTypingUsers(prev => new Set([...prev, data.username]));
      } else if (data.type === 'typing_stop' && data.channel === currentChannel) {
        setTypingUsers(prev => {
          const next = new Set([...prev]);
          next.delete(data.username);
          return next;
        });
      }
    };

    // Subscribe to new messages
    const unsubscribeMessages = room.collection('message').subscribe((messages) => {
      const latestMessage = messages[messages.length - 1];
      if (latestMessage && latestMessage.username !== room.party.client.username) {
        // Check for mentions
        if (latestMessage.text && latestMessage.text.includes(`@${room.party.client.username}`)) {
          playNotificationSound('mention');
          if (currentView !== 'server') {
            setNotifications(prev => ({
              ...prev,
              server: prev.server + 1
            }));
          }
        }
      }
    });

    // Subscribe to direct messages
    const unsubscribeDMs = room.collection('direct_message').subscribe((messages) => {
      const latestDM = messages[messages.length - 1];
      if (latestDM && latestDM.to === room.party.client.username) {
        playNotificationSound('dm');
        if (currentView !== 'messages') {
          setNotifications(prev => ({
            ...prev,
            messages: prev.messages + 1
          }));
        }
      }
    });

    return () => {
      unsubscribeMessages();
      unsubscribeDMs();
    };
  }, [currentChannel, currentView, room]);

  // Clear notifications when switching views
  useEffect(() => {
    if (currentView === 'server') {
      setNotifications(prev => ({...prev, server: 0}));
    } else if (currentView === 'messages') {
      setNotifications(prev => ({...prev, messages: 0}));
    }
  }, [currentView]);

  const handleStartupComplete = () => {
    setStartupComplete(true);
  };

  const playNotificationSound = (type) => {
    const soundElement = document.getElementById(type === 'mention' ? 'mentionSound' : 'dmSound');
    if (soundElement) {
      soundElement.currentTime = 0;
      soundElement.play().catch(err => console.log('Error playing sound:', err));
    }
  };

  const handleSendMessage = async (text, file, embedImageUrl = null) => {
    let imageUrl = null;
    if (file) {
      try {
        imageUrl = await websim.upload(file);
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image. Please try again.');
        return;
      }
    }

    await room.collection('message').create({
      text,
      imageUrl,
      embedImageUrl,
      channel: currentChannel,
    });
  };

  const handleUserClick = (user) => {
    if (currentView === 'messages') {
      setSelectedUser(user);
    }
  };

  // Create arrays of online and offline users
  const onlineUsers = Object.values(peers);
  const offlineUsers = users
    .filter(user => !onlineUsers.some(peer => peer.username === user.username))
    .map(user => ({
      username: user.username,
      avatarUrl: user.avatarUrl,
      last_seen: user.last_seen
    }));

  // Hide content until startup is complete
  if (!startupComplete) {
    return <Startup onComplete={handleStartupComplete} />;
  }

  const channels = [
    'general',
    'random',
    'help',
    'announcements'
  ];

  return (
    <div className="layout">
      <div className="main-container">
        <div className="window">
          <div className="title-bar">
            <div className="title-bar-text">Discord 98</div>
            <div className="title-bar-controls">
              <button aria-label="Minimize"></button>
              <button aria-label="Maximize"></button>
              <button aria-label="Close"></button>
            </div>
          </div>
          <div className="window-body">
            <div className="server-list">
              <div 
                className={`server-button ${currentView === 'messages' ? 'active' : ''}`}
                onClick={() => setCurrentView('messages')}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                </svg>
                {notifications.messages > 0 && (
                  <div className="notification-badge">{notifications.messages}</div>
                )}
              </div>
              <div 
                className={`server-button ${currentView === 'server' ? 'active' : ''}`}
                onClick={() => setCurrentView('server')}
              >
                <img src="discord 98 logo.png" alt="Discord 98" />
                {notifications.server > 0 && (
                  <div className="notification-badge">{notifications.server}</div>
                )}
              </div>
            </div>

            {currentView === 'server' ? (
              // Server view content
              <>
                <div className="channels">
                  <div className="channels-top">
                    <div className="tree-view">
                      <details open>
                        <summary>Text Channels</summary>
                        {channels.map(channel => (
                          <div 
                            key={channel}
                            className={`channel ${channel === currentChannel ? 'active' : ''}`}
                            onClick={() => setCurrentChannel(channel)}
                          >
                            # {channel}
                          </div>
                        ))}
                      </details>
                    </div>
                  </div>
                  <div className="channels-bottom">
                    <div className="settings-button" onClick={() => setShowSettings(true)}>
                      <svg className="settings-icon" viewBox="0 0 16 16">
                        <path fill="currentColor" d="M8 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM6.5 8a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0z"/>
                        <path fill="currentColor" d="M9.05 3.631c.362-1.119 1.952-1.119 2.314 0l.436 1.343a1.256 1.256 0 0 0 1.591.832l1.343-.436c1.119-.362 2.314.653 1.952 1.772l-.436 1.343a1.256 1.256 0 0 0 .832 1.591l-1.343-.436a1.256 1.256 0 0 0-1.591.832l-1.343.436c-1.119.362-2.314-.653-1.952-1.772l.436-1.343a1.256 1.256 0 0 0-.832-1.591l-1.343-.436c-1.119-.362-1.119-1.952 0-2.314l1.343-.436a1.256 1.256 0 0 0 .832-1.591l.436-1.343z"/>
                      </svg>
                      Settings
                    </div>
                  </div>
                </div>
                <div className="messages">
                  <div className="message-list">
                    {messages.map(message => (
                      <Message 
                        key={message.id} 
                        message={message} 
                        room={room}
                        canDelete={message.username === room.party.client.username}
                      />
                    ))}
                  </div>
                  <TypingIndicator typingUsers={[...typingUsers]} />
                  <MessageInput onSend={handleSendMessage} channel={currentChannel} />
                </div>
                <div className="online-users">
                  <div className="tree-view">
                    <details open>
                      <summary>Online - {onlineUsers.length}</summary>
                      {onlineUsers.map(peer => (
                        <div 
                          key={peer.username} 
                          className="user"
                          onClick={() => handleUserClick(peer)}
                        >
                          <img 
                            className="avatar" 
                            src={peer.avatarUrl}
                            alt={peer.username} 
                          />
                          <div className="username-wrapper">
                            <span>{peer.username}</span>
                            {peer.username === 'SingusTheFatass' && (
                              <svg className="crown-icon" viewBox="0 0 20 20" fill="#FFD700">
                                <path d="M2.5 6.5L5.5 15.5H14.5L17.5 6.5L12.5 9.5L10 4.5L7.5 9.5L2.5 6.5Z"/>
                                <path d="M4 16.5H16V17.5H4V16.5Z"/>
                              </svg>
                            )}
                          </div>
                        </div>
                      ))}
                    </details>
                    <details open>
                      <summary>Offline - {offlineUsers.length}</summary>
                      {offlineUsers.map(user => (
                        <div 
                          key={user.username} 
                          className="user offline"
                          onClick={() => handleUserClick(user)}
                        >
                          <img 
                            className="avatar" 
                            src={user.avatarUrl}
                            alt={user.username} 
                          />
                          <div className="username-wrapper">
                            <span>{user.username}</span>
                            {user.username === 'SingusTheFatass' && (
                              <svg className="crown-icon" viewBox="0 0 20 20" fill="#FFD700">
                                <path d="M2.5 6.5L5.5 15.5H14.5L17.5 6.5L12.5 9.5L10 4.5L7.5 9.5L2.5 6.5Z"/>
                                <path d="M4 16.5H16V17.5H4V16.5Z"/>
                              </svg>
                            )}
                          </div>
                        </div>
                      ))}
                    </details>
                  </div>
                </div>
              </>
            ) : (
              // Messages view content
              <div className="direct-messages-layout">
                <div className="dm-sidebar">
                  <div className="tree-view">
                    <details open>
                      <summary>Direct Messages</summary>
                      {onlineUsers.concat(offlineUsers)
                        .filter(user => user.username !== room.party.client.username)
                        .map(user => (
                          <div 
                            key={user.username} 
                            className={`user ${!user.online ? 'offline' : ''}`}
                            onClick={() => handleUserClick(user)}
                          >
                            <img 
                              className="avatar" 
                              src={user.avatarUrl || `https://images.websim.ai/avatar/${user.username}`}
                              alt={user.username} 
                            />
                            <span>{user.username}</span>
                          </div>
                        ))}
                    </details>
                  </div>
                </div>
                <DirectMessageView 
                  selectedUser={selectedUser} 
                  onClose={() => setSelectedUser(null)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      {currentView === 'server' && selectedUser && (
        <>
          <div className="modal-overlay" onClick={() => setSelectedUser(null)} />
          <UserPopup 
            user={selectedUser} 
            onClose={() => setSelectedUser(null)} 
          />
        </>
      )}
      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);