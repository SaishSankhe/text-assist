import Head from 'next/head';
import { useState } from 'react';
import styles from './index.module.css';
import CopyToClipboard from '@/components/CopyToClipboard';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({ subsets: ['latin'] });

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState([]);
  const [tone, setTone] = useState('');
  const [language, setLanguage] = useState('english');
  const [style, setStyle] = useState('casual');
  const [advanced, setAdvanced] = useState(false);
  const [emoticon, setEmoticon] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();

    const body = {
      prompt,
    };

    if (advanced) {
      body.tone = tone;
      body.emoticon = emoticon;
      body.language = language;
      body.style = style;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.status !== 200) {
        setLoading(false);
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setResult(data.result);
      setLoading(false);
    } catch (error) {
      alert(error.message);
    }
  }

  const onToneChange = (event) => {
    setTone(event.target.value);
  };

  const onLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const onStyleChange = (event) => {
    setStyle(event.target.value);
  };

  return (
    <div>
      <Head>
        <title>Text generator</title>
      </Head>

      <main className={montserrat.className}>
        <h3>Text Assist</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="prompt"
            placeholder="Generate message about..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
          />
          <button type="button" onClick={() => setPrompt('')}>
            Clear
          </button>

          <hr />

          <label htmlFor="advanced">
            <input
              type="checkbox"
              name="advanced"
              id="advanced"
              checked={advanced}
              onChange={() => setAdvanced(!advanced)}
            />
            Advanced options
          </label>

          {advanced && (
            <div>
              <label htmlFor="tone">
                Choose tone of the message
                <br />
                <select
                  name="tone"
                  id="tone"
                  onClick={onToneChange}
                  disabled={!advanced}
                  defaultValue=""
                >
                  <option value="" disabled>
                    -- Choose tone --
                  </option>
                  <option value="neutral">Neutral</option>
                  <option value="happy">Happy</option>
                  <option value="sad">Sad</option>
                  <option value="funny">Funny</option>
                  <option value="romantic">Romantic</option>
                  <option value="regretful">Regretful</option>
                  <option value="sarcastic">Sarcastic</option>
                  <option value="celebratory">Celebratory</option>
                  <option value="polite">Polite</option>
                  <option value="respectfult">Respectful</option>
                </select>
              </label>

              <hr />

              <label htmlFor="emoticon">
                <input
                  type="checkbox"
                  name="emoticon"
                  id="emoticon"
                  checked={emoticon}
                  onChange={() => setEmoticon(!emoticon)}
                  disabled={!advanced}
                />
                Include emojis
              </label>

              <hr />

              <label htmlFor="language">
                Choose language of the message
                <br />
                <select
                  name="language"
                  id="language"
                  onClick={onLanguageChange}
                  disabled={!advanced}
                  defaultValue="english"
                >
                  <option value="english">English</option>
                  <option value="hindi">हिंदी</option>
                  <option value="marathi">मराठी</option>
                </select>
              </label>

              <hr />

              <label htmlFor="style">
                Choose style of the message
                <br />
                <select
                  name="style"
                  id="style"
                  onClick={onStyleChange}
                  disabled={!advanced}
                  defaultValue="casual"
                >
                  <option value="casual">Casual</option>
                  <option value="semi-formal">Semi-formal</option>
                  <option value="formal">Formal</option>
                </select>
              </label>

              <hr />
            </div>
          )}

          <input
            type="submit"
            value={
              loading
                ? 'Generating message...'
                : result.message
                ? 'Regenerate'
                : 'Generate'
            }
          />
        </form>
        <div className={styles.result}>{result.message}</div>
        <div className={styles.result}>{result.error}</div>
        {result.message && <CopyToClipboard copyText={result.message} />}
      </main>
    </div>
  );
}
