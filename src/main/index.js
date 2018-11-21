import fs from 'fs-extra';
import path from 'path';
// eslint-disable-next-line import/no-extraneous-dependencies
import { app, BrowserWindow, ipcMain } from 'electron';
import rimraf from 'rimraf';
import { format as formatUrl } from 'url';
import electronDl from 'electron-dl';
import log from './log';
// import fetch from 'electron-fetch';
// import * as path from 'path';
import server from './server';
import convertToHtml from '../ConvertFile';
// import File from '../common/File';
// import createSocket from '../common/socket';
const tempFolder = app.getPath('temp');
const fileFolder = path.join(app.getPath('userData'), 'files');
const isDevelopment = process.env.NODE_ENV !== 'production';
// const WS_URL = 'http://localhost:3002';
// const HTTP_URL = 'http://localhost:3000';
// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow;
let app2;

electronDl();

async function createMainWindow() {
  if (!fs.existsSync(tempFolder)) fs.mkdirSync(tempFolder);

  if (!fs.existsSync(fileFolder)) fs.mkdirSync(fileFolder);

  global.__FILES_FOLDER__ = fileFolder;
  global.__TEMP_FOLDER__ = tempFolder;

  // global.__WS_URL__ = WS_URL;

  // if (!isDevelopment) {
  // }

  // ipcMain.on('ondragstart', (event, files) => {
  //   // event.sender.startDrag({
  //   //   icon: `${__static}/archive-outline.png`,
  //   //   files: files.map(file => file.path)
  //   // });
  // });
  ipcMain.on('deletefolder', (event, folder) => {
    rimraf(path.join(fileFolder, folder), err => {
      if (err) log.error(err);
    });
  });
  ipcMain.on('uploadfolder', (event, folder) => {
    // perform upload here
    setTimeout(() => {
      rimraf(path.join(fileFolder, folder), err => {
        if (err) log.error(err);
      });
    }, 2000);
  });
  ipcMain.on('downloadfolder', (event, name) => {
    const zipdir = require('zip-dir');

    zipdir(
      path.join(fileFolder, name),
      { saveTo: path.join(tempFolder, name) + '.zip' },
      function() {
        electronDl
          .download(
            BrowserWindow.getFocusedWindow(),
            formatUrl({
              pathname: path.join(tempFolder, name) + '.zip',
              protocol: 'file',
              slashes: true
            })
          )
          .then(() => {
            fs.unlinkSync(path.join(tempFolder, name) + '.zip');
          });
      }
    );
  });

  ipcMain.on('ondragend', (event, file) => {
    event.sender.startDrag({
      icon: `${__static}/archive-outline.png`,
      file: file.path
    });
  });
  ipcMain.on('ondrop', (event, files) => {
    files.map(({ path: filePath, name }) => {
      const newPath = path.join(tempFolder, name);
      const writeStream = fs.createWriteStream(newPath);

      writeStream.on('finish', async () => {
        // file.upload({ originalFileName: name, path: newPath, ...props });
        const fileName = await convertToHtml(
          newPath,
          path.join(fileFolder, name.replace(/\.[0-9a-z]+$/i, ''))
        );

        event.sender.send('ondropfinished', fileName);
      });
      fs.createReadStream(filePath).pipe(writeStream);
    });
    // event.sender.startDrag({
    //   icon: `${__static}/archive-outline.png`,
    //   file: files.map(file => file.path)[0]
    // });
  });

  ipcMain.on('onfilechange', (event, { path: filePath, name }) => {
    // const [socket, io] = createSocket(WS_URL);

    // const file = new File(socket, io, WS_URL);
    const tempFolder = app.getPath('temp');

    if (!fs.existsSync(tempFolder)) fs.mkdirSync(tempFolder);

    const newPath = path.join(tempFolder, name);
    const writeStream = fs.createWriteStream(newPath);

    writeStream.on('finish', () => {
      const fileFolder = path.join(app.getPath('userData'), 'files');

      if (!fs.existsSync(fileFolder)) fs.mkdirSync(fileFolder);

      // file.upload({ originalFileName: name, path: newPath, ...props });
      convertToHtml(
        newPath,
        path.join(fileFolder, name.replace(/\.[0-9a-z]+$/i, ''))
      );
    });
    fs.createReadStream(filePath).pipe(writeStream);
  });

  // let urls;
  app2 = await server();
  const window = new BrowserWindow();

  if (isDevelopment) {
    window.webContents.openDevTools();
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  } else {
    window.loadURL(
      formatUrl({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
      })
    );
  }

  window.on('closed', () => {
    mainWindow = null;
  });

  window.webContents.on('devtools-opened', () => {
    window.focus();
    setImmediate(() => {
      window.focus();
    });
  });

  return window;
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  if (app2)
    app2.close(() => {
      log.info('express app closing');
    });
});

app.on('activate', async () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow();
  }
});

// create main BrowserWindow when electron is ready
app.on('ready', async () => {
  mainWindow = createMainWindow();
});
