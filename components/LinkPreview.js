import Head from 'next/head';

export default function LinkPreview() {
  return (
    <Head>
      <title>Text Assist</title>
      <meta property="og:url" content="text-assist.vercel.app/" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Text Assist" />
      <meta
        name="twitter:card"
        content="Generate text messages for any occassion, using Text Assist"
      />
      <meta
        property="og:description"
        content="Generate text messages for any occassion, using Text Assist"
      />
      <meta property="og:image:width" content="800" />
      <meta property="og:image:height" content="400" />
      <meta property="og:image" content={'preview.jpg'} />
      <meta property="og:image:alt" content="Text Assist app" />
    </Head>
  );
}
