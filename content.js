let videoElement = null;
let videoTitle = null;
let active = false;
videoElement = document.querySelector('#shorts-player > div.html5-video-container > video');

applyTimeEventListener()

function applyTimeEventListener() {
    const interval = setInterval(() => {
        if(videoElement !== null) {
            videoElement.addEventListener("timeupdate", () => {
                scrollPage()
            })
            clearInterval(interval)
            return;
        }
        videoElement = document.querySelector('#shorts-player > div.html5-video-container > video');
        videoTitle = document.querySelector("#overlay > ytd-reel-player-header-renderer > h2 > yt-formatted-string > span").innerText;
    }, 500)
    
}


function grabVideoData() {
  // Send the video data to the popup.js script

  if(videoElement === null) {
    chrome.runtime.sendMessage({ action: 'updatePopup', data: { videoElement, videoTitle } 
    });
    return;
  }
  chrome.runtime.sendMessage({ action: 'updatePopup', data: 
  { 
    videoElement: true,
    timeLeft : Math.abs(videoElement.currentTime - videoElement.duration), 
    currentTime : videoElement.currentTime, 
    duration : videoElement.duration,
    videoTitle } });
}




chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
  if (request.action === 'startExtension') {
    grabVideoData();
  }
  if (request.action === 'updateExtension') {
      active = request.data
      
  }
  if (request.action === 'activityQuery') {
    sendResponse({activity: active})
}
});

function scrollPage() {
    if(!active) return;
    if(Math.abs(videoElement.currentTime - videoElement.duration) < 0.25) {
        document.querySelector("#shorts-container").scrollBy(0, 150)
    }
}


