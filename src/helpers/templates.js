import serialize from 'serialize-javascript';

export default (css, content, state = {}, inclBundle = false) => {
  let bundleScript = '<script type="text/javascript" src="/bundle.js"></script>';
  if (!inclBundle) {
    bundleScript = '';
  }
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      <meta name="theme-color" content="#000000">
      <script>
        // Redirect to HTTPS
        if (location.hostname === 'crowdalert.herokuapp.com' && location.protocol !== 'https:') {
          location.href = location.href.replace('http:','https:')
        }
      </script>


      <!-- Semantic UI CSS -->   
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"></link>
      <!-- <link rel="apple-touch-icon" sizes="180x180" href="/static/icons/apple-touch-icon.png"> -->
      <!-- <link rel="icon" type="image/png" sizes="32x32" href="/static/icons/favicon-32x32.png"> -->
      <!-- <link rel="icon" type="image/png" sizes="16x16" href="/static/icons/favicon-16x16.png"> -->
      <!-- <link rel="mask-icon" href="/static/icons/safari-pinned-tab.svg" color="#5bbad5"> -->

      <!--
        manifest.json provides metadata used when your web app is added to the
        homescreen on Android. See https://developers.google.com/web/fundamentals/engage-and-retain/web-app-manifest/
      -->
      <link rel="manifest" href="/manifest.json">
      <link rel="shortcut icon" href="/favicon.ico">

      <meta name="msapplication-TileColor" content="#9f00a7">
      <!-- <meta name="msapplication-config" content="/static/icons/browserconfig.xml"> -->
      <!--
        Notice the use of %PUBLIC_URL% in the tags above.
        It will be replaced with the URL of the 'public' folder during the build.
        Only files inside the 'public' folder can be referenced from the HTML.

        Unlike "/favicon.ico" or "favicon.ico", "%PUBLIC_URL%/favicon.ico" will
        work correctly both with client-side routing and a non-root public URL.
        Learn how to configure a non-root public URL by running 'npm run build'.
      -->
      <title>CrowdAlert</title>
      <style>${[...css].join('')}</style>
    </head>
    <body style="background: #f3f2f2">
    <!--
      <div class="ui active page dimmer" id="docs-loading-dimmer">
        <div class="content">
          <div class="center">         
            <div class="ui large text loader">
              <div class="ui inverted yellow header">
                Loading
              </div>
            </div>
          </div>
        </div>
      </div>
    -->
      <noscript>
        You need to enable JavaScript to run this app.
      </noscript>
      <style>
        .ui.menu .item:before {
            width: 0px;
        }
      </style>
      <div id="root">${content}</div>
      <script>
        window.__INITIAL_STATE__ = ${serialize(state)}
        /* 
        var delay = 500;
        var dimmer = document.querySelector('#docs-loading-dimmer');
        dimmer.style.pointerEvents = 'none';
        dimmer.style.transition = 'opacity ' + delay +'ms linear';
        */
      </script>
      ${bundleScript}
      <!--
        This HTML file is a template.
        If you open it directly in the browser, you will see an empty page.

        You can add webfonts, meta tags, or analytics to this file.
        The build step will place the bundled scripts into the <body> tag.

        To begin the development, run 'npm start' or 'yarn start'.
        To create a production bundle, use 'npm run build' or 'yarn build'.
      -->
    </body>
  </html>
  `;
};
