const electron = require("electron");
const url = require("url");
const path = require("path");
const { autoUpdater } = require("electron-updater");
const isDev = require('electron-is-dev');

const { app, BrowserWindow } = electron;
let mainWindow;


const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
    app.quit()
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        // Someone tried to run a second instance, we should focus our window.
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore()
            mainWindow.focus()
        }
    })




    //listen to app to be ready
    app.on("ready", function() {

        //Trigger update check
        if (!isDev) {
            autoUpdater.checkForUpdates();
        } else {
            console.log('dev mode')
        }
        //create neww window
        mainWindow = new BrowserWindow({
            width: 1170,
            height: 604,
            'min-height': 1170,
            'min-width': 604,
            resizable: false,
            frame: false,
            webPreferences: {
                nodeIntegration: true
            }

        });
        //load html into window
        mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, 'main.html'),
            protocol: 'file',
            slashes: true
        }));
        mainWindow.removeMenu(); // remove devTools

        mainWindow.webContents.on('new-window', function(e, url) {
            e.preventDefault();
            electron.shell.openExternal(url);
        });


    });

}

app.on('will-quit', () => {

    app.quit()
})




//-------------------------------------------------------------------
// Auto updates
//-------------------------------------------------------------------

//logs update 
autoUpdater.logger = require("electron-log")
autoUpdater.logger.transports.file.level = "info"


autoUpdater.on('checking-for--update', () => {
    console.log('checking for updates')
});
autoUpdater.on('update-available', info => {
    let timerInterval
    Swal.fire({
        title: 'New update avaliable',
        html: 'Preparing installation.',
        timer: 2000,
        timerProgressBar: true,
        onBeforeOpen: () => {
            Swal.showLoading()
            timerInterval = setInterval(() => {
                const content = Swal.getContent()
                if (content) {
                    const b = content.querySelector('b')
                    if (b) {
                        b.textContent = Swal.getTimerLeft()
                    }
                }
            }, 100)
        },
        onClose: () => {
            clearInterval(timerInterval)
        }
    }).then((result) => {
        /* Read more about handling dismissals below */
        if (result.dismiss === Swal.DismissReason.timer) {
            console.log('Correclty closed')
        }
    })
});
autoUpdater.on('update-not-available', info => {
    alert('checking')
});
autoUpdater.on('error', err => {

});
autoUpdater.on('download-progress', progressObj => {

    swal({
        title: 'Downloading',
        text: `Download speed: ${progressObj.bytesPerSecond} - Downloaded ${progressObj.percent}% (${progressObj.transferred} + '/' + ${progressObj.total} + )`,
        type: 'warning',
        showConfirmButton: false
    })

});
autoUpdater.on('update-downloaded', info => {
    autoUpdater.quitAndInstall();
});