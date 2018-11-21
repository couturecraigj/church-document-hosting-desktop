import express from 'express';
// eslint-disable-next-line import/no-extraneous-dependencies
import { app } from 'electron';
import getPort from 'get-port';
import path from 'path';
import log from './log';

const server = express();

log.debug(path.join(app.getPath('userData'), 'files'));
server.use(
  '/file',
  express.static(path.join(app.getPath('userData'), 'files'))
);

export default () =>
  new Promise(async resolve => {
    // eslint-disable-next-line no-console
    log.info(path.join(__static, 'files'));
    const port = await getPort();

    const httpServer = server.listen(port, () => {
      // eslint-disable-next-line no-console
      log.info(`express server is listening on port ${port}`);
      global.__EXPRESS_PORT__ = port;
      resolve(httpServer);
    });
  });
