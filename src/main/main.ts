import { app, BrowserWindow } from "electron";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const API_KEY = process.env.YOUTUBE_API_KEY;

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "../preload/preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      additionalArguments: [`--youtube-api-key=${API_KEY}`],
    },
  });

  const indexPath = path.join(__dirname, "../index.html");

  mainWindow.loadFile(indexPath);

  // User Agent para evitar bloqueios do YouTube
  mainWindow.webContents.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
  );

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
