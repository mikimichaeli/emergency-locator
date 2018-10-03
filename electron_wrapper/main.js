// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  ipcMain
} = require('electron')
const electron = require('electron')
const windowSizes = {
  closeMap: {
    width: 520,
    height: 120
  },
  openMap: {
    width: 520,
    height: 520
  }
}
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
  // Create the browser window.
  const {
    width,
    height
  } = windowSizes.closeMap;
  const {
    x,
    y
  } = calcNewWindowLocation(width, height);

  // Create the window at the bottom of the screen
  mainWindow = new BrowserWindow({
    width,
    height,
    resizable: false,
    maximizable: false,
    alwaysOnTop: true,
    title: 'Emergency Locator',
    x,
    y
  });

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  });
}

ipcMain.on('openMap', () => {
  console.log('Open Map');
  if (mainWindow) {
    const {
      width,
      height
    } = windowSizes.openMap;
    const {
      x,
      y
    } = calcNewWindowLocation(width, height);
    mainWindow.setSize(width, height, true);
    mainWindow.setPosition(x, y, true);
  }
});

ipcMain.on('closeMap', () => {
  console.log('Close Map');
  if (mainWindow) {
    const {
      width,
      height
    } = windowSizes.closeMap;
    const {
      x,
      y
    } = calcNewWindowLocation(width, height);
    mainWindow.setSize(width, height, true);
    mainWindow.setPosition(x, y, true);
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

function calcNewWindowLocation(windowWidth, windowHeight) {
  const {
    width,
    height
  } = electron.screen.getPrimaryDisplay().workAreaSize;

  return {
    x: width - windowWidth,
    y: height - windowHeight
  };
}