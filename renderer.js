// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const remote = require('electron').remote;
const Swal = require('sweetalert2');
const path = require('path');
const fs = require('fs');
const request = require('request');
const os = require('os');
const yaml = require('js-yaml');
var child = require('child_process').execFile;

const win = remote.getCurrentWindow();
require('v8-compile-cache');
const { Menu, Tray, dialog, app } = remote;
var newsLang;
var patch_note_link_league, patch_note_link_league1, patch_note_link_tft, leagueGamePath;
//let patch_note_link_bacon;
var patch_note_link_valorant, patch_note_link_valorant1;
var lol_news_url, lol_news_url1, lol_news_url2, lol_news_url3, lol_news_url4, lol_news_url5;
//region and locale
var default_locale, default_region;
//news lang

var install_text, play_text;
var close_title, close_ok, close_cancel, invalid_path_message, succes_title, succes_message, failed_title, failed_message, valid_league_path_message;


var tray;
var tmpDir = null; //storage temporary folder path after selecting it from dialog
var dir; //write his current value into gamePath inside settings.json also stores  the value from gamePath
var audio = new Audio();
var audioVolume;
var IconPath = path.join(__dirname, './assets/img/tray.ico'); //path to tray icon

// When document has loaded, initialise


document.onreadystatechange = (event) => {
    firstRun();
    //readSettingsJson();
    locale();
    LolNews();
    LeaguePatchNews();
    BaconPatchNews();
    ValorantPatchNews();





    if (event.target.readyState === 'complete') {

        handleWindowControls();

        trayIconOption();
        document.getElementById('app-ver').innerHTML = 'ver ' + app.getVersion();

        document.getElementById('displayPath').innerHTML = dir




    }



};


window.onbeforeunload = (event) => {
    /* If window is reloaded, remove win event listeners
    (DOM element listeners get auto garbage collected but not
    Electron win listeners as the win is not dereferenced unless closed) */
    win.removeAllListeners();
}



//#region UI 
function handleWindowControls() {

    //#region title bar
    document.getElementById('min-button').addEventListener("click", event => {
        audio.pause();
        audio.currentTime = 0;
        win.hide();
    });

    document.getElementById('close-button').addEventListener("click", event => {

        Swal.fire({
            title: close_title,
            text: "",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: close_ok,
            cancelButtonText: close_cancel
        }).then((result) => {
            if (result.value) {
                win.close();
            }
        })




    });
    //#endregion

    //#region  Cards

    document.getElementById("lol-patch-note-card").addEventListener("click", event => {
        audio.pause();
        window.open('https://na.leagueoflegends.com/' + newsLang + '/' + patch_note_link_league)

    });

    document.getElementById("lol-patch-note-card1").addEventListener("click", event => {
        audio.pause();

        let key;
        let choped;
        if (patch_note_link_league1.indexOf('https://youtu.be/') > -1) {
            key = 1
        }

        if (patch_note_link_league1.indexOf('https://twitch.amazon.com/tp/loot/') > -1) {
            key = 2
        }
        if (patch_note_link_league1.indexOf('https://www.youtube.com/') > -1) {
            key = 3
        }

        switch (key) {
            case 1:
                choped = patch_note_link_league1.slice(17, 28)
                window.open('https://www.youtube.com/embed/' + choped);
                break;
            case 2:
                window.open(patch_note_link_league1);
                break;
            case 3:
                choped = patch_note_link_league1.slice(32, 43)
                window.open('https://www.youtube.com/embed/' + choped);
                break;
            default:
                window.open('https://na.leagueoflegends.com/' + newsLang + '/' + patch_note_link_league1)
                break;
        }

    });



    document.getElementById("bacon-patch-note-card").addEventListener("click", event => {
        audio.pause();
        window.open('https://playruneterra.com/' + newsLang + '/news')

    });

    document.getElementById("valorant-patch-note-card").addEventListener("click", event => {
        audio.pause();
        let key;
        let choped;

        if (patch_note_link_valorant.indexOf('https://youtu.be/') > -1) {
            key = 1
        }

        if (patch_note_link_valorant.indexOf('https://twitch.amazon.com/tp/loot/') > -1) {
            key = 2
        }

        if (patch_note_link_valorant.indexOf('https://www.youtube.com/') > -1) {
            key = 3
        }

        switch (key) {
            case 1:
                choped = patch_note_link_valorant.slice(17, 28)
                window.open('https://www.youtube.com/embed/' + choped);
                break;
            case 2:
                window.open(patch_note_link_valorant);
                break;
            case 3:
                choped = patch_note_link_valorant.slice(32, 43)
                window.open('https://www.youtube.com/embed/' + choped);
                break;
            default:
                window.open('https://playvalorant.com/' + newsLang + patch_note_link_valorant)
                break;
        }





    });


    document.getElementById("valorant-patch-note-card1").addEventListener("click", event => {
        audio.pause();
        let key
        let choped;
        if (patch_note_link_valorant1.indexOf('https://youtu.be/') > -1) {
            key = 1
        }

        if (patch_note_link_valorant1.indexOf('https://twitch.amazon.com/tp/loot/') > -1) {
            key = 2
        }

        if (patch_note_link_valorant1.indexOf('https://www.youtube.com/') > -1) {
            key = 3
        }

        switch (key) {
            case 1:
                choped = patch_note_link_valorant1.slice(17, 28)
                window.open('https://www.youtube.com/embed/' + choped);
                break;
            case 2:
                window.open(patch_note_link_valorant1);
                break;
            case 3:
                choped = patch_note_link_valorant1.slice(32, 43)
                window.open('https://www.youtube.com/embed/' + choped);
                break;
            default:
                window.open('https://playvalorant.com/' + newsLang + patch_note_link_valorant1)
                break;
        }

    });




    document.getElementById("lol-news-card").addEventListener("click", event => {
        audio.pause();
        let choped = lol_news_url.slice(32, 43)
        window.open('https://www.youtube.com/embed/' + choped);
    });

    document.getElementById("lol-news-card2").addEventListener("click", event => {
        audio.pause();
        let choped = lol_news_url1.slice(32, 43)
        window.open('https://www.youtube.com/embed/' + choped);
    });

    document.getElementById("lol-news-card3").addEventListener("click", event => {
        audio.pause();
        let choped = lol_news_url2.slice(32, 43)
        window.open('https://www.youtube.com/embed/' + choped);
    });



    //#endregion

    //#region Settings

    document.getElementById("volume-controller").addEventListener("click", event => {
        audioVolumePlayer()

    });

    document.getElementById("selectFolder").addEventListener("click", event => {
        tmpDir = dialog.showOpenDialogSync(win, {
            properties: ['openFile', 'openDirectory']
        });
        let tmpDirString = tmpDir.toString();
        let cond = tmpDirString.indexOf('Riot Games') > -1;

        if (cond === true) {

            dir = tmpDir;
            WriteJson();
            document.getElementById('displayPath').innerHTML = dir;
            checkFolderGame();

            Swal.fire(
                succes_title,
                succes_message,
                'success'
            );


        } else {

            Swal.fire(
                failed_title,
                failed_message,
                'error'
            )

        }





    });



    document.getElementById("league-locale-settings").addEventListener("click", event => {
        audio.pause();
        readLeagueLocale();
    });

    document.getElementById("apply-changes").addEventListener("click", event => {
        let region_id = document.getElementById('region-id')
        let locale_id = document.getElementById("locale-id");

        let i = region_id.selectedIndex;
        let j = locale_id.selectedIndex;

        if (region_id.options[i].value !== "default-region") {
            default_region = region_id.options[i].value;
            WriteJson();
            child(leagueGamePath + '\\LeagueClient.exe', function (err) {
                if (err) {
                    Swal.fire(
                        'Error ',
                        err.toString(),
                        'info')
                    return;
                }
            });


        }

        if (locale_id[j].value !== "default-locale") {
            default_locale = locale_id[j].value;
            WriteJson();
            child(leagueGamePath + '\\LeagueClient.exe', function (err) {
                if (err) {
                    Swal.fire(
                        'Error ',
                        err.toString(),
                        'info')
                    return;
                }
            });

        }

        writeYaml();



    })


    document.getElementById("apply-lang").addEventListener("click", event => {
        try {
            let language_id = document.getElementById('language-id')

            let i = language_id.selectedIndex;
            newsLang = language_id[i].value;
            WriteJson();
            LolNews();
            LeaguePatchNews();
            BaconPatchNews();
            ValorantPatchNews();

            locale();

        } catch (error) {
            console.log(error)
        }



    });



    //#endregion

    //#region PlayIcons

    document.getElementById("playLeague").addEventListener("click", event => {

        launchLeague();
    });

    document.getElementById("playBacon").addEventListener("click", event => {

        launchBacon()
    });

    document.getElementById("playValorant").addEventListener("click", event => {

        launchValorant();
    });

    //#endregion

    //#region sidebar
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
        audio.currentTime = 0;


    });

    document.getElementById("home_sidebar").addEventListener("click", event => {
        audio.pause();
        audio.currentTime = 0;

    });

    document.getElementById("app-ver").addEventListener("click", event => {
        window.open('https://github.com/Eliosth/UNOFFICIAL-Riot-Games-Launcher/releases');
    });


    //#endregion



    //#endregion
}

//#region  Read and Write functions

function firstRun() {

    console.log('app running')

    if (fs.existsSync('settings.json')) {
        console.log('settings.json exist')

    } else {

        var settingsJson = {
            "gamePath": "C:\\Riot Games",
            "sound": true,
            "volume": 0.5,
            "locale": "",
            "region": "",
            "leagueDirectory": "C:\\Riot Games\\League of Legends",
            "lang": "en-us"
        }

        try {
            var settingsString = JSON.stringify(settingsJson, null, 2);
            fs.writeFile('settings.json', settingsString, (err) => { });
            location.reload();


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

    readSettingsJson();
}

function readSettingsJson() {

    //verify riot client

    try {
        var dataJson = fs.readFileSync('settings.json');
        var configuration = JSON.parse(dataJson);
        dir = configuration.gamePath;
        audioVolume = configuration.volume;

        default_locale = configuration.locale;
        default_region = configuration.region;
        leagueGamePath = configuration.leagueDirectory;
        newsLang = configuration.lang;



        if (fs.existsSync(dir) === true) {
            checkFolderGame();

        } else {
            console.log(newsLang)
            Swal.fire({
                title: '',
                text: invalid_path_message,
                icon: 'info'
            }).then((result) => {
                if (result.value) {
                    tmpDir = dialog.showOpenDialogSync(win, {
                        properties: ['openFile', 'openDirectory']
                    });
                    //SaveSettings();

                    let tmpDirString = tmpDir.toString();
                    let cond = tmpDirString.indexOf('Riot Games') > -1;

                    if (cond === true) {

                        dir = tmpDir;
                        WriteJson();
                        document.getElementById('displayPath').innerHTML = dir;
                        checkFolderGame();

                        Swal.fire(
                            succes_title,
                            succes_message,
                            'success'
                        );


                    } else {

                        Swal.fire({
                            icon: 'error',
                            failed_title,
                            failed_message
                        })


                    }
                }
            })
        }





    } catch (error) {
        console.log(error);
    }



}

function WriteJson() {
    var config = {
        gamePath: dir.toString(),
        volume: audioVolume,
        locale: default_locale,
        region: default_region,
        leagueDirectory: leagueGamePath,
        lang: newsLang

    };

    let data = JSON.stringify(config, null, 2);
    fs.writeFile('settings.json', data, (err) => {
        if (err) console.log(err);
        readSettingsJson();

    });
}

function checkFolderGame() {

    let home_path = os.homedir();
    try {
        fs.accessSync(home_path + '\\AppData\\Local\\Riot Games\\League of Legends')
        document.getElementById("playLeague").innerHTML = play_text;
    } catch (error) {

        document.getElementById("playLeague").innerHTML = install_text;
    }


    try {
        fs.accessSync(home_path + '\\AppData\\Local\\Riot Games\\LoR');
        document.getElementById("playBacon").innerHTML = play_text;
    } catch (error) {

        document.getElementById("playBacon").innerHTML = install_text;
    }


    try {
        fs.accessSync(home_path + '\\AppData\\Local\\Riot Games\\VALORANT');
        document.getElementById("playValorant").innerHTML = play_text;
    } catch (error) {

        document.getElementById("playValorant").innerHTML = install_text;
    }

}



function readLeagueLocale() {

    if (fs.existsSync(leagueGamePath)) {
        readGlobals();
        WriteJson();

        document.getElementById('region-id').options[0].text = default_region;
        languageDisplay();
        locale();



    } else {

        Swal.fire({
            title: '',
            text: valid_league_path_message,
            imageUrl: 'assets/img/yasuo.jpg',
            imageWidth: 474,
            imageHeight: 355,
            imageAlt: 'Error',
        }).then((result) => {
            if (result.value) {
                let newLeaguePath = dialog.showOpenDialogSync(win, {
                    properties: ['openFile', 'openDirectory']
                });
                leagueGamePath = newLeaguePath.toString();
                readGlobals();
                WriteJson();
                document.getElementById('region-id').options[0].text = default_region;
                languageDisplay();
                locale();

            }

        })


    }

    function readGlobals() {
        let rawData = fs.readFileSync(leagueGamePath + '\\Config\\LeagueClientSettings.yaml', 'utf8');
        let data = yaml.safeLoad(rawData);
        default_locale = (data.install.globals.locale)
        default_region = (data.install.globals.region)
    }



    function languageDisplay() {
        switch (default_locale) {
            case 'zh_CN':
                document.getElementById('locale-id').options[0].text = '简体中文';

                break;
            case 'cs_CZ':
                document.getElementById('locale-id').options[0].text = 'čeština';

                break;
            case 'de_DE':
                document.getElementById('locale-id').options[0].text = 'DEUTSCHE';

                break;
            case 'el_GR':
                document.getElementById('locale-id').options[0].text = 'Ελληνικά';

                break;
            case 'en_AU':
                document.getElementById('locale-id').options[0].text = 'English AU';

                break;
            case 'en_GB':
                document.getElementById('locale-id').options[0].text = 'English GB';
                break;
            case 'en_US':
                document.getElementById('locale-id').options[0].text = 'English US';
                break;
            case 'es_MX':
                document.getElementById('locale-id').options[0].text = 'Español LATAM';
                document.getElementById('combo-region-locale').innerHTML = '';
                break;
            case 'es_ES':
                document.getElementById('locale-id').options[0].text = 'Español España';
                break;
            case 'fr_FR':
                document.getElementById('locale-id').options[0].text = 'Français';
                break;
            case 'hu_HU':
                document.getElementById('locale-id').options[0].text = 'MAGYAR';
                break;
            case 'it_IT':
                document.getElementById('locale-id').options[0].text = 'Italiano';
                document.getElementById('combo-region-locale').innerHTML = '';
                break;
            case 'ja_JP':
                document.getElementById('locale-id').options[0].text = '日本人';
                break;
            case 'ko_KR':
                document.getElementById('locale-id').options[0].text = '한국어';
                break;
            case 'pl_PL':
                document.getElementById('locale-id').options[0].text = 'POLSKIE';
                break;
            case 'pt_BR':
                document.getElementById('locale-id').options[0].text = 'Portugues do Brasil';
                document.getElementById('combo-region-locale').innerHTML = '';
                break;
            case 'ro_RO':
                document.getElementById('locale-id').options[0].text = 'ROMÂNĂ';
                break;
            case 'ru_RU':
                document.getElementById('locale-id').options[0].text = 'русский';
                break;
            case 'tr_TR':
                document.getElementById('locale-id').options[0].text = 'Türk';

                break;


            default:

                break;
        }


    }


}



function writeYaml() {

    try {
        let rawData = fs.readFileSync(leagueGamePath + '\\Config\\LeagueClientSettings.yaml', 'utf8');
        let data = yaml.safeLoad(rawData);
        data.install.globals.locale = default_locale;
        data.install.globals.region = default_region;

        let yamlStr = yaml.safeDump(data);
        fs.writeFileSync(leagueGamePath + '\\Config\\LeagueClientSettings.yaml', yamlStr, function (err, file) {
            if (err) {
                throw err;
            }
            console.log(err);
        });
    } catch (error) {
        console.log(error)
    }


}



//#endregion

//#region  Audio Functions
function audioPlayer(sound) {


    var sw = sound;

    switch (sw) {
        case 'League':

            audio.pause();
            audio.currentTime = 0;
            audio = new Audio('./assets/music/League.ogg');
            audio.loop = true;
            audio.volume = audioVolume;
            audio.play();

            break;
        case 'Bacon':

            audio.pause();
            audio.currentTime = 0;
            audio = new Audio('./assets/music/Bacon.ogg');
            audio.loop = true;
            audio.volume = audioVolume;
            audio.play();

            break;
        case 'Valorant':
            audio.pause();
            audio.currentTime = 0;
            audio = new Audio('./assets/music/Valorant.ogg');
            audio.loop = true;
            audio.volume = audioVolume;
            audio.play();
            break;

        default:
            break;
    }
}



function audioVolumePlayer() {



    (async () => {

        const { value: newVolume } = await Swal.fire({
            input: 'range',
            inputAttributes: {
                min: 0,
                max: 100,
                step: 10
            },
            inputValue: (audioVolume * 100),
            showCancelButton: false
        })
        if (newVolume) {
            audioVolume = (newVolume / 100);
            WriteJson();
        }

    })()
}
//#endregion

//#region  News board


function LeaguePatchNews() {

    request('https://lolstatic-a.akamaihd.net/frontpage/apps/prod/harbinger-l10-website/' + newsLang + '/production/' + newsLang + '/page-data/news/tags/patch-notes/page-data.json', { json: true }, (err, res, body) => {
        if (err) { return console.log(err); }

        try {
            patch_note_link_league = (body.result.pageContext.data.sections[0].props.articles[0].link.url)

            document.getElementById("lol-patch-note-title").innerHTML = (body.result.pageContext.data.sections[0].props.articles[0].title);
            document.getElementById("lol-patch-note-image").src = (body.result.pageContext.data.sections[0].props.articles[0].imageUrl);

        } catch (error) {

        }

    });



    request('https://lolstatic-a.akamaihd.net/frontpage/apps/prod/harbinger-l10-website/' + newsLang + '/production/' + newsLang + '/page-data/news/game-updates/page-data.json', { json: true }, (err, res, body) => {
        if (err) { return console.log(err); }
        try {
            patch_note_link_league1 = (body.result.pageContext.data.sections[0].props.articles[0].link.url)


            document.getElementById("lol-patch-note-title1").innerHTML = (body.result.pageContext.data.sections[0].props.articles[1].title);
            document.getElementById("lol-patch-note-image1").src = (body.result.pageContext.data.sections[0].props.articles[1].imageUrl);

        } catch (error) {

        }

    });







}



function BaconPatchNews() {
    // var patch_note_title, patch_note_image_url;
    // request('https://playvalorant.com/page-data/en-us/news/game-updates/valorant-patch-notes-1-05/page-data.json', { json: true }, (err, res, body) => {
    //     if (err) { return console.log(err); }
    //     patch_note_title = (body.result.data.allContentstackArticles.nodes[0].title);
    patch_note_image_url = ('https://images.contentstack.io/v3/assets/blta38dcaae86f2ef5c/blt2d6c87d6bf028a60/5fdc239d02fd0c7d345f12d0/SN2021_LoR_Thumbnail_Banner.jpg');
    //     patch_note_link_valorant = (body.path);



    switch (newsLang) {
        case 'cs-cz':
            document.getElementById("bacon-patch-note-title").innerHTML = 'Poslední zprávy';
            break;

        case 'de-de':
            document.getElementById("bacon-patch-note-title").innerHTML = 'Neuesten Nachrichten';
            break;

        case 'el-gr':
            document.getElementById("bacon-patch-note-title").innerHTML = 'Τελευταία νέα';
            break;

        case 'en-au':
            document.getElementById("bacon-patch-note-title").innerHTML = 'Latest News';
            break;

        case 'en-gb':
            document.getElementById("bacon-patch-note-title").innerHTML = 'Latest News';
            break;

        case 'en-us':
            document.getElementById("bacon-patch-note-title").innerHTML = 'Latest News';
            break;

        case 'es-mx':
            document.getElementById("bacon-patch-note-title").innerHTML = 'Últimas noticias';
            break;

        case 'es-es':
            document.getElementById("bacon-patch-note-title").innerHTML = 'Últimas noticias';
            break;

        case 'fr-fr':
            document.getElementById("bacon-patch-note-title").innerHTML = 'Dernières nouvelles';
            break;

        case 'hu-hu':
            document.getElementById("bacon-patch-note-title").innerHTML = 'Legfrissebb hírek';
            break;
        case 'it-it':
            document.getElementById("bacon-patch-note-title").innerHTML = 'Ultime notizie';
            break;
        case 'ja-jp':
            document.getElementById("bacon-patch-note-title").innerHTML = '最新ニュース';
            break;
        case 'ko-kr':
            document.getElementById("bacon-patch-note-title").innerHTML = '최근 뉴스';
            break;
        case 'pl-pl':
            document.getElementById("bacon-patch-note-title").innerHTML = 'Najnowsze wiadomości';
            break;
        case 'pt-br':
            document.getElementById("bacon-patch-note-title").innerHTML = 'Últimas notícias';
            break;
        case 'ro-ro':
            document.getElementById("bacon-patch-note-title").innerHTML = 'Cele mai recente știri';
            break;
        case 'ru-ru':
            document.getElementById("bacon-patch-note-title").innerHTML = 'Последние новости';
            break;
        case 'tr-tr':
            document.getElementById("bacon-patch-note-title").innerHTML = 'Son Haberler';
            break;

        default:
            break;
    }



    document.getElementById("bacon-patch-note-image").src = patch_note_image_url;


}


function ValorantPatchNews() {

    request('https://playvalorant.com/page-data/' + newsLang + '/news/page-data.json', { json: true }, (err, res, body) => {
        if (err) { return console.log(err); }
        try {
            patch_note_link_valorant = (body.result.data.allContentstackArticles.nodes[0].external_link);




            document.getElementById("valorant-patch-note-title").innerHTML = (body.result.data.allContentstackArticles.nodes[0].title);
            document.getElementById("valorant-patch-note-image").src = (body.result.data.allContentstackArticles.nodes[0].banner.url);


            patch_note_link_valorant1 = (body.result.data.allContentstackArticles.nodes[2].url.url);

            document.getElementById("valorant-patch-note-title1").innerHTML = (body.result.data.allContentstackArticles.nodes[2].title);
            document.getElementById("valorant-patch-note-image1").src = (body.result.data.allContentstackArticles.nodes[2].banner.url);



            checkExternalLink(patch_note_link_valorant, patch_note_link_valorant1);

        } catch (error) {

        }

        function checkExternalLink(myExternalUrl, myExternalUrl1, myExternalUrl2) {
            if (myExternalUrl === "" || myExternalUrl1 === "" || myExternalUrl2 === "") {
                myExternalUrl = (body.result.data.allContentstackArticles.nodes[0].url.url);
                myExternalUrl2 = (body.result.data.allContentstackArticles.nodes[0].url.url);
                myExternalUrl3 = (body.result.data.allContentstackArticles.nodes[0].url.url);
            } else {
                myExternalUrl = (body.result.data.allContentstackArticles.nodes[0].url.url);
                myExternalUrl2 = (body.result.data.allContentstackArticles.nodes[0].url.url);
                myExternalUrl3 = (body.result.data.allContentstackArticles.nodes[0].url.url);
            }
        }
    });





}


function LolNews() {
    request('https://lolstatic-a.akamaihd.net/frontpage/apps/prod/harbinger-l10-website/' + newsLang + '/production/' + newsLang + '/page-data/news/media/page-data.json', { json: true }, (err, res, body) => {
        if (err) { return console.log(err); }
        try {
            lol_news_url = (body.result.pageContext.data.sections[0].props.articles[0].link.url)

            document.getElementById("lol-news-title").innerHTML = (body.result.pageContext.data.sections[0].props.articles[0].title);
            document.getElementById("lol-news-image").src = (body.result.pageContext.data.sections[0].props.articles[0].imageUrl);


            lol_news_url1 = (body.result.pageContext.data.sections[0].props.articles[1].link.url)

            document.getElementById("lol-news-title1").innerHTML = (body.result.pageContext.data.sections[0].props.articles[1].title);
            document.getElementById("lol-news-image1").src = (body.result.pageContext.data.sections[0].props.articles[1].imageUrl);


            lol_news_url2 = (body.result.pageContext.data.sections[0].props.articles[2].link.url)

            document.getElementById("lol-news-title2").innerHTML = (body.result.pageContext.data.sections[0].props.articles[2].title);
            document.getElementById("lol-news-image2").src = (body.result.pageContext.data.sections[0].props.articles[2].imageUrl);



        } catch (error) {

        }


    });



}







//#endregion

//#region  Launch Games

function trayIconOption() {

    try {
        tray = new Tray(IconPath);
        let template = [{
            label: 'League of Legends',
            click: function () {
                launchLeague();
            }

        },
        {
            type: "separator"
        },

        {
            label: 'Legends of Runeterra',
            click: function () {
                launchBacon();
            }
        },
        {
            type: "separator"
        },

        {
            label: 'VALORANT',
            click: function () {
                launchValorant();
            }
        },
        {
            type: "separator"
        },

        {

            label: 'Restart',

            click: function () {
                app.quit();
                app.relaunch();
            }

        },

        {
            type: "separator"
        },


        {

            label: 'Exit',

            click: function () {

                app.quit();
            }
        }


        ]
        const contextMenu = Menu.buildFromTemplate(template);
        tray.setContextMenu(contextMenu);



        tray.on('double-click', function () {
            win.show();
            audio.play();
        })

    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong! ' + error.toString(),
            footer: '<a href=https://github.com/Eliosth/UNOFFICIAL-Riot-Games-Launcher/issues target=_blank>Report an issue</a>'
        })
    }



}


function launchLeague() {

    try {
        fs.accessSync(`${dir}\\Riot Client`);

        var execArguments = ['--launch-product=league_of_legends', '--launch-patchline=live'];

        child(`${dir}\\Riot Client\\RiotClientServices.exe`, execArguments, function (err, data) {
            if (err) {
                Swal.fire(
                    'Error ',
                    err.toString(),
                    'info')
                return;
            }
        });
        audio.pause();
        audio.currentTime = 0;
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

        child(`${dir}\\Riot Client\\RiotClientServices.exe`, execArguments, function (err, data) {
            if (err) {
                Swal.fire(
                    'Error ',
                    err.toString(),
                    'info')
                return;
            }
        });
        audio.pause();
        audio.currentTime = 0;
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

        child(`${dir}\\Riot Client\\RiotClientServices.exe`, execArguments, function (err, data) {
            if (err) {
                Swal.fire(
                    'Error ',
                    err.toString(),
                    'info')
                return;
            }
        });
        audio.pause();
        audio.currentTime = 0;
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

//#endregion

//#endregion

//#region Translate

function locale() {

    switch (newsLang) {
        case 'cs-cz':
            document.getElementById('language-id').options[0].text = 'čeština'; // Select language
            document.getElementById('combo-region-locale').innerHTML = 'Vyberte libovolnou kombinaci mezi regionem a jazykem, jakmile se uloží klient League of Legends, automaticky se otevře a aktualizuje se na vybraný jazyk. Poté můžete hru spustit pomocí spouštěče, jako jste to udělali dříve.';
            document.getElementById('selectFolder').innerHTML = 'Hledat'; //select Folder


            document.getElementById("sounds").innerHTML = 'Zvuky' //Sounds

            document.getElementById("language").innerHTML = 'Jazyky' //Languages
            document.getElementById("apply-lang").innerHTML = 'Aplikovat' //Apply
            document.getElementById("apply-changes").innerHTML = 'Uložit' //Save 
            document.getElementById("league-locale-title").innerHTML = 'Jazyk a region League of Legends'; //Title Locale



            invalid_path_message = 'Vyberte platnou cestu ke složce Riot Games';
            install_text = 'Nainstalujte';
            play_text = 'hrát ';
            succes_title = 'Uloženo!';
            succes_message = 'Vaše cesta k nepokojům byla aktualizována';
            failed_title = 'Jejda ...';
            failed_message = 'Nemůžete uložit, aniž byste nejprve vybrali platnou cestu!';



            valid_league_path_message = 'složka legendy nebyla nalezena, zadejte platnou cestu.';
            close_title = 'Jsi si jistá?'
            close_ok = 'Odejít';
            close_cancel = 'zrušení'


            break;
        case 'de-de':
            document.getElementById('language-id').options[0].text = 'DEUTSCHE'; // Select language
            document.getElementById('combo-region-locale').innerHTML = 'Wählen Sie eine Kombination zwischen Region und Sprache aus. Nach dem Speichern wird der League of Legends-Client automatisch geöffnet und auf die ausgewählte Sprache aktualisiert. Danach können Sie das Spiel wie zuvor mit dem Launcher öffnen.';
            document.getElementById('selectFolder').innerHTML = 'Suche'; //select Folder


            document.getElementById("sounds").innerHTML = 'Geräusche' //Sounds

            document.getElementById("language").innerHTML = 'Sprachen' //Languages
            document.getElementById("apply-lang").innerHTML = 'Anwenden' //Apply
            document.getElementById("apply-changes").innerHTML = 'sparen' //Save 
            document.getElementById("league-locale-title").innerHTML = 'League of Legends Sprache und Region'; //Title Locale

            invalid_path_message = 'Wählen Sie einen gültigen Pfad zum Ordner "Riot Games"';
            install_text = 'Installieren';
            play_text = 'Spielen';
            succes_title = 'Gespeichert!';
            succes_message = 'Ihr Riot Games-Pfad wurde aktualisiert';
            failed_title = 'Ups ...';
            failed_message = 'Sie können nicht speichern, ohne zuerst einen gültigen Pfad auszuwählen!';
            valid_league_path_message = 'Ordner "Liga der Legenden" wurde nicht gefunden. Bitte geben Sie einen gültigen Pfad an.';
            close_title = 'Bist du sicher?'
            close_ok = 'Verlassen';
            close_cancel = 'Stornieren'
            break;
        case 'el-gr':
            document.getElementById('language-id').options[0].text = 'Ελληνικά'; // Select language
            document.getElementById('combo-region-locale').innerHTML = 'Επιλέξτε οποιοδήποτε συνδυασμό μεταξύ περιοχής και γλώσσας, αφού αποθηκευτεί ο πελάτης του League of Legends θα ανοίξει αυτόματα και θα ενημερωθεί στην επιλεγμένη γλώσσα. Μετά από αυτό μπορείτε να ανοίξετε το παιχνίδι χρησιμοποιώντας το πρόγραμμα εκκίνησης όπως κάνατε πριν.';
            document.getElementById('selectFolder').innerHTML = 'Αναζήτηση'; //select Folder



            document.getElementById("sounds").innerHTML = 'Ακούγεται' //Sounds

            document.getElementById("language").innerHTML = 'Γλώσσες' //Languages
            document.getElementById("apply-lang").innerHTML = 'Ισχύουν' //Apply
            document.getElementById("apply-changes").innerHTML = 'Αποθηκεύσετε' //Save 
            document.getElementById("league-locale-title").innerHTML = "Γλώσσα και περιοχή του League of Legends"; //Title Locale

            invalid_path_message = 'Επιλέξτε μια έγκυρη διαδρομή για το φάκελο Riot Games';
            install_text = 'Εγκατάσταση';
            play_text = "να παίξουμε";

            succes_title = "Αποθηκεύτηκε!";
            succes_message = "Η διαδρομή σας στα παιχνίδια Riot έχει ενημερωθεί";
            fail_title = "Ωχ ...";
            fail_message = "Δεν μπορείτε να αποθηκεύσετε χωρίς να επιλέξετε πρώτα μια έγκυρη διαδρομή!";

            valid_league_path_message = "Δεν ήταν δυνατή η εύρεση του φακέλου League of Legends, παράσχετε μια έγκυρη διαδρομή.";

            close_title = 'Είσαι σίγουρος?'
            close_ok = 'Αδεια';
            close_cancel = 'Ματαίωση'
            break;
        case 'en-au':
            document.getElementById('language-id').options[0].text = 'English AU'; // Select language
            document.getElementById('combo-region-locale').innerHTML = 'Select any combo between region and language, once saved the League of Legends client will open automatically and update to the selected language. After that you can open the game using the launcher as you did before.';
            document.getElementById('selectFolder').innerHTML = 'Search'; //select Folder

            document.getElementById("sounds").innerHTML = 'Sounds' //Sounds

            document.getElementById("language").innerHTML = 'Languages' //Languages
            document.getElementById("apply-lang").innerHTML = 'Apply' //Apply
            document.getElementById("apply-changes").innerHTML = 'Save' //Save 
            document.getElementById("league-locale-title").innerHTML = 'League of Legends  language and region'; //Title Locale

            invalid_path_message = 'Select a valid path to Riot Games folder';
            install_text = 'Install';
            play_text = 'Play';
            succes_title = 'Saved!';
            succes_message = 'Your Riot Games path has been updated';
            failed_title = 'Oops...';
            failed_message = 'You cannot save without selecting a valid path first!';
            valid_league_path_message = 'league of legends folder could not be found, please provide a valid path.';
            close_title = 'Are you sure?'
            close_ok = 'Exit';
            close_cancel = 'Cancel'
            break;
        case 'en-gb':
            document.getElementById('language-id').options[0].text = 'English GB'; // Select language
            document.getElementById('combo-region-locale').innerHTML = 'Select any combo between region and language, once saved the League of Legends client will open automatically and update to the selected language. After that you can open the game using the launcher as you did before.';
            document.getElementById('selectFolder').innerHTML = 'Search'; //select Folder

            document.getElementById("sounds").innerHTML = 'Sounds' //Sounds

            document.getElementById("language").innerHTML = 'Languages' //Languages
            document.getElementById("apply-lang").innerHTML = 'Apply' //Apply
            document.getElementById("apply-changes").innerHTML = 'Save' //Save 
            document.getElementById("league-locale-title").innerHTML = 'League of Legends  language and region'; //Title Locale

            invalid_path_message = 'Select a valid path to Riot Games folder';
            install_text = 'Install';
            play_text = 'Play';
            succes_title = 'Saved!';
            succes_message = 'Your Riot Games path has been updated';
            failed_title = 'Oops...';
            failed_message = 'You cannot save without selecting a valid path first!';
            valid_league_path_message = 'league of legends folder could not be found, please provide a valid path.';
            close_title = 'Are you sure?'
            close_ok = 'Exit';
            close_cancel = 'Cancel'
            break;
        case 'en-us':
            document.getElementById('language-id').options[0].text = 'English US'; // Select language
            document.getElementById('combo-region-locale').innerHTML = 'Select any combo between region and language, once saved the League of Legends client will open automatically and update to the selected language. After that you can open the game using the launcher as you did before.';
            document.getElementById('selectFolder').innerHTML = 'Search'; //select Folder

            document.getElementById("sounds").innerHTML = 'Sounds' //Sounds

            document.getElementById("language").innerHTML = 'Languages' //Languages
            document.getElementById("apply-lang").innerHTML = 'Apply' //Apply
            document.getElementById("apply-changes").innerHTML = 'Save' //Save 
            document.getElementById("league-locale-title").innerHTML = 'League of Legends  language and region'; //Title Locale

            invalid_path_message = 'Select a valid path to Riot Games folder';
            install_text = 'Install';
            play_text = 'Play';
            succes_title = 'Saved!';
            succes_message = 'Your Riot Games path has been updated';
            failed_title = 'Oops...';
            failed_message = 'You cannot save without selecting a valid path first!';
            valid_league_path_message = 'league of legends folder could not be found, please provide a valid path.';
            close_title = 'Are you sure?'
            close_ok = 'Exit';
            close_cancel = 'Cancel'
            break;
        case 'es-mx':
            document.getElementById('language-id').options[0].text = 'Español LATAM'; // Select language
            document.getElementById('combo-region-locale').innerHTML = 'Seleccione cualquier combinación entre región e idioma, una vez guardado, el cliente de League of Legends se abrirá automáticamente y se actualizará al idioma seleccionado. Después de eso, puedes abrir el juego usando el launcher como lo hacías anteriormente.';
            document.getElementById('selectFolder').innerHTML = 'Buscar'; //select Folder

            document.getElementById("sounds").innerHTML = 'Sonidos' //Sounds

            document.getElementById("language").innerHTML = 'Idiomas' //Languages
            document.getElementById("apply-lang").innerHTML = 'Aplicar' //Apply
            document.getElementById("apply-changes").innerHTML = 'Guardar' //Save 
            document.getElementById("league-locale-title").innerHTML = 'Idioma y región de League of Legends'; //Title Locale

            invalid_path_message = 'Selecciona una ruta válida a la carpeta de Riot Games';
            install_text = 'Instalar';
            play_text = 'Jugar';
            succes_title = '¡Guardado!';
            succes_message = 'Tu ruta de Riot Games ha sido actualizada';
            fail_title = 'Vaya ...';
            fail_message = '¡No puede guardar sin seleccionar primero una ruta válida!';

            valid_league_path_message = 'No se pudo encontrar la carpeta de league of legends, por favor proporcione una ruta válida.';
            close_title = '¿Estás seguro?'
            close_ok = 'Salir';
            close_cancel = 'Cancelar'
            break;
        case 'es-es':
            document.getElementById('language-id').options[0].text = 'Español España'; // Select language
            document.getElementById('combo-region-locale').innerHTML = 'Seleccione cualquier combinación entre región e idioma, una vez guardado, el cliente de League of Legends se abrirá automáticamente y se actualizará al idioma seleccionado. Después de eso, puedes abrir el juego  usando el launcher como lo hacías anteriormente.';
            document.getElementById('selectFolder').innerHTML = 'Buscar'; //select Folder

            document.getElementById("sounds").innerHTML = 'Sonidos' //Sounds

            document.getElementById("language").innerHTML = 'Idiomas' //Languages
            document.getElementById("apply-lang").innerHTML = 'Aplicar' //Apply
            document.getElementById("apply-changes").innerHTML = 'Guardar' //Save 
            document.getElementById("league-locale-title").innerHTML = 'Idioma y región de League of Legends'; //Title Locale

            invalid_path_message = 'Selecciona una ruta válida a la carpeta de Riot Games';
            install_text = 'Instalar';
            play_text = 'Jugar';
            succes_title = '¡Guardado!';
            succes_message = 'Tu ruta de Riot Games ha sido actualizada';
            fail_title = 'Vaya ...';
            fail_message = '¡No puede guardar sin seleccionar primero una ruta válida!';
            valid_league_path_message = 'No se pudo encontrar la carpeta de league of legends, por favor proporcione una ruta válida.';
            close_title = '¿Estás seguro?'
            close_ok = 'Salir';
            close_cancel = 'Cancelar'
            break;
        case 'fr-fr':
            document.getElementById('language-id').options[0].text = 'Français'; // Select language
            document.getElementById('combo-region-locale').innerHTML = "Sélectionnez n'importe quelle combinaison entre la région et la langue, une fois enregistré, le client League of Legends s'ouvrira automatiquement et se mettra à jour dans la langue sélectionnée. Après cela, vous pouvez ouvrir le jeu en utilisant le lanceur comme vous l'avez fait auparavant.";
            document.getElementById('selectFolder').innerHTML = 'Rechercher'; //select Folder


            document.getElementById("sounds").innerHTML = 'Des sons' //Sounds

            document.getElementById("language").innerHTML = 'Langues' //Languages
            document.getElementById("apply-lang").innerHTML = 'Appliquer' //Apply
            document.getElementById("apply-changes").innerHTML = 'sauver' //Save 
            document.getElementById("league-locale-title").innerHTML = 'Langue et région de League of Legends'; //Title Locale

            invalid_path_message = 'Sélectionnez un chemin valide vers le dossier Riot Games';
            install_text = 'Installer';
            play_text = 'Jouer';
            succes_title = 'Enregistré!';
            succes_message = "Votre chemin d'accès à Riot Games a été mis à jour ";
            failed_title = 'Oups ...';
            failed_message = 'Vous ne pouvez pas enregistrer sans sélectionner au préalable un chemin valide!';
            valid_league_path_message = 'Le dossier league of legends est introuvable, veuillez fournir un chemin valide.';
            close_title = 'Tu es sûr?'
            close_ok = 'sortir';
            close_cancel = 'Annuler'
            break;
        case 'hu-hu':
            document.getElementById('language-id').options[0].text = 'MAGYAR'; // Select language
            document.getElementById('combo-region-locale').innerHTML = 'Válassza ki a kombinációt a régió és a nyelv között, miután elmentette a League of Legends kliens automatikusan megnyílik és frissül a kiválasztott nyelvre. Ezután a hordozórakéta segítségével megnyithatja a játékot, ahogy korábban is tette.';
            document.getElementById('selectFolder').innerHTML = 'RecheKeresésrcher'; //select Folder


            document.getElementById("sounds").innerHTML = 'hangok' //Sounds

            document.getElementById("language").innerHTML = 'Nyelvek' //Languages
            document.getElementById("apply-lang").innerHTML = 'Alkalmaz' //Apply
            document.getElementById("apply-changes").innerHTML = 'Mentés' //Save 
            document.getElementById("league-locale-title").innerHTML = 'League of Legends nyelv és régió'; //Title Locale

            invalid_path_message = 'Válasszon egy érvényes útvonalat a Riot Games mappához';
            install_text = 'Telepítés';
            play_text = 'játszani';
            succes_title = 'Mentett!';
            succes_message = 'A Riot Games útja frissült';
            fail_title = 'Hoppá ...';
            fail_message = 'Nem menthet el érvényes útvonal kiválasztása nélkül!';
            valid_league_path_message = 'Nem található a legenda bajnoksága, kérjük, adjon meg érvényes útvonalat.';
            close_title = 'biztos vagy ebben?'
            close_ok = 'Elhagy';
            close_cancel = 'Megszünteti'
            break;
        case 'it-it':
            document.getElementById('language-id').options[0].text = 'Italiano'; // Select language
            document.getElementById('combo-region-locale').innerHTML = 'Seleziona una combinazione qualsiasi tra regione e lingua, una volta salvato il client di League of Legends si aprirà automaticamente e si aggiornerà alla lingua selezionata. Dopodiché puoi aprire il gioco usando il programma di avvio come hai fatto prima.';
            document.getElementById('selectFolder').innerHTML = 'Cerca'; //select Folder


            document.getElementById("sounds").innerHTML = 'Suoni' //Sounds

            document.getElementById("language").innerHTML = 'Le lingue' //Languages
            document.getElementById("apply-lang").innerHTML = 'Applicare' //Apply
            document.getElementById("apply-changes").innerHTML = 'Salva' //Save 
            document.getElementById("league-locale-title").innerHTML = 'Lingua e regione di League of Legends'; //Title Locale

            invalid_path_message = 'Seleziona un percorso valido per la cartella Riot Games';
            install_text = 'Installa';
            play_text = 'giocare';
            succes_title = 'Salvato!';
            succes_message = 'Il tuo percorso di Riot Games è stato aggiornato';
            fail_title = 'Oops ...';
            fail_message = 'Non puoi salvare senza prima selezionare un percorso valido!';
            valid_league_path_message = 'Impossibile trovare la cartella della lega delle leggende, fornire un percorso valido.';
            close_title = 'Sei sicuro?'
            close_ok = 'Partire';
            close_cancel = 'Annulla'

            break;
        case 'ja-jp':
            document.getElementById('language-id').options[0].text = '日本人'; // Select language
            document.getElementById('combo-region-locale').innerHTML = '地域と言語の任意のコンボを選択します。保存すると、League of Legendsクライアントが自動的に開き、選択した言語に更新されます。 その後、以前と同じようにランチャーを使用してゲームを開くことができます。';
            document.getElementById('selectFolder').innerHTML = '検索'; //select Folder

            document.getElementById("sounds").innerHTML = '音' //Sounds

            document.getElementById("language").innerHTML = '言語' //Languages
            document.getElementById("apply-lang").innerHTML = '申し込む' //Apply
            document.getElementById("apply-changes").innerHTML = '保存する' //Save 
            document.getElementById("league-locale-title").innerHTML = 'リーグオブレジェンドの言語と地域'; //Title Locale

            invalid_path_message = 'Riot Gamesフォルダへの有効なパスを選択してください';
            install_text = 'インストール';
            play_text = '遊ぶ';

            succes_title = '保存！';
            succes_message = '暴動ゲームのパスが更新されました';
            failed_title = 'おっと...';
            failed_message = '最初に有効なパスを選択せずに保存することはできません！';

            valid_league_path_message = 'League of Legendsフォルダーが見つかりませんでした。有効なパスを入力してください。';
            close_title = '本気ですか？'
            close_ok = '去る';
            close_cancel = 'キャンセル'
            break;
        case 'ko-kr':
            document.getElementById('language-id').options[0].text = '한국어'; // Select language
            document.getElementById('combo-region-locale').innerHTML = '지역과 언어 사이의 콤보를 선택하십시오. 일단 저장되면 리그 오브 레전드 클라이언트가 자동으로 열리고 선택한 언어로 업데이트됩니다. 그 후에는 이전처럼 런처를 사용하여 게임을 열 수 있습니다.';
            document.getElementById('selectFolder').innerHTML = '검색'; //select Folder


            document.getElementById("sounds").innerHTML = '소리' //Sounds

            document.getElementById("language").innerHTML = '언어' //Languages
            document.getElementById("apply-lang").innerHTML = '대다' //Apply
            document.getElementById("apply-changes").innerHTML = '저장' //Save 
            document.getElementById("league-locale-title").innerHTML = '리그 오브 레전드 언어 및 지역'; //Title Locale

            invalid_path_message = 'Riot Games 폴더의 유효한 경로를 선택하십시오';
            install_text = 'インストール';
            install_text = '설치';
            play_text = '플레이';
            succes_title = '저장되었습니다!';
            succes_message = '라이 엇 게임 경로가 업데이트되었습니다';
            failed_title = '죄송합니다 ...';
            failed_message = '유효한 경로를 먼저 선택하지 않으면 저장할 수 없습니다!';
            valid_league_path_message = '리그 오브 레전드 폴더를 찾을 수 없습니다. 유효한 경로를 입력하십시오.';
            close_title = '확실합니까?'
            close_ok = '떠나다';
            close_cancel = '취소'
            break;
        case 'pl-pl':
            document.getElementById('language-id').options[0].text = 'POLSKIE'; // Select language
            document.getElementById('combo-region-locale').innerHTML = 'Wybierz dowolną kombinację między regionem i językiem, po zapisaniu klient League of Legends otworzy się automatycznie i zaktualizuje do wybranego języka. Następnie możesz otworzyć grę za pomocą programu uruchamiającego, tak jak wcześniej.';
            document.getElementById('selectFolder').innerHTML = 'Szukaj'; //select Folder


            document.getElementById("sounds").innerHTML = 'Dźwięki' //Sounds

            document.getElementById("language").innerHTML = 'Języki' //Languages
            document.getElementById("apply-lang").innerHTML = 'Zastosować' //Apply
            document.getElementById("apply-changes").innerHTML = 'Zapisać' //Save 
            document.getElementById("league-locale-title").innerHTML = 'Język i region League of Legends'; //Title Locale

            invalid_path_message = 'Wybierz prawidłową ścieżkę do folderu Riot Games';
            install_text = 'Zainstaluj';
            play_text = 'grać';
            succes_title = 'Zapisano!';
            succes_message = 'Twoja ścieżka Riot Games została zaktualizowana';
            failed_title = 'Ups ...';
            failed_message = 'Nie możesz zapisać bez uprzedniego wybrania prawidłowej ścieżki!';
            valid_league_path_message = 'Nie można znaleźć folderu League of Legends, podaj prawidłową ścieżkę.';
            close_title = 'Jesteś pewny?'
            close_ok = 'pozostawiać';
            close_cancel = 'Anuluj'
            break;
        case 'pt-br':
            document.getElementById('language-id').options[0].text = 'Portugues do Brasil'; // Select language
            document.getElementById('combo-region-locale').innerHTML = 'Selecione qualquer combinação entre região e idioma, uma vez salvo, o cliente League of Legends será aberto automaticamente e atualizado para o idioma selecionado. Depois disso, você pode abrir o jogo usando o inicializador, como fez antes.';
            document.getElementById('selectFolder').innerHTML = 'Pesquisar'; //select Folder

            document.getElementById("sounds").innerHTML = 'Sons' //Sounds

            document.getElementById("language").innerHTML = 'línguas' //Languages
            document.getElementById("apply-lang").innerHTML = 'Aplique' //Apply
            document.getElementById("apply-changes").innerHTML = 'Salve' //Save 
            document.getElementById("league-locale-title").innerHTML = 'Idioma e região de League of Legends'; //Title Locale

            invalid_path_message = 'Selecione um caminho válido para a pasta Riot Games';
            install_text = 'Instalar';
            play_text = 'Jogar';
            succes_title = 'Salvo!';
            succes_message = 'Seu caminho da Riot Games foi atualizado';
            fail_title = 'Oops ...';
            failed_message = 'Você não pode salvar sem selecionar um caminho válido primeiro!';
            valid_league_path_message = 'a pasta league of legends não foi encontrada, forneça um caminho válido.';
            close_title = 'Tem certeza?'
            close_ok = 'sair';
            close_cancel = 'Cancelar'
            break;
        case 'ro-ro':
            document.getElementById('language-id').options[0].text = 'ROMÂNĂ'; // Select language
            document.getElementById('combo-region-locale').innerHTML = 'Selectați orice combo între regiune și limbă, odată salvat clientul League of Legends se va deschide automat și se va actualiza la limba selectată. După aceea, puteți deschide jocul folosind lansatorul așa cum ați făcut anterior.';
            document.getElementById('selectFolder').innerHTML = 'Căutare'; //select Folder



            document.getElementById("sounds").innerHTML = 'Sunete' //Sounds

            document.getElementById("language").innerHTML = 'Limbile' //Languages
            document.getElementById("apply-lang").innerHTML = 'aplica' //Apply
            document.getElementById("apply-changes").innerHTML = 'Salvați' //Save 
            document.getElementById("league-locale-title").innerHTML = 'Limba și regiunea League of Legends'; //Title Locale

            nvalid_path_message = 'Selectați o cale valabilă către folderul Jocuri antidisturbare';
            install_text = 'Instalare';
            play_text = 'a juca';
            success_title = 'Salvat!';
            success_message = 'Calea ta pentru jocuri de revoltă a fost actualizată';
            failed_title = 'Oops ...';
            failed_message = 'Nu puteți salva fără a selecta mai întâi o cale validă!';
            valid_league_path_message = 'folderul League of Legends nu a putut fi găsit, vă rugăm să furnizați o cale validă.';
            close_title = 'Esti sigur?'
            close_ok = 'părăsi';
            close_cancel = 'Anulare'
            break;
        case 'ru-ru':
            document.getElementById('language-id').options[0].text = 'русский'; // Select language
            document.getElementById('combo-region-locale').innerHTML = 'Выберите любую комбинацию между регионом и языком, после сохранения клиент League of Legends откроется автоматически и обновится до выбранного языка. После этого вы можете открыть игру с помощью пусковой установки, как и раньше.';
            document.getElementById('selectFolder').innerHTML = 'Поиск'; //select Folder

            document.getElementById("sounds").innerHTML = 'Звуки' //Sounds

            document.getElementById("language").innerHTML = 'Языки' //Languages
            document.getElementById("apply-lang").innerHTML = 'Подать заявление' //Apply
            document.getElementById("apply-changes").innerHTML = 'Сохранить' //Save 
            document.getElementById("league-locale-title").innerHTML = 'Язык и регион League of Legends'; //Title Locale

            invalid_path_message = 'Выберите допустимый путь к папке Riot Games';
            install_text = 'Установить';
            play_text = 'играть';
            Succes_title = 'Сохранено!';
            Succes_message = 'Ваш путь к Riot Games обновлен';
            failed_title = 'Ой ...';
            failed_message = 'Вы не можете сохранить, не выбрав сначала действительный путь!';
            valid_league_path_message = 'Не удалось найти папку league of legends, укажите правильный путь.';
            close_title = 'Ты уверен?'
            close_ok = 'покинуть';
            close_cancel = 'Отмена'
            break;
        case 'tr-tr':


            document.getElementById('language-id').options[0].text = 'Türk'; // Select language
            document.getElementById('combo-region-locale').innerHTML = 'Bölge ve dil arasındaki herhangi bir kombinasyonu seçin, kaydedildikten sonra League of Legends istemcisi otomatik olarak açılacak ve seçilen dile göre güncellenecektir. Bundan sonra, daha önce yaptığınız gibi başlatıcıyı kullanarak oyunu açabilirsiniz.';
            document.getElementById('selectFolder').innerHTML = 'Ara'; //select Folder


            document.getElementById("sounds").innerHTML = 'sesler' //Sounds

            document.getElementById("language").innerHTML = 'Diller' //Languages
            document.getElementById("apply-lang").innerHTML = 'Uygulamak' //Apply
            document.getElementById("apply-changes").innerHTML = 'Kayıt etmek' //Save 
            document.getElementById("league-locale-title").innerHTML = 'League of Legends dili ve bölgesi'; //Title Locale

            invalid_path_message = 'Riot Games klasörüne giden geçerli bir yol seçin';
            install_text = 'Kur';
            play_text = 'oynamak';
            succes_title = 'Kaydedildi!';
            succes_message = 'Riot Games yolunuz güncellendi';
            fail_title = 'Hata ...';
            fail_message = 'Önce geçerli bir yol seçmeden kaydedemezsiniz!';
            valid_league_path_message = 'league of legends klasörü bulunamadı, lütfen geçerli bir yol sağlayın.';
            close_title = 'Emin misiniz?'
            close_ok = 'ayrılmak';
            close_cancel = 'İptal etmek'
            break;

        default:
            break;
    }

}

//#endregion