/*
 * @Descripttion:
 * @version:
 * @Author: lizhengang9
 * @Date: 2020-06-02 15:34:31
 * @LastEditors: lizhengang9
 * @LastEditTime: 2020-06-02 16:32:54
 */

'use strict';

import { app, BrowserWindow } from 'electron';
import cheerio from 'cheerio';
import request from 'request';

const reg = /\n|\s+/g;
const reg2 = /<[^>]*>/g;
const reg3 = /发自|手机|虎扑|m.hupu.com|客户端|iPhone|Android/g;
const tiezi = 33405590;

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path')
    .join(__dirname, '/static')
    .replace(/\\/g, '\\\\');
}

let mainWindow;
const winURL =
  process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`;

class Spider {
  fetch (url, callback) {
    request({ url: url, encoding: null }, (err, response, body) => {
      if (!err && response.statusCode === 200) {
        callback(
          null,
          cheerio.load('<body>' + body + '</body>', { decodeEntities: false })
        );
      } else {
        callback(err, cheerio.load('<body></body>'));
      }
    });
  }

  parseLen (err, $) {
    if (!err) {
      let result = $('#bbstopic_set').attr('data-maxpage');
      return result;
    }
  }

  parseData (err, $) {
    if (!err) {
      $('#t_main .floor').each((i, v) => {
        const author = $(v)
          .find('.floor_box .author .left')
          .find('a')
          .eq(0)
          .text();
        const text = $(v)
          .find('.floor_box tbody')
          .html()
          .replace(reg, '')
          .replace(reg2, '')
          .replace(reg3, '');
        mainWindow.webContents.send('data', `${author}:${text}`);
      });
      return true;
    }
  }
}

function queryLen () {
  const spider = new Spider();
  spider.fetch(`https://bbs.hupu.com/${tiezi}.html`, async (err, $) => {
    const len = spider.parseLen(err, $);
    await queryData(len - 1);
    await queryData(len);
  });
}

function queryData (len) {
  return new Promise((resolve, reject) => {
    const spider = new Spider();
    spider.fetch(`https://bbs.hupu.com/${tiezi}-${len}.html`, (err, $) => {
      console.log(`第${len}页`, '----------------------------');
      const result = spider.parseData(err, $);
      console.log(result);
      resolve();
    });
  });
}

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 300,
    useContentSize: true,
    width: 200,
  });

  mainWindow.loadURL(winURL);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  queryLen();
  setInterval(() => {
    queryLen();
  }, 120000);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
