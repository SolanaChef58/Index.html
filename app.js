// Initialize with a configurable API key
let API_KEY = ''; // We'll prompt for this if not set
let isCancelled = false;

// Function to get or set API key
async function getApiKey() {
  // Try to get from localStorage first
  let key = localStorage.getItem('youtube_api_key');
  
  if (!key) {
    // Prompt user for API key if not found
    key = prompt('Please enter your YouTube API Key. You can get one from https://console.cloud.google.com/apis/credentials');
    if (key) {
      localStorage.setItem('youtube_api_key', key);
    } else {
      throw new Error('YouTube API key is required to search comments');
    }
  }
  
  return key;
}

document.getElementById('searchBtn').addEventListener('click', searchComments);

function extractVideoId(url) {
  // Add support for YouTube Shorts URLs
  const patterns = [
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/,  // Regular YouTube
    /^.*youtube.com\/shorts\/([^#\&\?]*).*/  // YouTube Shorts
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && (match[2] || match[1]).length === 11) {
      return match[2] || match[1];
    }
  }
  
  // If no patterns match but the input is exactly 11 characters, assume it's a video ID
  if (url.length === 11) {
    return url;
  }
  
  return null;
}

async function fetchComments(videoId, pageToken = '') {
  if (!API_KEY) {
    API_KEY = await getApiKey();
  }

  const url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=100&pageToken=${pageToken}&key=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  
  if (!response.ok) {
    // Handle specific API errors
    if (data.error && data.error.errors && data.error.errors.length > 0) {
      const error = data.error.errors[0];
      if (error.reason === 'commentsDisabled') {
        throw new Error('Comments are disabled for this video.');
      } else if (error.reason === 'invalidVideoId') {
        throw new Error('Invalid video ID. Please check the URL.');
      } else if (error.reason === 'quotaExceeded') {
        // Clear the stored API key as it might have exceeded quota
        localStorage.removeItem('youtube_api_key');
        throw new Error('API quota exceeded. Please try again tomorrow or use a different API key.');
      } else if (error.reason === 'keyInvalid') {
        // Clear the invalid API key
        localStorage.removeItem('youtube_api_key');
        throw new Error('Invalid API key. Please enter a valid YouTube API key.');
      }
    }
    throw new Error(`API Error: ${data.error?.message || 'Failed to fetch comments'}`);
  }
  
  return data;
}

async function searchComments() {
  const videoUrl = document.getElementById('videoUrl').value;
  const searchQuery = document.getElementById('searchQuery').value.toLowerCase();
  const videoId = extractVideoId(videoUrl);
  
  if (!videoId) {
    alert('Please enter a valid YouTube URL (regular or Shorts) or video ID');
    return;
  }

  if (!searchQuery) {
    alert('Please enter a search term');
    return;
  }

  const loading = document.getElementById('loading');
  const stats = document.getElementById('stats');
  const commentsList = document.getElementById('commentsList');
  const matchCount = document.getElementById('matchCount');
  const totalCount = document.getElementById('totalCount');
  const loadingText = document.getElementById('loadingText');
  
  // Reset cancel flag
  isCancelled = false;
  
  // Show cancel button
  document.getElementById('cancelBtn').classList.remove('hidden');
  
  loading.classList.remove('hidden');
  stats.classList.add('hidden');
  commentsList.innerHTML = '';
  
  let matchingComments = [];
  let totalComments = 0;
  let nextPageToken = '';

  try {
    do {
      // Check if search was cancelled
      if (isCancelled) {
        throw new Error('Search cancelled by user');
      }

      const data = await fetchComments(videoId, nextPageToken);
      if (!data.items) {
        throw new Error('No comments found for this video.');
      }
      
      totalComments += data.items.length;
      
      const matching = data.items.filter(item => {
        const commentText = item.snippet.topLevelComment.snippet.textDisplay.toLowerCase();
        return commentText.includes(searchQuery);
      });
      
      matchingComments.push(...matching);
      nextPageToken = data.nextPageToken;
      
      // Update stats and loading text
      matchCount.textContent = matchingComments.length;
      totalCount.textContent = totalComments;
      loadingText.textContent = `Scanned ${totalComments} comments...`;
      stats.classList.remove('hidden');
      
      // Display comments in batches
      matching.forEach(comment => {
        const commentElement = createCommentElement(comment.snippet.topLevelComment.snippet);
        commentsList.appendChild(commentElement);
      });
      
      // Add a small delay to prevent hitting API rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } while (nextPageToken); // Remove the 500 comment limit
    
    loadingText.textContent = `Completed! Scanned ${totalComments} comments.`;
    
  } catch (error) {
    loading.classList.add('hidden');
    stats.classList.add('hidden');
    commentsList.innerHTML = `<p class="error">${error.message}</p>`;
    return;
  } finally {
    document.getElementById('cancelBtn').classList.add('hidden');
    loading.classList.add('hidden');
  }
  
  if (matchingComments.length === 0) {
    commentsList.innerHTML = '<p>No matching comments found.</p>';
  }
}

function createCommentElement(commentData) {
  const div = document.createElement('div');
  div.className = 'comment';
  
  const timestamp = new Date(commentData.publishedAt).toLocaleDateString();
  
  div.innerHTML = `
    <div class="comment-header">
      <img src="${commentData.authorProfileImageUrl}" alt="Profile" class="author-img">
      <span class="author-name">${commentData.authorDisplayName}</span>
      <span class="timestamp">${timestamp}</span>
    </div>
    <div class="comment-text">${commentData.textDisplay}</div>
  `;
  
  return div;
}

// Add cancel function
function cancelSearch() {
  isCancelled = true;
}

// Add a way to reset API key
document.addEventListener('DOMContentLoaded', () => {
  const resetLink = document.createElement('a');
  resetLink.href = 'javascript:void(0)';
  resetLink.textContent = 'Reset API Key';
  resetLink.className = 'reset-api';
  resetLink.onclick = () => {
    localStorage.removeItem('youtube_api_key');
    API_KEY = '';
    alert('API key has been reset. You will be prompted for a new one on the next search.');
  };
  document.querySelector('.supported-formats').appendChild(resetLink);
  
  // Add cancel button event listener
  document.getElementById('cancelBtn').addEventListener('click', cancelSearch);
});