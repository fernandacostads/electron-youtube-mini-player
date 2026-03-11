import { contextBridge, ipcRenderer, shell } from "electron";

const apiKeyArg = process.argv.find((arg) =>
  arg.startsWith("--youtube-api-key="),
);

const youtubeApiKey = apiKeyArg?.split("=")[1] || "";

contextBridge.exposeInMainWorld("electronAPI", {
  closeApp: () => ipcRenderer.send("close-app"),
  openExternal: (url: string) => shell.openExternal(url),
});

contextBridge.exposeInMainWorld("env", {
  youtubeApiKey,
});
