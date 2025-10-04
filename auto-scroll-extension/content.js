console.log("📦 YT Shorts Scroller Loaded");

let currentVideo = null;
let intervalId = null;

function scrollToNextShort() {
  const downArrowEvent = new KeyboardEvent("keydown", {
    key: "ArrowDown",
    keyCode: 40,
    code: "ArrowDown",
    which: 40,
    bubbles: true,
  });
  document.dispatchEvent(downArrowEvent);
  console.log("⏭️ Scrolled to next short");
}

function checkToggleAndRun() {
  chrome.storage.local.get("autoScrollEnabled", (data) => {
    const enabled = data.autoScrollEnabled ?? true;

    if (!enabled) {
      console.log("🛑 Auto-scroll disabled");
      if (intervalId) clearInterval(intervalId);
      currentVideo = null;
      intervalId = null;
      return;
    }

    watchShorts();
  });
}

function watchShorts() {
  const video = document.querySelector("video");

  if (!video || video === currentVideo) {
    setTimeout(checkToggleAndRun, 1000);
    return;
  }

  console.log("🎥 New video detected");
  currentVideo = video;

  if (intervalId) clearInterval(intervalId);

  intervalId = setInterval(() => {
    chrome.storage.local.get("autoScrollEnabled", (data) => {
      if (!data.autoScrollEnabled) {
        console.log("🛑 Auto-scroll disabled mid-play");
        clearInterval(intervalId);
        intervalId = null;
        currentVideo = null;
        return;
      }

      if (video.ended || video.currentTime >= video.duration - 0.5) {
        console.log("✅ Video ended — scrolling");

        clearInterval(intervalId);
        intervalId = null;
        currentVideo = null;

        setTimeout(() => {
          scrollToNextShort();
          setTimeout(checkToggleAndRun, 1500);
        }, 1000);
      }
    });
  }, 500);
}

// 🔁 Listen to popup toggle in real-time
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.autoScrollEnabled) {
    const newValue = changes.autoScrollEnabled.newValue;
    console.log(`🔄 Toggle switched: ${newValue ? "ON" : "OFF"}`);

    if (newValue) {
      checkToggleAndRun();
    } else {
      if (intervalId) clearInterval(intervalId);
      intervalId = null;
      currentVideo = null;
    }
  }
});

// ▶️ Initial start
checkToggleAndRun();
