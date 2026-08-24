import { ScrollViewStyleReset } from 'expo-router/html';
import type { ReactNode } from 'react';

// Web-only root HTML. Phone-sized frame on desktop so Tyler can tap through
// the portrait app in a browser.
export default function Root({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <title>Said The Whale — Record Archive</title>
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: frameCss }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const frameCss = `
html, body {
  height: 100%;
  margin: 0;
  background-color: #F3ECDD;
}
#root {
  height: 100%;
}
@media (min-width: 480px) {
  html, body {
    background-color: #2C241C;
  }
  body {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  #root {
    width: 390px;
    max-width: 390px;
    height: min(844px, 100vh);
    max-height: 100vh;
    margin: 0 auto;
    overflow: hidden;
    background: #F3ECDD;
    box-shadow: 0 18px 50px rgba(0,0,0,0.45);
    border-radius: 16px;
  }
}
`;
