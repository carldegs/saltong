import { ColorModeScript } from '@chakra-ui/color-mode';
import NextDocument, { Html, Head, Main, NextScript } from 'next/document';

import { DOMAIN } from '../constants';
import theme from '../theme';

export default class Document extends NextDocument {
  render(): JSX.Element {
    return (
      <Html lang="en">
        <Head>
          <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon" href="/logo-192.png" />
          <link
            href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&display=swap"
            rel="stylesheet"
          />

          <meta name="theme-color" content="#38a169" />
          <meta name="apple-mobile-web-app-status-bar" content="#38a169" />
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          
            gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
          `,
            }}
          />
          <meta property="og:url" content={DOMAIN} />
          <meta property="og:title" content="Saltong" />
          <meta property="og:description" content="A Filipino Wordle Clone" />
          <meta name="description" content="A Filipino Wordle Clone" />
        </Head>
        <body>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
