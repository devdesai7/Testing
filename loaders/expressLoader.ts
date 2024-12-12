import { Application } from 'express';
import {
  MicroframeworkLoader,
  MicroframeworkSettings,
} from 'microframework-w3tec';
import { createExpressServer } from 'routing-controllers';
// import { currentUserChecker } from '../auth/currentUserChecker';

import { env } from '../env';

export const expressLoader: MicroframeworkLoader = (
  settings: MicroframeworkSettings | undefined,
) => {
  if (settings) {
    /**
     * We create a new express server instance.
     * We could have also use useExpressServer here to attach controllers to an existing express instance.
     */
    const expressApp: Application = createExpressServer({
      cors: {
        origin: '*', // Allows all origins
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Optional: You can specify allowed HTTP methods
        allowedHeaders: ['Content-Type', 'Authorization'], // Optional: Specify allowed headers
      },
      classTransformer: true,
      routePrefix: env.app.routePrefix,
      defaultErrorHandler: false,
      /**
       * We can add options about how routing-controllers should configure itself.
       * Here we specify what controllers should be registered in our express server.
       */
      controllers: env.app.dirs.controllers,
      middlewares: env.app.dirs.middlewares,

      /**
       * AuthorizationX features, commenting this as we are using api gateway: need to discuss,
       * Current user, need to integrate common util function
       */
      // AuthorizationXChecker: AuthorizationXChecker(),
      // currentUserChecker: currentUserChecker(),
      validation: { validationError: { target: false } },
    });

    // Run application to listen on given port
    if (!env.isTest) {
      const server = expressApp.listen(env.app.port);
      settings.setData('express_server', server);
    }

    // Here we can set the data for other loaders
    settings.setData('express_app', expressApp);
  }
};
