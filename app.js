document.addEventListener('DOMContentLoaded', () => {
  const desktop = document.getElementById('desktop');
  const loginScreen = document.getElementById('login-screen');
  const loginForm = document.getElementById('login-form');
  const timeDisplay = document.getElementById('time');
  const videoFeed = document.getElementById('video-feed');
  const createVideoBtn = document.getElementById('create-video');
  const refreshFeedBtn = document.getElementById('refresh-feed');
  const videoPlayerModal = document.getElementById('video-player-modal');
  const shutdownBtn = document.getElementById('shutdown-btn');
  const logoutModal = document.getElementById('logout-modal');
  const userProfileModal = document.getElementById('user-profile-modal');
  const forYouBtn = document.getElementById('for-you-btn');
  const exploreBtn = document.getElementById('explore-btn');
  const startupSound = document.getElementById('startup-sound');
  const shutdownSound = document.getElementById('shutdown-sound');

  // Window Dragging Functionality
  function makeWindowDraggable(windowElement) {
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    const titleBar = windowElement.querySelector('.window-title-bar');

    titleBar.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    function dragStart(e) {
      // Prevent dragging if clicking on close/minimize buttons
      if (e.target.classList.contains('window-controls') || 
          e.target.closest('.window-controls')) {
        return;
      }

      initialX = e.clientX - xOffset;
      initialY = e.clientY - yOffset;

      if (e.target === titleBar) {
        isDragging = true;
      }
    }

    function drag(e) {
      if (isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;

        xOffset = currentX;
        yOffset = currentY;

        setTranslate(currentX, currentY, windowElement);
      }
    }

    function dragEnd(e) {
      initialX = currentX;
      initialY = currentY;

      isDragging = false;
    }

    function setTranslate(xPos, yPos, el) {
      el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    }
  }

  // Expanded video library with 1,000,000 videos
  const videoLibrary = [
    ...Array.from({length: 1000000}, (_, i) => ({
      id: i + 9, // Start from ID 9
      title: [
        'Totally Radical Moment',
        'Awesome 90s Compilation',
        'Extreme Sports Highlight',
        'Vintage Tech Unboxing',
        'Cool Skateboard Trick',
        'Street Dance Performance',
        'Retro Gaming Session',
        'DIY 90s Craft Tutorial',
        'Vintage Fashion Show',
        'Rollerblading Adventure',
        'Mixtape Creation Guide',
        'Arcade Game Marathon',
        'BMX Stunt Reel',
        'Vintage Computer Build',
        'Music Video Parody',
        'Urban Street Art',
        'Breakdancing Competition',
        'Vintage Commercial Remix',
        'Extreme Snowboarding',
        'Punk Rock Garage Band'
      ][Math.floor(Math.random() * 20)] + ` (${i + 1})`,
      user: [
        'SkaterBoi98', 'TechNostalgia', 'DJ_Millennium', 
        'UrbanSkater', 'GameGenius', 'RetroRanger', 
        'CoolKid95', 'MusicMaster', 'ArcadeChamp', 
        'FashionTime', 'DIYDude', 'SportsFever'
      ][Math.floor(Math.random() * 12)],
      views: Math.floor(Math.random() * 100000) + 100,
      description: [
        'Capturing the essence of the 90s!',
        'Totally radical content right here!',
        'Bringing back nostalgic vibes!',
        'Epic moment from the best decade ever!',
        'Check out this awesome throwback!',
        'Extreme skills from the 90s!',
        'Vintage coolness at its finest!',
        'Retro content that never gets old!',
        'Celebrating the most awesome era!',
        'A glimpse into the coolest decade!'
      ][Math.floor(Math.random() * 10)],
      hashtags: [
        '#90sVibes', '#Retro', '#VintageContent', 
        '#WindowsDays', '#TotallyRadical', '#NostalgiaTrip', 
        '#ClassicCool', '#ThrowbackThursday', '#OldSchool',
        '#SkateLife', '#TechNostalgia', '#MusicScene', 
        '#VintageGaming', '#StreetStyle', '#ExtremeAction'
      ].sort(() => 0.5 - Math.random()).slice(0, 3),
      comments: Array.from({length: Math.floor(Math.random() * 5) + 1}, () => ({
        user: [
          'CoolKid95', 'SportsFreak', 'TechNerd', 'MusicLover', 
          'DanceFever', 'RetroGamer', 'StreetStyle', 'GeekSquad'
        ][Math.floor(Math.random() * 8)],
        text: [
          'Awesome video!',
          'Totally radical!',
          'This brings back memories!',
          'So cool!',
          'Wish I could go back to the 90s!',
          'Epic content!',
          'Love the vintage vibes!',
          'This is what the 90s were all about!'
        ][Math.floor(Math.random() * 8)]
      }))
    }))
  ].map(video => ({
    ...video,
    favorites: Math.floor(Math.random() * 50) // Random initial favorites count
  }));

  let currentVideos = [...videoLibrary];

  // Explore videos (random selection from library)
  const exploreVideos = [...videoLibrary].sort(() => 0.5 - Math.random());

  // Update user profiles to handle the larger video library
  const userProfiles = {
    'SkaterBoi98': {
      displayName: 'Sk8r Dude',
      bio: 'Radical skateboarding moves! ',
      videos: videoLibrary.filter(v => v.user === 'SkaterBoi98').length,
      followers: 1337,
      following: 42,
      userVideos: videoLibrary.filter(v => v.user === 'SkaterBoi98')
    },
    'AnimalLover': {
      displayName: 'Pet Enthusiast',
      bio: 'Sharing adorable pet moments! ',
      videos: videoLibrary.filter(v => v.user === 'AnimalLover').length,
      followers: 789,
      following: 55,
      userVideos: videoLibrary.filter(v => v.user === 'AnimalLover')
    },
    'DJ_Millennium': {
      displayName: 'Digital DJ',
      bio: 'Dropping beats since the 90s! ',
      videos: videoLibrary.filter(v => v.user === 'DJ_Millennium').length,
      followers: 2048,
      following: 30,
      userVideos: videoLibrary.filter(v => v.user === 'DJ_Millennium')
    },
    // Add more dynamic user profiles based on the video library
    ...Object.fromEntries(
      [...new Set(videoLibrary.map(v => v.user))]
        .filter(username => !['SkaterBoi98', 'AnimalLover', 'DJ_Millennium'].includes(username))
        .map(username => [username, {
          displayName: username,
          bio: 'Awesome 90s content creator!',
          videos: videoLibrary.filter(v => v.user === username).length,
          followers: Math.floor(Math.random() * 1000) + 100,
          following: Math.floor(Math.random() * 100) + 10,
          userVideos: videoLibrary.filter(v => v.user === username)
        }])
    )
  };

  // Favorites functionality
  const favoritesModal = document.getElementById('favorites-modal');
  const favoritesList = document.getElementById('favorites-list');
  const favoriteVideos = new Set();

  // Function to toggle favorite status with more dynamic interaction
  function toggleFavorite(videoId) {
    const video = currentVideos.find(v => v.id === parseInt(videoId));
    if (!video) return;

    // More dynamic favorite mechanism
    if (favoriteVideos.has(videoId)) {
      favoriteVideos.delete(videoId);
      // Small chance of keeping a favorite
      video.favorites = Math.max(0, video.favorites - (Math.random() < 0.3 ? 1 : 0));
    } else {
      favoriteVideos.add(videoId);
      // Random boost to favorites when newly favorited
      video.favorites += Math.floor(Math.random() * 3) + 1;
    }

    // Update UI
    updateVideoFavoriteStatus(videoId);
    updateFavoritesList();
    generateRetroVideos(); // Refresh to show updated favorite status
  }

  // Periodically simulate natural growth of favorites
  function simulateFavoritesGrowth() {
    videoLibrary.forEach(video => {
      // Random chance of favorites increasing
      if (Math.random() < 0.2) {
        video.favorites += Math.floor(Math.random() * 2) + 1;
      }
    });

    // Refresh UI to reflect changes
    generateRetroVideos();
  }

  // Run favorites growth simulation every few seconds
  setInterval(simulateFavoritesGrowth, 5000);

  // Update favorite status in the UI
  function updateVideoFavoriteStatus(videoId) {
    const videoItem = document.querySelector(`.video-item[data-video-id="${videoId}"]`);
    if (videoItem) {
      const favoriteBtn = videoItem.querySelector('.favorite-btn');
      if (favoriteBtn) {
        favoriteBtn.classList.toggle('favorited', favoriteVideos.has(videoId));
        
        // Add or remove favorite indicator
        let favoriteIndicator = videoItem.querySelector('.favorite-indicator');
        if (!favoriteIndicator) {
          favoriteIndicator = document.createElement('span');
          favoriteIndicator.classList.add('favorite-indicator');
          videoItem.querySelector('strong').appendChild(favoriteIndicator);
        }
        
        favoriteIndicator.textContent = favoriteVideos.has(videoId) ? '❤️' : '';
      }
    }
  }

  // Update favorites list modal
  function updateFavoritesList() {
    const favoritedVideos = currentVideos.filter(v => favoriteVideos.has(v.id));
    
    // Ensure unique favorites by using a Set or filtering duplicates
    const uniqueFavoritedVideos = Array.from(new Set(favoritedVideos.map(v => v.id)))
      .map(id => favoritedVideos.find(v => v.id === id));
    
    favoritesList.innerHTML = uniqueFavoritedVideos.length > 0 
      ? uniqueFavoritedVideos.map(video => `
          <div class="video-item" data-video-id="${video.id}" style="border: 1px solid #808080; margin: 5px; padding: 5px;">
            <strong>${video.title}</strong>
            <p>By: ${video.user} | ${video.views} views</p>
            <p>Favorites: ${video.favorites || 0}</p>
          </div>
        `).join('')
      : '<p>No favorite videos yet!</p>';

    // Add click events to favorited videos
    uniqueFavoritedVideos.forEach(video => {
      const videoEl = favoritesList.querySelector(`[data-video-id="${video.id}"]`);
      if (videoEl) {
        videoEl.addEventListener('click', () => openVideoPlayer(video.id));
      }
    });
  }

  // Update system time
  function updateTime() {
    const now = new Date();
    timeDisplay.textContent = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  }
  updateTime();
  setInterval(updateTime, 1000);

  // Simulate 90s video feed with shuffle
  let generateRetroVideos; 

  // Switch video feed
  function switchFeed(isForYou = true) {
    // Toggle active button state
    forYouBtn.classList.toggle('active', isForYou);
    exploreBtn.classList.toggle('active', !isForYou);

    // Switch video feed content
    currentVideos = isForYou ? [...videoLibrary] : exploreVideos;
    generateRetroVideos();
  }

  // Function to add comment
  function addComment(videoId, commentText) {
    const video = currentVideos.find(v => v.id === parseInt(videoId));
    if (!video || !commentText.trim()) return;

    // Use current username or a default guest name
    const username = 'Guest' + Math.floor(Math.random() * 1000);
    
    // Create new comment
    const newComment = {
      user: username,
      text: commentText.trim()
    };

    // Add comment to video
    video.comments.unshift(newComment);

    // Update comments in the video player modal
    const commentsContainer = document.getElementById('video-comments');
    const commentInput = document.getElementById('comment-input');
    
    // Prepend new comment to the list
    const commentEl = document.createElement('div');
    commentEl.classList.add('comment');
    commentEl.innerHTML = `
      <strong>${newComment.user}</strong>
      <p>${newComment.text}</p>
    `;
    commentsContainer.insertBefore(commentEl, commentsContainer.firstChild);

    // Clear input
    commentInput.value = '';
  }

  // Open video player
  function openVideoPlayer(videoId) {
    const video = currentVideos.find(v => v.id === parseInt(videoId));
    if (!video) return;

    document.getElementById('video-title').textContent = video.title;
    document.getElementById('video-user').textContent = `Uploaded by: ${video.user}`;
    document.getElementById('video-views').textContent = `Views: ${video.views}`;
    document.getElementById('video-hashtags').innerHTML = `Hashtags: ${video.hashtags.map(tag => `<span class="hashtag">${tag}</span>`).join(' ')}`;
    
    // Enhanced favorites display
    const favoritesCountEl = document.createElement('p');
    favoritesCountEl.innerHTML = `
      <strong>Favorites:</strong> ${video.favorites || 0} 
      <span style="color: red; margin-left: 5px;">❤️</span>
    `;
    document.querySelector('.video-details').appendChild(favoritesCountEl);

    // Populate comments
    const commentsContainer = document.getElementById('video-comments');
    commentsContainer.innerHTML = video.comments.map(comment => `
      <div class="comment">
        <strong>${comment.user}</strong>
        <p>${comment.text}</p>
      </div>
    `).join('');

    // Reset video player state
    const videoPlaceholder = document.querySelector('.video-player-placeholder');
    const playPauseBtn = document.querySelector('.play-pause');
    const stopBtn = document.querySelector('.stop');
    const progressBar = document.querySelector('.progress-bar');

    videoPlaceholder.classList.remove('playing', 'paused');
    playPauseBtn.textContent = '';
    progressBar.style.width = '0%';

    // Add comment submission event listener
    const commentInput = document.getElementById('comment-input');
    const submitCommentBtn = document.getElementById('submit-comment');
    
    // Remove any existing event listeners to prevent multiple bindings
    submitCommentBtn.onclick = null;
    
    submitCommentBtn.onclick = () => {
      addComment(videoId, commentInput.value);
    };

    // Allow submission by pressing Enter key
    commentInput.onkeypress = (e) => {
      if (e.key === 'Enter') {
        addComment(videoId, commentInput.value);
      }
    };

    videoPlayerModal.style.display = 'flex';
  }

  // Close video player
  function closeVideoPlayer() {
    videoPlayerModal.style.display = 'none';
  }

  // Function to open user profile
  function openUserProfile(username) {
    const profile = userProfiles[username];
    if (!profile) return;

    // Update profile details with more emphasis on uploaded videos and followers
    document.getElementById('profile-username').textContent = username;
    document.getElementById('profile-display-name').textContent = profile.displayName;
    document.getElementById('profile-bio').textContent = profile.bio;
    
    // Highlight videos uploaded and followers
    document.getElementById('profile-videos-count').textContent = profile.videos;
    document.getElementById('profile-followers-count').textContent = profile.followers;
    document.getElementById('profile-following-count').textContent = profile.following;

    // Add a note about private liked videos
    const privateVideosNote = document.createElement('p');
    privateVideosNote.textContent = 'Liked videos are private';
    privateVideosNote.style.fontSize = '0.8em';
    privateVideosNote.style.color = '#666';
    document.querySelector('.profile-stats').appendChild(privateVideosNote);

    // Populate user's videos
    const profileVideosContainer = document.getElementById('profile-videos-container');
    profileVideosContainer.innerHTML = profile.userVideos.map(video => `
      <div class="profile-video-item" data-video-id="${video.id}">
        <div>${video.title}</div>
        <div>Views: ${video.views}</div>
      </div>
    `).join('');

    // Add click event to profile videos
    profileVideosContainer.querySelectorAll('.profile-video-item').forEach(item => {
      item.addEventListener('click', () => openVideoPlayer(item.dataset.videoId));
    });

    userProfileModal.style.display = 'flex';
  }

  // Close user profile modal
  function closeUserProfile() {
    userProfileModal.style.display = 'none';
  }

  // Video Player Controls
  function handlePlayPause() {
    const videoPlaceholder = document.querySelector('.video-player-placeholder');
    const playPauseBtn = document.querySelector('.play-pause');
    const progressBar = document.querySelector('.progress-bar');

    if (videoPlaceholder.classList.contains('playing')) {
      // Pause
      videoPlaceholder.classList.remove('playing');
      videoPlaceholder.classList.add('paused');
      playPauseBtn.textContent = '';
      // Stop progress animation
      progressBar.style.animationPlayState = 'paused';
    } else {
      // Play
      videoPlaceholder.classList.add('playing');
      videoPlaceholder.classList.remove('paused');
      playPauseBtn.textContent = '';
      // Start progress animation
      progressBar.style.animation = 'progress 10s linear forwards';
      progressBar.style.animationPlayState = 'running';
    }
  }

  function handleStop() {
    const videoPlaceholder = document.querySelector('.video-player-placeholder');
    const playPauseBtn = document.querySelector('.play-pause');
    const progressBar = document.querySelector('.progress-bar');

    videoPlaceholder.classList.remove('playing', 'paused');
    playPauseBtn.textContent = '';
    progressBar.style.width = '0%';
    progressBar.style.animation = 'none';
  }

  createVideoBtn.addEventListener('click', () => {
    alert('Video Recording: Connect your WebCam!');
  });

  refreshFeedBtn.addEventListener('click', generateRetroVideos);

  // Close video player button
  document.querySelector('._close-video').addEventListener('click', closeVideoPlayer);

  // Play/Pause button
  document.querySelector('.play-pause').addEventListener('click', handlePlayPause);

  // Stop button
  document.querySelector('.stop').addEventListener('click', handleStop);

  // Add event listener for closing user profile modal
  document.querySelector('._close-profile').addEventListener('click', closeUserProfile);

  // Add event listeners for feed navigation
  forYouBtn.addEventListener('click', () => switchFeed(true));
  exploreBtn.addEventListener('click', () => switchFeed(false));

  // Open favorites modal
  function openFavoritesModal() {
    updateFavoritesList();
    favoritesModal.style.display = 'flex';
  }

  // Close favorites modal
  function closeFavoritesModal() {
    favoritesModal.style.display = 'none';
  }

  // Add event listener for favorites modal close button
  document.querySelector('._close-favorites').addEventListener('click', closeFavoritesModal);

  // Add a button to open favorites in the taskbar or somewhere appropriate
  const favoritesBtn = document.createElement('button');
  favoritesBtn.textContent = 'Favorites';
  favoritesBtn.addEventListener('click', openFavoritesModal);
  document.querySelector('.system-tray').appendChild(favoritesBtn);

  // Logout and Shutdown Functionality
  function showLogoutModal() {
    logoutModal.style.display = 'flex';
  }

  function hideLogoutModal() {
    logoutModal.style.display = 'none';
  }

  function performShutdown() {
    // Play shutdown sound
    shutdownSound.play().catch(e => {
      console.warn('Shutdown sound could not be played', e);
    });

    // Simulate shutdown screen
    document.body.innerHTML = `
      <div class="shutdown-screen">
        <p>98Tok is shutting down...</p>
      </div>
    `;
    
    // Optional: Add a timeout to simulate computer turning off
    setTimeout(() => {
      // You could reload the page or perform any other shutdown action
      window.location.reload();
    }, 2000);
  }

  // Quick login users
  const quickLoginUsers = [
    'SkaterBoi98', 
    'DJ_Millennium', 
    'AnimalLover', 
    'CurrentUser',
    ...Object.keys(userProfiles)
  ];

  // Pagination for quick login users
  const quickLoginUsersContainer = document.getElementById('quick-login-users');
  const prevUsersBtn = document.getElementById('prev-users-btn');
  const nextUsersBtn = document.getElementById('next-users-btn');
  const usersPageInfo = document.getElementById('users-page-info');

  const USERS_PER_PAGE = 10;
  let currentUserPage = 1;

  function populateQuickLoginUsers() {
    const startIndex = (currentUserPage - 1) * USERS_PER_PAGE;
    const endIndex = startIndex + USERS_PER_PAGE;
    const paginatedUsers = quickLoginUsers.slice(startIndex, endIndex);

    quickLoginUsersContainer.innerHTML = paginatedUsers.map(username => `
      <button class="quick-login-user" data-username="${username}">${username}</button>
    `).join('');

    // Update pagination info and button states
    const totalPages = Math.ceil(quickLoginUsers.length / USERS_PER_PAGE);
    usersPageInfo.textContent = `Page ${currentUserPage} of ${totalPages}`;
    
    prevUsersBtn.disabled = currentUserPage === 1;
    nextUsersBtn.disabled = currentUserPage === totalPages;

    // Attach event listeners to new quick login buttons
    quickLoginUsersContainer.querySelectorAll('.quick-login-user').forEach(btn => {
      btn.addEventListener('click', () => {
        const username = btn.dataset.username;
        loginUser(username);
      });
    });
  }

  // Pagination button event listeners
  prevUsersBtn.addEventListener('click', () => {
    if (currentUserPage > 1) {
      currentUserPage--;
      populateQuickLoginUsers();
    }
  });

  nextUsersBtn.addEventListener('click', () => {
    const totalPages = Math.ceil(quickLoginUsers.length / USERS_PER_PAGE);
    if (currentUserPage < totalPages) {
      currentUserPage++;
      populateQuickLoginUsers();
    }
  });

  // Initial population of quick login users
  populateQuickLoginUsers();

  shutdownBtn.addEventListener('click', () => {
    performShutdown();
  });

  // Modify the _shutdown button on login screen
  document.querySelector('.login-window ._shutdown').addEventListener('click', () => {
    performShutdown();
  });

  // Modify logout modal shutdown
  document.getElementById('confirm-logout').addEventListener('click', () => {
    performShutdown();
  });

  // Modified login logic to support quick login
  function loginUser(username) {
    // Play startup sound
    startupSound.play().catch(e => {
      console.warn('Startup sound could not be played', e);
    });

    // Hide login screen and show desktop
    loginScreen.style.display = 'none';
    desktop.style.display = 'block';
  }

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const usernameInput = document.getElementById('username-input');
    const username = usernameInput.value.trim();

    // Modified validation to check against quickLoginUsers
    if (quickLoginUsers.includes(username)) {
      loginUser(username);
    } else {
      alert('Username not found. Try one of the quick login options.');
    }
  });

  // Hashtag filtering functionality
  function openHashtagFilterModal(clickedHashtag) {
    const hashtagFilterModal = document.getElementById('hashtag-filter-modal');
    const hashtagFilterContent = document.getElementById('hashtag-filter-content');
    
    // Filter videos by the clicked hashtag
    const filteredVideos = videoLibrary.filter(video => 
      video.hashtags.includes(clickedHashtag)
    );

    // Populate the modal with filtered videos
    hashtagFilterContent.innerHTML = filteredVideos.map(video => `
      <div class="video-item" data-video-id="${video.id}" style="border: 1px solid #808080; margin: 5px; padding: 5px;">
        <strong>${video.title}</strong>
        <p>By: <span class="profile-link" data-username="${video.user}">${video.user}</span> | ${video.views} views</p>
        <div class="video-hashtags">
          ${video.hashtags.map(tag => `<span class="hashtag">${tag}</span>`).join(' ')}
        </div>
      </div>
    `).join('');

    // Add click events to filtered videos
    hashtagFilterContent.querySelectorAll('.video-item').forEach(item => {
      item.addEventListener('click', () => openVideoPlayer(item.dataset.videoId));
    });

    // Show the modal
    hashtagFilterModal.style.display = 'flex';
    
    // Set modal title
    document.getElementById('hashtag-filter-title').textContent = `Videos tagged with ${clickedHashtag}`;
  }

  // Close hashtag filter modal
  function closeHashtagFilterModal() {
    const hashtagFilterModal = document.getElementById('hashtag-filter-modal');
    hashtagFilterModal.style.display = 'none';
  }

  // Modify existing code to attach hashtag click event
  function attachHashtagEvents() {
    document.querySelectorAll('.hashtag').forEach(hashtagEl => {
      hashtagEl.addEventListener('click', (e) => {
        const hashtag = e.target.textContent;
        openHashtagFilterModal(hashtag);
      });
    });
  }

  // Add close button event for hashtag filter modal
  document.querySelector('._close-hashtag-filter').addEventListener('click', closeHashtagFilterModal);

  // Video Upload Functionality
  const videoUploadModal = document.getElementById('video-upload-modal');
  const startWebcamBtn = document.getElementById('start-webcam');
  const recordWebcamBtn = document.getElementById('record-webcam');
  const stopWebcamRecordingBtn = document.getElementById('stop-webcam-recording');
  const videoFileInput = document.getElementById('video-file-input');
  const filePreview = document.getElementById('file-preview');
  const submitUploadBtn = document.getElementById('submit-upload');
  const webcamPreview = document.getElementById('webcam-preview');

  let mediaRecorder;
  let recordedChunks = [];
  let webcamStream;

  // Open video upload modal
  function openVideoUploadModal() {
    videoUploadModal.style.display = 'flex';
  }

  // Close video upload modal
  function closeVideoUploadModal() {
    videoUploadModal.style.display = 'none';
    // Reset all upload states
    stopWebcamStream();
    resetUploadForm();
  }

  // Start webcam
  function startWebcam() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        webcamStream = stream;
        webcamPreview.srcObject = stream;
        webcamPreview.style.display = 'block';
        startWebcamBtn.disabled = true;
        recordWebcamBtn.disabled = false;
      })
      .catch(err => {
        console.error("Error accessing webcam:", err);
        alert("Could not access webcam. Please check permissions.");
      });
  }

  // Start recording from webcam
  function startWebcamRecording() {
    if (!webcamStream) return;

    recordedChunks = [];
    mediaRecorder = new MediaRecorder(webcamStream);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const recordedBlob = new Blob(recordedChunks, { type: 'video/webm' });
      const videoURL = URL.createObjectURL(recordedBlob);
      
      // Update file preview
      filePreview.innerHTML = `
        <video src="${videoURL}" controls style="max-width: 100%;"></video>
      `;
      
      // Enable upload button
      submitUploadBtn.disabled = false;
    };

    mediaRecorder.start();
    recordWebcamBtn.disabled = true;
    stopWebcamRecordingBtn.disabled = false;
  }

  // Stop webcam recording
  function stopWebcamRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      stopWebcamRecordingBtn.disabled = true;
      recordWebcamBtn.disabled = false;
    }
  }

  // Stop webcam stream
  function stopWebcamStream() {
    if (webcamStream) {
      webcamStream.getTracks().forEach(track => track.stop());
      webcamPreview.srcObject = null;
      webcamPreview.style.display = 'none';
      webcamStream = null;
    }
  }

  // File input preview
  function handleFilePreview(event) {
    const file = event.target.files[0];
    if (file) {
      // Stop any active webcam stream
      stopWebcamStream();

      // Check if it's a video file
      if (file.type.startsWith('video/')) {
        const videoURL = URL.createObjectURL(file);
        filePreview.innerHTML = `
          <video src="${videoURL}" controls style="max-width: 100%;"></video>
        `;
      } else {
        filePreview.innerHTML = '<p>Please select a valid video file</p>';
      }
    }
  }

  // Reset upload form
  function resetUploadForm() {
    document.getElementById('video-title').value = '';
    document.getElementById('video-description').value = '';
    document.getElementById('video-hashtags').value = '';
    filePreview.innerHTML = '<p>No file selected</p>';
    videoFileInput.value = '';
    submitUploadBtn.disabled = true;
  }

  // Submit video upload
  function submitVideoUpload() {
    const title = document.getElementById('video-title').value.trim();
    const description = document.getElementById('video-description').value.trim();
    const hashtags = document.getElementById('video-hashtags').value.trim().split(/\s+/).filter(tag => tag.startsWith('#'));

    if (!title) {
      alert('Please enter a video title');
      return;
    }

    // Create a new video object
    const newVideo = {
      id: videoLibrary.length + 1,
      title: title,
      user: 'CurrentUser', // Replace with actual logged-in username
      views: 0,
      description: description,
      hashtags: hashtags.length ? hashtags : ['#98Tok'],
      comments: [],
      favorites: 0
    };

    // Add to video library
    videoLibrary.push(newVideo);

    // Refresh videos and close modal
    currentVideos = [...videoLibrary];
    generateRetroVideos();
    closeVideoUploadModal();

    // Optional: Show upload success message
    alert('Video uploaded successfully!');
  }

  // Event Listeners
  createVideoBtn.addEventListener('click', openVideoUploadModal);
  document.querySelector('._close-upload').addEventListener('click', closeVideoUploadModal);
  
  startWebcamBtn.addEventListener('click', startWebcam);
  recordWebcamBtn.addEventListener('click', startWebcamRecording);
  stopWebcamRecordingBtn.addEventListener('click', stopWebcamRecording);
  
  videoFileInput.addEventListener('change', handleFilePreview);
  submitUploadBtn.addEventListener('click', submitVideoUpload);

  // Disable submit button initially
  submitUploadBtn.disabled = true;

  // Pagination configuration
  const PAGINATION_OPTIONS = [10, 25, 30, 40, 50, 100];
  let currentPageSize = 10; // Default page size
  let currentPage = 1;

  // Function to simulate viral growth and organic engagement
  function simulateViralGrowth() {
    videoLibrary.forEach(video => {
      // Simulate viral growth with exponential potential
      if (Math.random() < 0.05) {
        // Chance of going viral
        video.views += Math.floor(Math.random() * 10000) + 1000;
        video.favorites += Math.floor(Math.random() * 500) + 50;
        
        // Add some random comments when going viral
        const viralComments = [
          'Going viral!', 
          'This is EPIC!', 
          'Absolutely amazing!', 
          'Wow, this blew up!', 
          'Can\'t believe how cool this is!',
          '90s content FTW!',
          'Totally radical!',
          'This should be trending!'
        ];
        
        for (let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
          video.comments.push({
            user: `User${Math.floor(Math.random() * 10000)}`,
            text: viralComments[Math.floor(Math.random() * viralComments.length)]
          });
        }
      } else {
        // Normal organic growth
        video.views += Math.floor(Math.random() * 10) + 1;
        video.favorites += Math.floor(Math.random() * 2) + 1;
        
        // Occasional new comment
        if (Math.random() < 0.02) {
          video.comments.push({
            user: `User${Math.floor(Math.random() * 10000)}`,
            text: [
              'Nice video!', 
              'Cool content!', 
              'Loving the 90s vibes!', 
              'Awesome!',
              'This is great!'
            ][Math.floor(Math.random() * 5)]
          });
        }
      }
    });
  }

  // Function to create pagination controls
  function createPaginationControls() {
    const paginationContainer = document.createElement('div');
    paginationContainer.classList.add('pagination-container');

    // Page navigation
    const pageNavigation = document.createElement('div');
    pageNavigation.classList.add('page-navigation');

    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.disabled = true;
    prevButton.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        generateRetroVideos();
      }
    });

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.disabled = true;
    nextButton.addEventListener('click', () => {
      if ((currentPage * currentPageSize) < currentVideos.length) {
        currentPage++;
        generateRetroVideos();
      }
    });

    const pageInfo = document.createElement('span');
    pageInfo.classList.add('page-info');

    // Define generateRetroVideos function
    generateRetroVideos = () => {
      // Simulate viral growth before generating videos
      simulateViralGrowth();

      // Calculate pagination
      const startIndex = (currentPage - 1) * currentPageSize;
      const endIndex = startIndex + currentPageSize;
      const paginatedVideos = currentVideos.slice(startIndex, endIndex);

      // Original video generation logic
      videoFeed.innerHTML = paginatedVideos.map(video => `
        <div class="video-item" data-video-id="${video.id}" style="border: 1px solid #808080; margin: 5px; padding: 5px;">
          <strong>${video.title}</strong>
          <span class="favorite-indicator">${favoriteVideos.has(video.id) ? '❤️' : ''}</span>
          <p>By: <span class="profile-link" data-username="${video.user}">${video.user}</span> | ${video.views} views</p>
          <p>Favorites: ${video.favorites || 0}</p>
          <div class="video-hashtags">
            ${video.hashtags.map(tag => `<span class="hashtag">${tag}</span>`).join(' ')}
          </div>
          <button class="favorite-btn ${favoriteVideos.has(video.id) ? 'favorited' : ''}">
            ${favoriteVideos.has(video.id) ? 'Unfavorite' : 'Favorite'}
          </button>
          <div class="video-comments-preview">
            ${video.comments.slice(0, 1).map(comment => `
              <div class="comment-preview">
                <strong>${comment.user}</strong>: ${comment.text}
              </div>
            `).join('')}
          </div>
        </div>
      `).join('');

      // Update page navigation
      pageInfo.textContent = `Page ${currentPage} of ${Math.ceil(currentVideos.length / currentPageSize)}`;
      prevButton.disabled = currentPage === 1;
      nextButton.disabled = (currentPage * currentPageSize) >= currentVideos.length;

      // Re-attach event listeners
      document.querySelectorAll('.video-item').forEach(item => {
        const videoId = item.dataset.videoId;
        item.addEventListener('click', () => openVideoPlayer(videoId));
        
        const favoriteBtn = item.querySelector('.favorite-btn');
        if (favoriteBtn) {
          favoriteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorite(videoId);
          });
        }
      });

      document.querySelectorAll('.profile-link').forEach(link => {
        link.addEventListener('click', () => openUserProfile(link.dataset.username));
      });

      attachHashtagEvents();
    };

    // Append elements
    pageNavigation.appendChild(prevButton);
    pageNavigation.appendChild(pageInfo);
    pageNavigation.appendChild(nextButton);
    paginationContainer.appendChild(pageNavigation);

    // Insert pagination controls after video feed
    const videoControlsContainer = document.querySelector('#video-controls');
    videoControlsContainer.parentNode.insertBefore(paginationContainer, videoControlsContainer.nextSibling);

    // Initial generation
    generateRetroVideos();
  }

  // Add periodic viral growth simulation
  setInterval(simulateViralGrowth, 10000);

  // Page Size Window Functionality
  const pageSelectWindow = document.getElementById('page-size-window');
  const pageOptionsContainer = document.getElementById('page-size-options');
  const pageSizeSelector = document.getElementById('page-size-selector');
  const openPageSizeWindowBtn = document.createElement('button');

  // Function to open page size selection window
  function openPageSizeWindow() {
    // Populate page size options
    pageOptionsContainer.innerHTML = PAGINATION_OPTIONS.map(size => `
      <div class="page-size-option" data-size="${size}">
        ${size} videos per page
      </div>
    `).join('');

    // Add click event to options
    pageOptionsContainer.querySelectorAll('.page-size-option').forEach(option => {
      option.classList.toggle('active', parseInt(option.dataset.size) === currentPageSize);
      option.addEventListener('click', () => {
        const newPageSize = parseInt(option.dataset.size);
        
        // Update page size
        currentPageSize = newPageSize;
        currentPage = 1; // Reset to first page
        
        // Update pagination selector
        pageSizeSelector.value = newPageSize;
        
        // Regenerate videos
        generateRetroVideos();
        
        // Close window
        closePageSizeWindow();
      });
    });

    // Position and display window
    pageSelectWindow.style.display = 'block';
  }

  // Function to close page size window
  function closePageSizeWindow() {
    pageSelectWindow.style.display = 'none';
  }

  // Create button to open page size window
  openPageSizeWindowBtn.textContent = 'Page Size';
  openPageSizeWindowBtn.addEventListener('click', openPageSizeWindow);
  document.querySelector('.system-tray').appendChild(openPageSizeWindowBtn);

  // Add close button event
  document.querySelector('._close-page-size').addEventListener('click', closePageSizeWindow);

  // Call pagination controls setup
  createPaginationControls();

  // Initially show login screen
  desktop.style.display = 'none';
  loginScreen.style.display = 'flex';

  // Expanded following functionality
  const followedUsers = new Set();
  const currentUser = 'CurrentUser'; // Placeholder for logged-in user

  // Function to add a user to followed list
  function followUser(username) {
    if (username !== currentUser && !followedUsers.has(username)) {
      followedUsers.add(username);
      updateFollowButton(username);
      generateFollowedUserVideos();
      addNotification(`You are now following ${username}`);
    }
  }

  // Function to unfollow a user
  function unfollowUser(username) {
    followedUsers.delete(username);
    updateFollowButton(username);
    generateFollowedUserVideos();
    addNotification(`You have unfollowed ${username}`);
  }

  // Update follow button state
  function updateFollowButton(username) {
    const followButtons = document.querySelectorAll(`.follow-btn[data-username="${username}"]`);
    followButtons.forEach(btn => {
      btn.textContent = followedUsers.has(username) ? 'Unfollow' : 'Follow';
    });
  }

  // Generate videos from followed users
  function generateFollowedUserVideos() {
    if (followedUsers.size === 0) {
      videoFeed.innerHTML = '<p>Follow some users to see their content!</p>';
      return;
    }

    const followedUserVideos = videoLibrary.filter(video => 
      followedUsers.has(video.user)
    );

    currentVideos = followedUserVideos;
    generateRetroVideos();
  }

  // Notification system
  const notifications = [];
  const notificationsModal = document.getElementById('notifications-modal');
  const notificationsList = document.getElementById('notifications-list');
  const notificationsBtn = document.createElement('button');
  notificationsBtn.classList.add('notifications-btn');
  notificationsBtn.innerHTML = 'Notifications <span class="notification-count">0</span>';

  function addNotification(message) {
    const notification = {
      id: Date.now(),
      message: message,
      timestamp: new Date(),
      read: false
    };
    notifications.unshift(notification);
    updateNotificationsUI();
  }

  function updateNotificationsUI() {
    const unreadCount = notifications.filter(n => !n.read).length;
    const notificationCountEl = notificationsBtn.querySelector('.notification-count');
    notificationCountEl.textContent = unreadCount;
    notificationCountEl.style.display = unreadCount > 0 ? 'block' : 'none';

    notificationsList.innerHTML = notifications.map(notification => `
      <div class="notifications-list-item ${notification.read ? 'read' : 'unread'}">
        ${notification.message} 
        <small>${new Date(notification.timestamp).toLocaleTimeString()}</small>
      </div>
    `).join('');
  }

  function openNotificationsModal() {
    notifications.forEach(n => n.read = true);
    updateNotificationsUI();
    notificationsModal.style.display = 'flex';
  }

  function closeNotificationsModal() {
    notificationsModal.style.display = 'none';
  }

  // Profile Modal Enhancement
  function openCurrentUserProfile() {
    const userProfile = userProfiles[currentUser] || {
      displayName: currentUser,
      bio: 'New User',
      videos: videoLibrary.filter(v => v.user === currentUser).length,
      followers: followedUsers.size,
      following: 0,
      userVideos: videoLibrary.filter(v => v.user === currentUser)
    };

    document.getElementById('profile-username').textContent = currentUser;
    document.getElementById('profile-display-name').textContent = userProfile.displayName;
    document.getElementById('profile-bio').textContent = userProfile.bio;
    
    document.getElementById('profile-videos-count').textContent = userProfile.videos;
    document.getElementById('profile-followers-count').textContent = userProfile.followers;
    document.getElementById('profile-following-count').textContent = userProfile.following;

    // Liked videos remain private, show placeholder
    const privateVideosNote = document.createElement('p');
    privateVideosNote.textContent = 'Liked videos are private';
    privateVideosNote.style.fontSize = '0.8em';
    privateVideosNote.style.color = '#666';

    const profileStatsContainer = document.querySelector('.profile-stats');
    profileStatsContainer.appendChild(privateVideosNote);

    // Populate user's uploaded videos
    const profileVideosContainer = document.getElementById('profile-videos-container');
    profileVideosContainer.innerHTML = userProfile.userVideos.map(video => `
      <div class="profile-video-item" data-video-id="${video.id}">
        <div>${video.title}</div>
        <div>Views: ${video.views}</div>
      </div>
    `).join('');

    userProfileModal.style.display = 'flex';
  }

  // Add profile button to system tray
  const profileBtn = document.createElement('button');
  profileBtn.textContent = 'Profile';
  profileBtn.addEventListener('click', openCurrentUserProfile);
  document.querySelector('.system-tray').appendChild(profileBtn);

  // Add notifications button to system tray
  notificationsBtn.addEventListener('click', openNotificationsModal);
  document.querySelector('.system-tray').appendChild(notificationsBtn);
  
  // Add close button event for notifications modal
  document.querySelector('._close-notifications').addEventListener('click', closeNotificationsModal);

  // Simulate some initial notifications
  addNotification('Welcome to 98Tok!');
  addNotification('Check out the latest radical videos!');

  // Recovery Functionality
  const recoveryModal = document.getElementById('recovery-modal');
  const recoveryLog = document.getElementById('recovery-log');
  const resetAppBtn = document.getElementById('reset-app');
  const clearCacheBtn = document.getElementById('clear-cache');
  const reloadPageBtn = document.getElementById('reload-page');

  // Create recovery button in system tray
  const recoveryBtn = document.createElement('button');
  recoveryBtn.textContent = 'Recovery';
  recoveryBtn.classList.add('recovery-btn');
  document.querySelector('.system-tray').appendChild(recoveryBtn);

  // Open recovery modal
  function openRecoveryModal() {
    recoveryModal.style.display = 'flex';
  }

  // Close recovery modal
  function closeRecoveryModal() {
    recoveryModal.style.display = 'none';
  }

  // Log recovery actions
  function logRecoveryAction(message) {
    const logEntry = document.createElement('p');
    logEntry.textContent = `${new Date().toLocaleTimeString()}: ${message}`;
    recoveryLog.insertBefore(logEntry, recoveryLog.firstChild);
  }

  // Reset app functionality
  function resetApp() {
    try {
      // Clear video library and reset to initial state
      currentVideos = [...videoLibrary];
      favoriteVideos.clear();
      followedUsers.clear();
      notifications.length = 0;

      // Reset UI elements
      generateRetroVideos();
      updateFavoritesList();
      updateNotificationsUI();

      logRecoveryAction('App reset to initial state');
      addNotification('App has been reset');
    } catch (error) {
      logRecoveryAction(`Reset failed: ${error.message}`);
      alert('Failed to reset app. Please reload the page.');
    }
  }

  // Clear cache functionality
  function clearCache() {
    try {
      // Clear local storage
      localStorage.clear();
      
      // Clear session storage
      sessionStorage.clear();
      
      logRecoveryAction('Browser cache and storage cleared');
      addNotification('Cache has been cleared');
    } catch (error) {
      logRecoveryAction(`Cache clearing failed: ${error.message}`);
      alert('Failed to clear cache.');
    }
  }

  // Reload page functionality
  function reloadPage() {
    logRecoveryAction('Reloading page');
    window.location.reload();
  }

  // Event listeners for recovery actions
  recoveryBtn.addEventListener('click', openRecoveryModal);
  document.querySelector('._close-recovery').addEventListener('click', closeRecoveryModal);
  
  resetAppBtn.addEventListener('click', resetApp);
  clearCacheBtn.addEventListener('click', clearCache);
  reloadPageBtn.addEventListener('click', reloadPage);

  // Make windows draggable
  const draggableWindows = document.querySelectorAll('.window');
  draggableWindows.forEach(makeWindowDraggable);

  // Window Control Functionality for Desktop Window
  const desktopWindow = document.getElementById('app-window');
  const minimizeBtn = desktopWindow.querySelector('._minimize');
  const maximizeBtn = desktopWindow.querySelector('._maximize');
  const closeBtn = desktopWindow.querySelector('._close');

  let isMaximized = false;
  let originalPosition = { top: 0, left: 0, width: 0, height: 0 };

  // Create a taskbar button for the minimized 98Tok window
  const minimizedAppBtn = document.createElement('button');
  minimizedAppBtn.textContent = '98Tok';
  minimizedAppBtn.classList.add('minimized-app-btn');
  minimizedAppBtn.style.display = 'none';

  // Add the minimized app button to the system tray
  const systemTray = document.querySelector('.system-tray');
  systemTray.appendChild(minimizedAppBtn);

  minimizeBtn.addEventListener('click', () => {
    desktopWindow.style.display = 'none';
    minimizedAppBtn.style.display = 'block';
  });

  // Restore the window when minimized app button is clicked
  minimizedAppBtn.addEventListener('click', () => {
    desktopWindow.style.display = 'block';
    minimizedAppBtn.style.display = 'none';
  });

  maximizeBtn.addEventListener('click', () => {
    if (!isMaximized) {
      // Store original position and size
      originalPosition = {
        top: desktopWindow.style.top,
        left: desktopWindow.style.left,
        width: desktopWindow.style.width,
        height: desktopWindow.style.height
      };

      // Maximize
      desktopWindow.style.position = 'fixed';
      desktopWindow.style.top = '0';
      desktopWindow.style.left = '0';
      desktopWindow.style.width = '100%';
      desktopWindow.style.height = 'calc(100% - 28px)'; // Account for taskbar
      isMaximized = true;
      maximizeBtn.textContent = ''; // Change to restore down symbol
    } else {
      // Restore original size and position
      desktopWindow.style.position = 'absolute';
      desktopWindow.style.top = originalPosition.top || '50px';
      desktopWindow.style.left = originalPosition.left || '100px';
      desktopWindow.style.width = originalPosition.width || '500px';
      desktopWindow.style.height = originalPosition.height || 'auto';
      isMaximized = false;
      maximizeBtn.textContent = ''; // Change back to maximize symbol
    }
  });

  // Modify close button to minimize instead of shut down
  closeBtn.addEventListener('click', () => {
    desktopWindow.style.display = 'none';
    minimizedAppBtn.style.display = 'block';
  });

  // Search functionality
  function searchVideos() {
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput.value.trim().toLowerCase();

    if (!searchTerm) {
      // If search is empty, reset to original feed
      currentVideos = [...videoLibrary];
      generateRetroVideos();
      return;
    }

    // Filter videos based on search term
    currentVideos = videoLibrary.filter(video => 
      video.title.toLowerCase().includes(searchTerm) ||
      video.user.toLowerCase().includes(searchTerm) ||
      video.hashtags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
      video.description.toLowerCase().includes(searchTerm)
    );

    // Reset pagination
    currentPage = 1;
  
    // Regenerate videos with search results
    generateRetroVideos();
  }

  const searchButton = document.getElementById('search-btn');
  const searchInput = document.getElementById('search-input');

  // Search on button click
  searchButton.addEventListener('click', searchVideos);

  // Search on Enter key press
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      searchVideos();
    }
  });

  // Start Menu Functionality
  const startMenuBtn = document.getElementById('start-menu-btn');
  const startMenu = document.getElementById('start-menu');
  const startShutdownBtn = document.getElementById('start-shutdown');
  const startLogoutBtn = document.getElementById('start-logout');
  const startProfileBtn = document.getElementById('start-profile');
  const startRecoveryBtn = document.getElementById('start-recovery');

  // Toggle start menu
  startMenuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    startMenu.style.display = startMenu.style.display === 'block' ? 'none' : 'block';
  });

  // Close start menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!startMenu.contains(e.target) && e.target !== startMenuBtn) {
      startMenu.style.display = 'none';
    }
  });

  // Start menu actions
  startShutdownBtn.addEventListener('click', () => {
    performShutdown();
  });

  startLogoutBtn.addEventListener('click', () => {
    showLogoutModal();
  });

  startProfileBtn.addEventListener('click', () => {
    openCurrentUserProfile();
  });

  startRecoveryBtn.addEventListener('click', () => {
    openRecoveryModal();
  });

  // Control Panel/Settings Modal
  const controlPanelModal = document.createElement('div');
  controlPanelModal.id = 'control-panel-modal';
  controlPanelModal.classList.add('modal');
  controlPanelModal.style.display = 'none';
  controlPanelModal.innerHTML = `
    <div class="modal-content window">
      <div class="window-title-bar">
        <span>98Tok Control Panel</span>
        <div class="window-controls">
          <button class="_close-control-panel">×</button>
        </div>
      </div>
      <div class="modal-body">
        <div class="control-panel-content">
          <h3>System Settings</h3>
          <div class="settings-section">
            <h4>User Preferences</h4>
            <div class="setting">
              <label>
                <input type="checkbox" id="dark-mode-toggle"> Dark Mode
              </label>
            </div>
            <div class="setting">
              <label>Notifications: 
                <select id="notification-frequency">
                  <option value="all">All Notifications</option>
                  <option value="important">Important Only</option>
                  <option value="none">No Notifications</option>
                </select>
              </label>
            </div>
          </div>
          <div class="settings-section">
            <h4>Performance</h4>
            <div class="setting">
              <label>Video Feed Refresh Rate: 
                <select id="feed-refresh-rate">
                  <option value="5">Every 5 seconds</option>
                  <option value="10">Every 10 seconds</option>
                  <option value="30">Every 30 seconds</option>
                  <option value="60">Every minute</option>
                </select>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(controlPanelModal);

  // Open Control Panel
  function openControlPanel() {
    controlPanelModal.style.display = 'flex';
  }

  // Close Control Panel
  function closeControlPanel() {
    controlPanelModal.style.display = 'none';
  }

  // Add event listeners for Control Panel
  const startControlPanelBtn = document.getElementById('start-control-panel');
  if(startControlPanelBtn) {
    startControlPanelBtn.addEventListener('click', openControlPanel);
  }
  
  document.querySelector('._close-control-panel').addEventListener('click', closeControlPanel);
});