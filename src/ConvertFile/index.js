const fs = require('fs');
// const imagemin = require('imagemin');
// const imageminJpegTran = require('imagemin-jpegtran');

const mammoth = require('mammoth');
const path = require('path');
const rimraf = require('rimraf');
const sharp = require('sharp');
const uuid = require('uuid/v4');

const log = require('../main/log').default;

const findTheLargestDimension = ({ width, height }) => {
  if (width >= height) return ['width', width];

  return ['height', height];
};

const HTML = (value, title) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta http-equiv="X-UA-Compatible" content="ie=edge"/>
  <title>${title}</title>
</head>
<body>
  ${value}
</body>
</html>`;

const convertToHtml = (fileName, folder) =>
  new Promise(async (resolve, reject) => {
    try {
      const fileNameArray = fileName
        .replace(/\.[0-9a-z]+$/i, '')
        .split(path.sep);
      const oldFileName = fileNameArray[fileNameArray.length - 1];
      const extension = fileName.replace(oldFileName, '');

      log.info(oldFileName);
      log.info(fileNameArray);

      if (!folder) {
        folder = path.join(
          __static,
          fileName.replace(extension, '').replace('temp', 'files')
        );
      }

      if (fs.existsSync(folder)) {
        await new Promise((resolve, reject) =>
          rimraf(folder, err => {
            // log.error(err);

            if (err) return reject(err);

            return resolve();
          })
        );
      }

      log.info(folder);
      fs.mkdirSync(folder);

      const options = {
        convertImage: mammoth.images.imgElement(function(image) {
          const fileName = uuid() + '.jpeg';

          return image
            .read()
            .then(
              imageBuffer =>
                new Promise((resolve, reject) =>
                  sharp(imageBuffer)
                    .metadata()
                    .then(metadata =>
                      Promise.resolve()
                        .then(() => {
                          log.debug('REACHED');

                          // Change Format Here
                          if (metadata.format === 'jpeg') return imageBuffer;

                          return sharp(imageBuffer)
                            .jpeg()
                            .toBuffer();
                        })
                        // .then(buffer =>
                        //   imagemin.buffer(buffer, {
                        //     plugins: [imageminJpegTran()]
                        //   })
                        // )
                        .then(buffer => {
                          // Change Size Here
                          if (metadata.width < 400 && metadata.height < 400)
                            return buffer;

                          const [dimension] = findTheLargestDimension(metadata);

                          log.debug(path.join(folder, fileName));

                          return sharp(buffer)
                            .resize({ [dimension]: 400 })
                            .toBuffer();
                        })
                        .then(buffer => {
                          fs.writeFile(
                            path.join(folder, fileName),
                            buffer,
                            { encoding: 'binary' },
                            err => {
                              if (err) {
                                log.error('fs.writeFile', err);

                                return reject(err);
                              }

                              return resolve({
                                src: './' + fileName
                              });
                            }
                          );
                        })
                        .catch(err => {
                          log.error(err);
                          reject(err);
                        })
                    )
                    .catch(err => {
                      log.error('SHARP', err);
                      reject(err);
                    })
                )
            )
            .catch(err => {
              log.error(err);

              return {
                src: './' + fileName
              };
            });
        })
      };

      log.info(fileName);

      return mammoth
        .convertToHtml({ path: fileName }, options)
        .then(function(result) {
          log.info('STEP REACHED');

          if (result.messages) {
            log.info(result.messages);
          }

          fs.writeFile(
            path.join(folder, 'index.html'),
            HTML(result.value, oldFileName.replace(extension, '')),
            err => {
              if (err) {
                log.error(err);
              }

              resolve(oldFileName);
            }
          );
        })
        .catch(error => {
          log.error(error);
          reject(error);
        })
        .done();
    } catch (error) {
      log.error(error);
      reject(error);
    }
  });

module.exports = convertToHtml;

// convertToHtml('11.4.18.docx');
// convertToHtml('Daily Prayer Guide 11.11.18.docx');
