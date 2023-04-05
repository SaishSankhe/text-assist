import Head from 'next/head';
import { useState } from 'react';
import styles from './index.module.css';
import CopyToClipboard from '@/components/CopyToClipboard';
import { Montserrat } from 'next/font/google';

import { Button, Checkbox, Form, Input, Drawer, Select, Radio } from 'antd';
import { CloseCircleOutlined, BulbOutlined } from '@ant-design/icons';

const montserrat = Montserrat({ subsets: ['latin'] });

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState([]);
  const [isResult, setIsResult] = useState(false);
  const [tone, setTone] = useState('normal');
  const [language, setLanguage] = useState('english');
  const [style, setStyle] = useState('casual');
  const [emoticon, setEmoticon] = useState(false);

  // drawer
  const [open, setOpen] = useState(false);

  // form
  const [form] = Form.useForm();

  const languageOptions = [
    { value: 'english', label: 'English' },
    { value: 'hindi', label: 'Hindi' },
    { value: 'marathi', label: 'Marathi' },
  ];

  const styleOptions = [
    { value: 'casual', label: 'Casual' },
    { value: 'semi-formal', label: 'Semi-formal' },
    { value: 'formal', label: 'Formal' },
  ];

  async function onSubmit(values) {
    const { prompt } = values;

    const body = {
      prompt,
      tone,
      emoticon,
      language,
      style,
    };

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
      setIsResult(true);
      setLoading(false);
    } catch (error) {
      alert(error.message);
    }
  }

  const onToneChange = (value) => {
    setTone(value);
  };

  const onLanguageChange = ({ target: { value } }) => {
    setLanguage(value);
  };

  const onStyleChange = ({ target: { value } }) => {
    setStyle(value);
  };

  return (
    <>
      <Head>
        <title>Text generator</title>
      </Head>

      <main className={montserrat.className}>
        <section className="p-4 flex flex-col min-h-screen">
          <h1 className="text-xl font-bold text-center">Text Assist</h1>

          <div className="content flex flex-col min-h-full h-full flex-1 justify-between">
            <div className="message-container">
              {isResult ? (
                <>
                  <div className={styles.result}>{result.message}</div>
                  <div className={styles.result}>{result.error}</div>
                  {result.message && (
                    <CopyToClipboard copyText={result.message} />
                  )}
                </>
              ) : (
                <div className="no-result">
                  <p>No message genereated yet.</p>
                </div>
              )}
            </div>

            <div className="form-container">
              <Button type="default" onClick={() => setOpen(true)}>
                Advanced options
              </Button>

              <Drawer
                title="Advanced options"
                placement="bottom"
                closeIcon={<CloseCircleOutlined />}
                onClose={() => setOpen(false)}
                open={open}
                keyboard={true}
                footer={<Button type="default">Apply</Button>}
                height={'auto'}
              >
                <Form layout="vertical" form={form}>
                  <Form.Item label="Tone of the message">
                    <Select
                      defaultValue="Normal"
                      onChange={onToneChange}
                      options={[
                        { value: 'normal', label: 'Normal' },
                        { value: 'happy', label: 'Happy' },
                        { value: 'sad', label: 'Sad' },
                        { value: 'funny', label: 'Funny' },
                        { value: 'romantic', label: 'Romantic' },
                        { value: 'regretful', label: 'Regretful' },
                        { value: 'sarcastic', label: 'Sarcastic' },
                        { value: 'celebratory', label: 'Celebratory' },
                        { value: 'polite', label: 'Polite' },
                        { value: 'respectful', label: 'Respectful' },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item label="Message language">
                    <Radio.Group
                      options={languageOptions}
                      onChange={onLanguageChange}
                      value={language}
                      optionType="button"
                    />
                  </Form.Item>
                  <Form.Item label="Message style">
                    <Radio.Group
                      options={styleOptions}
                      onChange={onStyleChange}
                      value={style}
                      optionType="button"
                    />
                  </Form.Item>
                  <Checkbox onChange={() => setEmoticon(true)}>
                    Include emojis
                  </Checkbox>
                </Form>
              </Drawer>
              <Form
                form={form}
                name="form"
                initialValues={{ remember: true }}
                onFinish={onSubmit}
                autoComplete="off"
              >
                <Form.Item
                  name="prompt"
                  rules={[{ required: true, message: 'Please enter a prompt' }]}
                >
                  <Input
                    placeholder="Generate message about..."
                    value={prompt}
                    type="text"
                    onChange={(e) => setPrompt(e.target.value)}
                    maxLength={128}
                    suffix={
                      <CloseCircleOutlined
                        className={
                          prompt.length === 0 ? 'icon-hidden' : 'icon-show'
                        }
                        onClick={() => {
                          setPrompt('');
                          form.resetFields(['prompt']);
                        }}
                      />
                    }
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="default"
                    htmlType="submit"
                    loading={loading}
                    disabled={loading}
                    icon={<BulbOutlined />}
                  >
                    {loading ? 'Generating...' : 'Generate'}
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
