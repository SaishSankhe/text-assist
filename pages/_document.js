import { Html, Head, Main, NextScript } from 'next/document';
import LinkPreview from '@/components/LinkPreview';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>Text Assist</title>
      </Head>
      <LinkPreview />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
