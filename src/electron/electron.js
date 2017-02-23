const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

let mainWindow
let argv  = require('yargs')
  .usage('ngTest1\nUsage: $0 [options]')
  .example('ngTest1 [-i 123] [-p 456]\n[-s vpn.restomax.com]')
  .epilog('copyright 2017')
  .showHelp("log")
  .argv;

// make arg accessible in mainWindow via sharedObj
global.sharedObj = { iid: (argv.i ? argv.i : 'cdecu'), pk: (argv.p ? argv.p : '000331'), jabber: (argv.s ? argv.s : 'vpn.restomax.com') };
argv = null;

function createWindow () {
  mainWindow = new BrowserWindow({width: 1024, height: 800})

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, './index.html'),
    protocol: 'file:',
    slashes: true
    }))

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
