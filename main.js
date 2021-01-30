const electron = require("electron");
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');
const { app, BrowserWindow, ipcMain } = electron;
let mainWindow;
let updateWindow;

const gotTheLock = app.requestSingleInstanceLock()

function sendStatusToWindow(text) {
    log.info(text);
    mainWindow.webContents.send('message', text);
}




if (!gotTheLock) {
    app.quit()
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        // Someone tried to run a second instance, we should focus our window.
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore()
            mainWindow.focus()
        }
    });


    // configure logging
    autoUpdater.logger = log;
    autoUpdater.logger.transports.file.level = 'info';
    log.info('App starting...');


    //development only 
    // try {
    //     require('electron-reloader')(module);
    // } catch { }


    //listen to app to be ready
    //createWindow
    app.whenReady().then(createWindow)



}



function createWindow() {
    //check if new updates are available
    autoUpdater.checkForUpdatesAndNotify();


    //create neww window
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        'min-height': 1170,
        'min-width': 604,
        resizable: false,
        frame: false,
        show: false,
        webPreferences: {
            nodeIntegration: true
        },
        enableRemoteModule: true

    });
    //load html into window
    mainWindow.loadFile('index.html');
    //mainWindow.removeMenu(); // remove devTools

    mainWindow.webContents.on('new-window', function (e, url) {
        e.preventDefault();
        electron.shell.openExternal(url);
    });


    app.on('will-quit', () => {

        app.quit()
    })

    app.on('window-all-closed', () => {


        app.quit()
    })



    autoUpdater.on('update-available', (info) => {
        updateBrowserwindow();
    })
    autoUpdater.on('update-not-available', (info) => {
        mainWindow.show();
    })
    autoUpdater.on('update-downloaded', (info) => {
        sendStatusToWindow('Download Complete!');
        autoUpdater.quitAndInstall();
    });
}


function updateBrowserwindow() {
    updateWindow = new BrowserWindow({
        width: 200,
        height: 300,
        resizable: false,
        frame: false,
        parent: mainWindow,
        webPreferences: {
            nodeIntegration: true
        },
        enableRemoteModule: true

    });
    //updateWindow.removeMenu(); // remove devTools

    updateWindow.loadFile('updateWindow.html');
    updateWindow.focus();
}