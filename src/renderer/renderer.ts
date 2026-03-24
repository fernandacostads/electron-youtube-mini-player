const searchInput = document.getElementById("search-input") as HTMLInputElement;
const resultsDiv = document.getElementById("results") as HTMLDivElement;
const player = document.getElementById("player") as HTMLIFrameElement;
const closeButton = document.getElementById(
  "close-button",
) as HTMLButtonElement;
const searchButton = document.getElementById(
  "search-button",
) as HTMLButtonElement;
const topBar = document.getElementById("top-bar") as HTMLDivElement;
const topHoverArea = document.getElementById(
  "top-hover-area",
) as HTMLDivElement;

let isPlaying = false;
let hideTimeout: any = null;
let isInteracting = false;

window.currentVideoId = null;
const API_KEY = window.env.youtubeApiKey;

function showUI() {
  topBar.classList.remove("hidden");

  if (hideTimeout) clearTimeout(hideTimeout);

  if (isPlaying && !isInteracting) {
    hideTimeout = setTimeout(() => {
      hideUI();
    }, 1500);
  }
}

function hideUI() {
  if (!isPlaying || isInteracting) return;
  topBar.classList.add("hidden");
}

topHoverArea.addEventListener("mouseenter", () => {
  showUI();
});

topHoverArea.addEventListener("mouseleave", () => {
  if (hideTimeout) clearTimeout(hideTimeout);

  if (!isInteracting) {
    hideTimeout = setTimeout(() => {
      hideUI();
    }, 1200);
  }
});

searchInput.addEventListener("focus", () => {
  isInteracting = true;
  showUI();
});

searchInput.addEventListener("blur", () => {
  isInteracting = false;
  showUI();
});

searchInput.addEventListener("input", () => {
  showUI();
});

searchButton.addEventListener("click", searchMusic);

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchMusic();
});

closeButton.addEventListener("click", () => {
  window.electronAPI.closeApp();
});

function extractYouTubeId(input: string): string | null {
  const regex =
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)?([a-zA-Z0-9_-]{11})/;

  const match = input.match(regex);

  return match ? match[1] : null;
}

async function searchMusic() {
  const query = searchInput.value.trim();
  if (!query) return;

  const videoId = extractYouTubeId(query);

  if (videoId) {
    playMusic(videoId);
    return;
  }

  resultsDiv.style.display = "block";
  resultsDiv.innerHTML = "";

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&q=${encodeURIComponent(query)}&key=${API_KEY}`;

  const res = await fetch(url);
  const data = await res.json();

  data.items.forEach((item: any) => {
    const btn = document.createElement("button");
    btn.innerText = item.snippet.title;

    btn.onclick = () => {
      playMusic(item.id.videoId);
    };

    resultsDiv.appendChild(btn);
  });

  isPlaying = false;
  showUI();
}

function playMusic(videoId: string) {
  window.currentVideoId = videoId;

  resultsDiv.style.display = "none";

  player.src = `https://youtube-relay.fernandacostadev.workers.dev/?v=${videoId}&autoplay=1`;

  isPlaying = true;

  showUI();
}

showUI();
