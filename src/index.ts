const { app, ipcMain, BrowserWindow, contextBridge } = require("electron");

function createWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 250,
    alwaysOnTop: true,
    frame: false,
    // transparent: true,
    webPreferences: { preload: __dirname + "/preload.js" },
  });

  win.loadFile("index.html");
}

ipcMain.on("close-app", () => {
  app.quit();
});

app.whenReady().then(createWindow);
