console.log("📦 YouTube Shorts Auto-Scroller loaded");

function scrollToNextShort() {
  const downArrowEvent = new KeyboardEvent("keydown", {
    key: "ArrowDown",
    keyCode: 40,
    code: "ArrowDown",
    which: 40,
    bubbles: true,
  });
  document.dispatchEvent(downArrowEvent);
  console.log("⬇️ Scrolled to next short");
}

let currentVideo = null;
let videoObserver = null;

function observeNewVideos() {
  const video = document.querySelector("video");

  // If a new video is loaded (not the one we’ve been tracking)
  if (video && video !== currentVideo) {
    console.log("🎥 New video detected");
    currentVideo = video;

    if (videoObserver) {
      clearInterval(videoObserver); // stop previous watcher
    }

    // Start watching current video
    videoObserver = setInterval(() => {
      if (video.ended || video.currentTime >= video.duration - 0.5) {
        console.log("✅ Video finished");
        scrollToNextShort();
        clearInterval(videoObserver); // stop current watch
        videoObserver = null;
        currentVideo = null;

        // Give some time for next video to load
        setTimeout(observeNewVideos, 1500);
      }
    }, 500);
  } else {
    // Keep checking for new video
    setTimeout(observeNewVideos, 1000);
  }
}

// Start the loop
observeNewVideos();
