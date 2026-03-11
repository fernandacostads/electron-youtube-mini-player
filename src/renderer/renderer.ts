const searchInput = document.getElementById("search-input") as HTMLInputElement;
const resultsDiv = document.getElementById("results") as HTMLDivElement;
const player = document.getElementById("player") as HTMLIFrameElement;
const closeButton = document.getElementById(
  "close-button",
) as HTMLButtonElement;
const searchButton = document.getElementById(
  "search-button",
) as HTMLButtonElement;
const titleBar = document.getElementById("title-bar") as HTMLDivElement;

let isPlaying = false;
let firstTime = true;
let playerInstance: any = null;

window.currentVideoId = null;
const API_KEY = window.env.youtubeApiKey;

document.addEventListener("mousemove", (event: MouseEvent) => {
  if (event.clientY < 60) {
    searchInput.style.display = "";
    searchButton.style.display = "";
    titleBar.style.display = "";
  } else {
    if (!firstTime) {
      searchInput.style.display = "none";
      searchButton.style.display = "none";
      titleBar.style.display = "none";
    }
  }
});

searchButton.addEventListener("click", () => {
  searchInput.style.display = "";
  searchButton.style.display = "";
  titleBar.style.display = "";
  searchMusic();
});

async function searchMusic(): Promise<void> {
  const query = searchInput.value.trim();

  if (!query) return;

  if (isPlaying) {
    player.style.display = "none";
  }

  resultsDiv.style.display = "";
  player.style.width = "";
  player.style.height = "";
  resultsDiv.innerHTML = "";

  try {
    const searchUrl =
      `https://www.googleapis.com/youtube/v3/search?` +
      `part=snippet&type=video&maxResults=10&q=${encodeURIComponent(query)}&key=${API_KEY}`;

    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    const videoIds: string[] = searchData.items
      .map((item: any) => item.id.videoId)
      .filter(Boolean);

    if (videoIds.length === 0) {
      resultsDiv.innerHTML = "<p>No videos found.</p>";
      return;
    }

    const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,status,contentDetails&id=${videoIds.join(
      ",",
    )}&key=${API_KEY}`;

    const detailsResponse = await fetch(detailsUrl);
    const detailsData = await detailsResponse.json();

    const userCountry = "BR";

    detailsData.items.forEach((video: any) => {
      const videoId = video.id;
      const title = video.snippet?.title;
      const isEmbeddable = video.status?.embeddable;
      const regionBlocked =
        video.contentDetails?.regionRestriction?.blocked || [];

      console.log(
        `🎵 ${title} | Embeddable: ${isEmbeddable} | Blocked: ${
          regionBlocked.join(", ") || "None"
        }`,
      );

      if (/official|mv|performance/i.test(title)) {
        console.warn(`🚫 Skipping "${title}" due to likely restrictions`);
        return;
      }

      if (isEmbeddable && !regionBlocked.includes(userCountry)) {
        const button = document.createElement("button");
        button.innerText = title;

        button.onclick = () => {
          player.style.display = "block";
          playMusic(videoId);
        };

        resultsDiv.appendChild(button);
      } else {
        console.warn(
          `⛔ Skipped: "${title}" — Region blocked or not embeddable`,
        );

        const fallback = document.createElement("div");
        fallback.className = "skipped-item";

        const label = document.createElement("span");
        label.innerText = `${title} — not embeddable`;

        const openBtn = document.createElement("button");
        openBtn.innerText = "Open on YouTube";
        openBtn.onclick = () => {
          window.electronAPI.openExternal(`https://youtu.be/${videoId}`);
        };

        fallback.appendChild(label);
        fallback.appendChild(openBtn);
        resultsDiv.appendChild(fallback);
      }
    });

    if (detailsData.items.length > 0) {
      isPlaying = false;
      pause();
    }
  } catch (error) {
    console.error("Search error:", error);
    resultsDiv.innerHTML = "<p>Error fetching results</p>";
  }
}

function pause(): void {
  if (playerInstance && typeof playerInstance.pauseVideo === "function") {
    try {
      playerInstance.pauseVideo();
    } catch (e) {
      console.warn("pauseVideo error", e);
    }
  } else {
    player.src = "";
  }
}

function playMusic(videoId: string): void {
  window.currentVideoId = videoId;

  resultsDiv.style.display = "none";
  searchInput.style.display = "none";
  searchButton.style.display = "none";
  titleBar.style.display = "none";

  player.style.width = "100%";
  player.style.height = "100vh";

  if (playerInstance && typeof playerInstance.loadVideoById === "function") {
    try {
      playerInstance.loadVideoById(videoId);
      playerInstance.playVideo();
    } catch (e) {
      console.warn("YT player load error", e);
      window.electronAPI.openExternal(`https://youtu.be/${videoId}`);
    }
  } else {
    player.src = `https://youtube-relay.fernandacostadev.workers.dev/?v=${videoId}&autoplay=1`;
  }

  isPlaying = true;
  firstTime = false;
}

window.onYouTubeIframeAPIReady = () => {
  try {
    playerInstance = new window.YT.Player("player", {
      events: {
        onError: (e: any) => {
          const code = e.data;

          console.warn("YouTube player error code:", code);

          if ([100, 101, 150].includes(code)) {
            const currentVideo = window.currentVideoId;

            if (currentVideo) {
              window.electronAPI.openExternal(
                `https://youtu.be/${currentVideo}`,
              );
            }
          }
        },
      },
    });
  } catch (err) {
    console.warn("Failed to create YT.Player", err);
  }
};

closeButton.addEventListener("click", () => {
  window.electronAPI.closeApp();
});

searchInput.addEventListener("keydown", (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    searchMusic();
  }
});
