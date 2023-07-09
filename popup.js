let checkBox= null


function videoQuery() {
  chrome.tabs.query({ url: 'https://www.youtube.com/shorts/*' }, function(tabs) {
    if (tabs.length > 0) {
      // Send a message to the content script in the targeted tab
      chrome.tabs.sendMessage(tabs[0].id, { action: 'startExtension' });
    }
  });
}
function updateExtension() {
  chrome.tabs.query({ url: 'https://www.youtube.com/shorts/*' }, function(tabs) {
    if (tabs.length > 0) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'updateExtension', data: checkBox.checked});
    }
  });
}


function activityQuery() {
  chrome.tabs.query({ url: 'https://www.youtube.com/shorts/*' }, function(tabs) {
    if (tabs.length > 0) {
      // Send a message to the content script in the targeted tab
      chrome.tabs.sendMessage(tabs[0].id, { action: 'activityQuery' }).then(res=> checkBox.checked= res.activity)
    }
  });
}

setInterval(videoQuery, 250)

function updatePopup(videoElement) {
  const timeLeft = document.querySelector("#TimeLeft");
  const totalLength = document.querySelector("#TotalLength");
  const currentTime = document.querySelector("#CurrentTime");
  const videoInFocus = document.querySelector("#videoInFocus")

  if (videoElement.videoElement === null) {
    timeLeft.textContent = "Time Left: Nothing selected yet!";
    totalLength.textContent = "Total Length: Nothing selected yet!";
    currentTime.textContent = "Current Time: Nothing selected yet!";
    return;
  }
  videoInFocus.textContent = "Currently playing: " + videoElement.videoTitle
  timeLeft.textContent = "Time Left: " + Math.abs(videoElement.currentTime - videoElement.duration).toFixed(3);
  totalLength.textContent = "Total Length: " + videoElement.duration.toFixed(3);
  currentTime.textContent = "Current Time: " + videoElement.currentTime.toFixed(3);
}

document.addEventListener('DOMContentLoaded', async function() {
  const startButton = document.querySelector("#startButton");
  checkBox = document.querySelector("#onoffSwitch")
  activityQuery()
  checkBox.addEventListener("change", updateExtension)
  startButton.addEventListener("click", videoQuery);
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'updatePopup') {
    updatePopup(request.data);
  }
});

//https://www.youtube.com/shorts/QyQ8W1nphXE