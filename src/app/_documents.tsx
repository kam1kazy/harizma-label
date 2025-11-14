import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="ru">
      <Head>
        <link
          rel="icon"
          type="image/png"
          href="/images/icons/favicon/favicon-96x96.png"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/images/icons/favicon/favicon.svg" />
        <link rel="shortcut icon" href="/images/icons/favicon/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/images/icons/favicon/apple-touch-icon.png"
        />
        <meta name="apple-mobile-web-app-title" content="HARIZMA" />
        <link rel="manifest" href="/images/icons/favicon/site.webmanifest" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
