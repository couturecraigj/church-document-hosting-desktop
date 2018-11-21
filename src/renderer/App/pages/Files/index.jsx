import React from 'react';
import { Link } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { remote } from 'electron';
import fs from 'fs';
import path from 'path';

const Files = () => (
  <div>
    <h3>Local Files</h3>
    {fs
      .readdirSync(remote.getGlobal('__FILES_FOLDER__'))
      .filter(file =>
        fs
          .lstatSync(path.join(remote.getGlobal('__FILES_FOLDER__'), file))
          .isDirectory()
      )
      .map(file => (
        <div>
          <Link to={`/file/${file}`} key={file}>
            {file}
          </Link>
        </div>
      ))}
    <h3>Remote Files</h3>
  </div>
);

export default Files;
