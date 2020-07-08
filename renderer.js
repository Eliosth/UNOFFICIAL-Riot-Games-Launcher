// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const remote = require('electron').remote;
const win = remote.getCurrentWindow();
const Swal = require('sweetalert2');
const path = require('path');
const { Menu, Tray } = remote;
const fs = require('fs');
const { dialog } = remote;
var child = require('child_process').execFile;


let tray = null;
let tmpDir = null; //storage temporary folder path after selecting it from dialog
let dir; //write his current value into gamePath inside settings.json also stores  the value from gamePath
let audioOptions; // storage sound from settings.json
var audio = new Audio();
let IconPath = path.join(__dirname, 'assets/img/tray.ico'); //path to tray icon

// When document has loaded, initialise
document.onreadystatechange = (event) => {
    firstRun();


    if (document.readyState == "complete") {
        readSettingsJson();
        handleWindowControls();
        trayIconOption();
        if (audioOptions == true) {
            document.getElementById("muteCheck").checked = false;
        } else {
            document.getElementById("muteCheck").checked = true;
        }

        document.getElementById('displayPath').innerHTML = dir;
        document.getElementById('electron-ver').innerHTML = `${process.versions.electron}`

    }
};

window.onbeforeunload = (event) => {
    /* If window is reloaded, remove win event listeners
    (DOM element listeners get auto garbage collected but not
    Electron win listeners as the win is not dereferenced unless closed) */
    win.removeAllListeners();
}


//#region Title bar, select folder, audioOptions, games theme screen , games launcher 
function handleWindowControls() {




    //------------------------------------------------------------------------------------------------------
    // TITLE BAR BUTTONS - StART
    //------------------------------------------------------------------------------------------------------
    document.getElementById('min-button').addEventListener("click", event => {
        audio.pause();
        win.hide();
    });


    document.getElementById('close-button').addEventListener("click", event => {

        Swal.fire({
            title: 'Are you sure?',
            text: "",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Exit'
        }).then((result) => {
            if (result.value) {
                Swal.fire({
                        title: 'Closing',
                        showConfirmButton: false,
                    },
                    win.close()
                )


            }
        })




    });
    //------------------------------------------------------------------------------------------------------
    // TITLE BAR BUTTONS - END
    //------------------------------------------------------------------------------------------------------

    //------------------------------------------------------------------------------------------------------
    // SETS NEW myDir FOLDER PATH
    //------------------------------------------------------------------------------------------------------
    document.getElementById("selectFolder").addEventListener("click", event => {
        tmpDir = dialog.showOpenDialogSync(win, {
            properties: ['openFile', 'openDirectory']
        });
        //SaveSettings();

        if (tmpDir == null) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'You can not save without selecting a folder first!'
            })
        } else if (tmpDir != null) {
            dir = tmpDir;
            let config = {
                gamePath: dir.toString(),
                sound: audioOptions
            };
            document.getElementById('displayPath').innerHTML = dir;
            checkFolderGame(dir);
            let data = JSON.stringify(config, null, 2);
            fs.writeFileSync('settings.json', data, (err) => {
                if (err) throw err;
                //readSettingsJson();


                Swal.fire(
                    'Saved!',
                    'Your Riot Games path has been updated',
                    'success'
                );





            });
        }

    });



    //------------------------------------------------------------------------------------------------------
    // SETS audioOptions BOOLEAN VALUE
    //------------------------------------------------------------------------------------------------------
    document.getElementById("muteCheck").addEventListener('change', function() {


        if (this.checked) {

            audioOptions = false

            var config = {
                gamePath: dir.toString(),
                sound: audioOptions
            };

            var data = JSON.stringify(config, null, 2);

            fs.writeFile('settings.json', data, (err) => {
                if (err) throw err;
                readSettingsJson();


            });

        } else {

            audioOptions = true

            var config = {
                gamePath: dir.toString(),
                sound: audioOptions
            };


            var data = JSON.stringify(config, null, 2);

            fs.writeFile('settings.json', data, (err) => {
                if (err) throw err;
                readSettingsJson();
            });

        }
    });



    //------------------------------------------------------------------------------------------------------
    // LOAD EVERY THEME SCREEN - START
    //------------------------------------------------------------------------------------------------------
    document.getElementById("lol_sidebar").addEventListener("click", event => {

        audioPlayer("League")


    });

    document.getElementById("lor_sidebar").addEventListener("click", event => {
        audioPlayer("Bacon")
    });

    document.getElementById("valorant_sidebar").addEventListener("click", event => {
        audioPlayer("Valorant")
    });

    document.getElementById("settings_sidebar").addEventListener("click", event => {
        audio.pause();
    });

    //------------------------------------------------------------------------------------------------------
    // LOAD EVERY THEME SCREEN - END
    //------------------------------------------------------------------------------------------------------


    //------------------------------------------------------------------------------------------------------
    // LAUNCH GAMES USING MyDir - StART
    //------------------------------------------------------------------------------------------------------

    document.getElementById("playLeague").addEventListener("click", event => {

        launchLeague();
    });
    document.getElementById("playBacon").addEventListener("click", event => {
        launchBacon()
    });

    document.getElementById("playValorant").addEventListener("click", event => {
        launchValorant();
    });
    //------------------------------------------------------------------------------------------------------
    // LAUNCH GAMES USING MyDir - END
    //------------------------------------------------------------------------------------------------------
}
//#endregion


//#region Tray , read Json , Launch Games , first run, audio player

//------------------------------------------------------------------------------------------------------
// SETS THE NEW TRAY ICON TO BE DISPLAYED
//------------------------------------------------------------------------------------------------------
function trayIconOption() {



    try {
        tray = new Tray(IconPath);
        let template = [{
                label: 'Play League of Legends',
                click: function() {
                    launchLeague();
                }

            },

            {
                label: 'Play Legends of Runeterra',
                click: function() {
                    launchBacon();
                }
            },

            {
                label: 'Play Valorant',
                click: function() {
                    launchValorant();
                }
            },
            {
                label: 'Quit URGL',
                click: function() {
                    win.close();
                }
            }



        ]
        const contextMenu = Menu.buildFromTemplate(template);
        tray.setContextMenu(contextMenu);



        tray.on('double-click', function() {
            audio.play();
            win.show();
        })

    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong! ' + error.toString(),
            footer: '<a href=http://urgl.me/Support.html target=_blank>Report an issue</a>'
        })
    }

}


//------------------------------------------------------------------------------------------------------
// PARSES SETTINGS.JSON AND READ IT EVERY SESSION
//------------------------------------------------------------------------------------------------------
function readSettingsJson() {


    try {
        var dataJson = fs.readFileSync('settings.json');
        var configuration = JSON.parse(dataJson);
        dir = configuration.gamePath;
        audioOptions = configuration.sound;
        checkFolderGame(dir)
    } catch (error) {
        throw error;
    }



}

//------------------------------------------------------------------------------------------------------
// GAME LAUNCH METHODS
//------------------------------------------------------------------------------------------------------
//#region  Launch Game

//------------------------------------------------------------------------------------------------------
// GAME LAUNCH WITH PARAMETERS READING SETTING.JSON FOR GAMEPATH - START
//------------------------------------------------------------------------------------------------------

function launchLeague() {

    try {
        fs.accessSync(`${dir}\\Riot Client`);

        var execArguments = ['--launch-product=league_of_legends', '--launch-patchline=live'];

        child(`${dir}\\Riot Client\\RiotClientServices.exe`, execArguments, function(err, data) {
            if (err) {
                Swal.fire(
                    'Error ',
                    err.toString(),
                    'info')
                return;
            }
        });
        audio.pause();

        win.hide();

    } catch (error) {
        Swal.fire(
            'Unspected error',
            error.toString(),
            'info'
        )
    }
}


function launchBacon() {
    try {
        fs.accessSync(`${dir}\\Riot Client`);

        var execArguments = ['--launch-product=bacon', '--launch-patchline=live'];

        child(`${dir}\\Riot Client\\RiotClientServices.exe`, execArguments, function(err, data) {
            if (err) {
                Swal.fire(
                    'Error ',
                    err.toString(),
                    'info')
                return;
            }
        });
        audio.pause();

        win.hide();

        Swal.fire(
            'game could not be found ',
            'Make sure the path is specified',
            'info')


    } catch (error) {
        Swal.fire(
            'Unspected error',
            error.toString(),
            'info'
        )
    }
}

function launchValorant() {
    try {
        fs.accessSync(`${dir}\\Riot Client`);

        var execArguments = ['--launch-product=valorant', '--launch-patchline=live'];

        child(`${dir}\\Riot Client\\RiotClientServices.exe`, execArguments, function(err, data) {
            if (err) {
                Swal.fire(
                    'Error ',
                    err.toString(),
                    'info')
                return;
            }
        });
        audio.pause();

        win.hide();

        Swal.fire(
            'game could not be found ',
            'Make sure the path is specified',
            'info')


    } catch (error) {
        Swal.fire(
            'Unspected error',
            error.toString(),
            'info'
        )
    }


}
//------------------------------------------------------------------------------------------------------
// GAME LAUNCH WITH PARAMETERS READING SETTING.JSON FOR GAMEPATH - END
//------------------------------------------------------------------------------------------------------

//#endregion

//------------------------------------------------------------------------------------------------------
// CREATES SETTINGS.JSON AND RELOAD THE WINDOW IGNORING  CACHE
//------------------------------------------------------------------------------------------------------

function firstRun() {

    fs.access('settings.json', fs.constants.F_OK, (err) => {

        if (err) {

            var settingsJson = {
                "gamePath": "C:\\Riot Games",
                "sound": true
            }

            try {
                var settingsString = JSON.stringify(settingsJson, null, 2);
                fs.writeFile('settings.json', settingsString, (err) => {});


                let timerInterval
                Swal.fire({
                    title: 'Creating configuration file',
                    html: 'App will refresh in <b></b> ',
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
                        win.reload();

                    }
                })


            } catch (error) {
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    onOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                })

                Toast.fire({
                    icon: 'info',
                    title: 'Error ' + error
                })
            }

        }
    });

}

function checkFolderGame(directory) {
    try {
        fs.accessSync(directory + '\\League of Legends');
        document.getElementById("playLeague").innerHTML = 'PLAY';
    } catch (error) {

        document.getElementById("playLeague").innerHTML = 'INSTALL';
    }


    try {
        fs.accessSync(directory + '\\Legends of Runeterra');
        document.getElementById("playBacon").innerHTML = 'PLAY';
    } catch (error) {

        document.getElementById("playBacon").innerHTML = 'INSTALL';
    }


    try {
        fs.accessSync(directory + '\\Valorant');
        document.getElementById("playValorant").innerHTML = 'PLAY';
    } catch (error) {

        document.getElementById("playValorant").innerHTML = 'INSTALL';
    }

}

//------------------------------------------------------------------------------------------------------
// READS AUDIOOPTIONS BOOL VALUE IF TRUE THEN IT PLAYS EACH THEME SCREEN SOUND
//------------------------------------------------------------------------------------------------------


function audioPlayer(sound) {

    if (audioOptions == true) {
        var sw = sound;

        switch (sw) {
            case 'League':

                audio.pause();
                audio.currentTime = 0;
                audio = new Audio('assets/music/League.mp3');
                audio.loop = true;
                audio.volume = 0.5;
                audio.play();

                break;
            case 'Bacon':

                audio.pause();
                audio.currentTime = 0;
                audio = new Audio('assets/music/Bacon.mp3');
                audio.loop = true;
                audio.volume = 0.5;
                audio.play();

                break;
            case 'Valorant':
                audio.pause();
                audio.currentTime = 0;
                audio = new Audio('assets/music/Valorant.mp3');
                audio.loop = true;
                audio.volume = 0.2;
                audio.play();
                break;

            default:
                break;
        }
    }




}


//#endregion