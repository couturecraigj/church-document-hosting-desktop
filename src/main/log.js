const log = require('electron-log');

log.transports.file.level = 'debug';
log.transports.file.format = '{h}:{i}:{s}:{ms} {text}';

const isDevelopment = process.env.NODE_ENV !== 'production';

if (isDevelopment) {
  const fs = require('fs');

  // Set approximate maximum log size in bytes. When it exceeds,
  // the archived log will be saved as the log.old.log file
  log.transports.file.maxSize = 5 * 1024 * 1024;

  // Write to this file, must be set before first logging
  log.transports.file.file = __dirname + '/log.txt';

  // fs.createWriteStream options, must be set before first logging
  // you can find more information at
  // https://nodejs.org/api/fs.html#fs_fs_createwritestream_path_options
  log.transports.file.streamConfig = { flags: 'w' };

  // set existed file stream
  log.transports.file.stream = fs.createWriteStream(__dirname + '/log.txt');
}

export default log;
