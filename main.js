const { app, BrowserWindow } = require('electron')
const client = require('discord-rich-presence')('842019970270887956')
const loginTime = Date.now()
const debugMode = false;
const express = require('express')
const expressApp = express()
const keytar = require('keytar')
const MojangAPI = require('mojang-api');
const fs = require('fs')
var login;

var data = {
    user: undefined
};

expressApp.use(express.urlencoded())

function createWindow() {
    client.updatePresence({
        state: 'Logging in',
        startTimestamp: loginTime,
        largeImageKey: 'gcl_logo',
        largeImageText: "GCL Version 1.0",
        instance: true,
    });

    login = new BrowserWindow({
        width: 350,
        height: 450,
        icon: __dirname + "/GCL.png",
        autoHideMenuBar: true,
        resizable: false,
        thickFrame: true
    })

    login.loadFile('login.html')
    if (debugMode) login.webContents.openDevTools()
}

function openMainWindow() {
    login.hide()

    client.updatePresence({
        state: 'Browsing instances',
        startTimestamp: loginTime,
        largeImageKey: 'gcl_logo',
        largeImageText: "GCL Version 1.0",
        smallImageKey: 'grass_block'
    });

    const window = new BrowserWindow({
        width: 1280,
        height: 720,
        minWidth: 1180,
        minHeight: 620,
        icon: __dirname + "/GCL.png",
        autoHideMenuBar: true,
        resizable: true,
        thickFrame: true,
        webPreferences: {
            nodeIntegration: true,
            preload: __dirname + "/preload.js"
        }
    })

    window.loadFile('index.html')
    if (debugMode) login.webContents.openDevTools()

    return {}
}

app.whenReady().then(() => {
    createWindow()
    app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow() })
})

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit() })

expressApp.get('/api/get', (req, res) => {
    const type = req.query.t
    switch (type) {
        case 'user':
            res.json(data.user)
            break

        case 'pwd':
            let x = keytar.findPassword(req.query.q)
            x.then(y => {
                res.json(y)
            })
            break

        default:
            res.json({ code: 404 })
            break
    }
});

expressApp.post('/api/login', (req, res) => {
    if (req.body.username === "" || req.body.password === "") return;
    MojangAPI.nameToUuid(req.body.username, (err, uuid) => {
        if (err) return
        data.user = uuid[0]
        keytar.setPassword("gcl", uuid[0].id, req.body.password).then(openMainWindow())
    })
})

expressApp.listen(53170, () => {
    console.info("Local Webserver started.")
})