/* eslint-disable arrow-body-style */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable quotes */
import 'babel-polyfill';
import express from 'express';
import { matchRoutes } from 'react-router-config';
import { createMemoryHistory } from 'history';
import { getCookie } from './utils';
import { performAuthentication, handleNoUser } from './helpers/auth';
import Routes from './client/Routes';
import renderer from './helpers/renderer';
import serverConfigureStore from './helpers/serverConfigureStore';

const app = express();

app.use(express.static('public'));

app.get('*', async (req, res) => {
  const cookie = req.get('cookie') || '';
  const token = getCookie(cookie, 'token');
  // Use firebase Admin SDK on server to verify
  // the retrieved ID token. If that ID token is
  // valid, fetch the user then dispatch appropriate
  // redux action with that user data.

  const history = createMemoryHistory();
  const { store, closableEpic } = serverConfigureStore(req, {}, history);
  if (token && token !== '') {
    await performAuthentication(store, token);
  } else {
    handleNoUser(store);
  }

  // UserAuth(TODO) -> Dispatch apt action to inform redux (and state) that hey,
  // "this" is the auth status of the user who requested the application.
  // Then use the new state to render the application.

  // console.log(matchRoutes(Routes, req.path));
  matchRoutes(Routes, req.path).map(({ route }) => {
    return route.loadData ? route.loadData(store) : null;
  });

  closableEpic.close((err) => {
    console.log("All epics completed");
    if (err) {
      console.log(err);
    }

    const context = {};
    const content = renderer(req, store, context);
    if (context.url) {
      return res.redirect(301, context.url);
    }
    if (context.notFound) {
      res.status(404);
    }

    res.send(content);
  });

  // const promises = matchRoutes(Routes, req.path).map(({ route }) => {
  //   return route.loadData ? route.loadData(store) : null;
  // })
  //   .map((promise) => {
  //     if (promise) {
  //       return new Promise((resolve, reject) => {
  //         promise.then(resolve).catch(reject);
  //       });
  //     }
  //   });

  // Promise.all(promises)
  //   .then(() => {
  //     const context = {};
  //     const content = renderer(req, store, context);

  //     if (context.url) {
  //       return res.redirect(301, context.url);
  //     }
  //     if (context.notFound) {
  //       res.status(404);
  //     }

  //     res.send(content);
  //   });
});

app.listen(3000, () => {
  console.log('listening on port 3000');
});
