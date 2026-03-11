export {};

declare global {
  interface Window {
    env: {
      youtubeApiKey: string;
    };
    electronAPI: {
      closeApp: () => void;
      openExternal: (url: string) => void;
    };

    YT: any;
    playerInstance: any;
    currentVideoId: string | null;
    onYouTubeIframeAPIReady: () => void;
  }
}
