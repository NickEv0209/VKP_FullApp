const path = require("path");
const url = require("url");
const { app, BrowserWindow } = require("electron");
const { autoUpdater } = require("electron-updater");

let win;

function createWindows() {
  win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1400,
    minHeight: 850,
    icon: path.join(__dirname, "/img/VKP.ico"),
    webPreferences: {
      preload: path.join(__dirname, "Parser.js"),
      nodeIntegration: true,
    },
  });
  win.setMenuBarVisibility(false);
  win.setTitle("VKParser");

//   win.loadURL('http://localhost:5173')

//   win.loadURL(
//     url.format({
//       pathname: path.join(__dirname, "dist", "index.html"),
//       protocol: "file:",
//       slashes: true,
//     })
//   );

  win.loadFile(path.join(__dirname, 'dist', 'index.html'));

//   win.webContents.openDevTools();

  autoUpdater.checkForUpdatesAndNotify();

  autoUpdater.on("update-available", () => {
    mainWindow.webContents.send("update_available");
  });

  autoUpdater.on("update-downloaded", () => {
    mainWindow.webContents.send("update_downloaded");
  });

  win.on("close", () => {
    win = null;
  });
}

app.on("ready", createWindows);

autoUpdater.on("error", (error) => {
  console.error("Ошибка при обновлении:", error);
});

app.on("window-all-closed", () => {
  app.quit();
});
