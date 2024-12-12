import 'reflect-metadata';

import { bootstrapMicroframework } from 'microframework-w3tec';

import { banner } from './lib/banner';
import { Logger } from './lib/logger';
import { expressLoader } from './loaders/expressLoader';
import { iocLoader } from './loaders/iocLoader';
import { winstonLoader } from './loaders/winstonLoader';

/**
 * EXPRESS TYPESCRIPT BOILERPLATE
 * ----------------------------------------
 *
 * This is a boilerplate for Node.js Application written in TypeScript.
 * The basic layer of this app is express. For further information visit
 * the 'README.md' file.
 */
const log = new Logger(__filename);
import mongoconnect from './loaders/mongoDBLoader';

bootstrapMicroframework({
  /**
   * Loader is a place where you can configure all your modules during microframework
   * bootstrap process. All loaders are executed one by one in a sequential order.
   */
  loaders: [winstonLoader, iocLoader, expressLoader],
})
  .then(() => {
    mongoconnect();
    banner(log);
  })
  .catch((error) => log.error('Application is crashed: ' + error));
