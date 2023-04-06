import Head from 'next/head';
import { useState } from 'react';
import CopyToClipboard from '@/components/CopyToClipboard';
import styled from 'styled-components';
import { Montserrat } from 'next/font/google';

import { Button, Checkbox, Form, Input, Drawer, Select, Radio } from 'antd';
import {
  CloseCircleOutlined,
  BulbOutlined,
  PlusCircleOutlined,
  BulbFilled,
} from '@ant-design/icons';

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
  const [length, setLength] = useState('normal');

  // drawer
  const [open, setOpen] = useState(false);

  // form
  const [form] = Form.useForm();

  const openDrawer = () => {
    setOpen(true);
  };

  const closeDrawer = () => {
    setOpen(false);
  };

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

  const lengthOptions = [
    { value: 'short', label: 'Short' },
    { value: 'normal', label: 'Normal' },
    { value: 'long', label: 'Long' },
  ];

  async function onSubmit(values) {
    const { prompt } = values;

    const body = {
      prompt,
      tone,
      emoticon,
      language,
      style,
      length,
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

  const onLengthChange = ({ target: { value } }) => {
    setLength(value);
  };

  return (
    <>
      <Head>
        <title>Text generator</title>
      </Head>

      <main className={montserrat.className}>
        <section className="p-4 flex flex-col">
          <h1 className="text-xl font-bold text-center">Text Assist</h1>
          <div className="content flex flex-col flex-1 justify-center">
            {isResult ? (
              <MessageCardDiv className="message-container p-6">
                {result.message}
                {result.error}
              </MessageCardDiv>
            ) : (
              <NoMessageCardDiv className="message-container border border-dashed border-1 border-red-500 p-6">
                No message genereated yet.
                <br />
                Try entering a prompt in the input box below and click on
                generate.
              </NoMessageCardDiv>
            )}
          </div>

          <div className="fixed-container-bottom fixed bottom-0 w-full left-0 right-0 px-4 flex flex-col items-center">
            {result.message && <CopyToClipboard copyText={result.message} />}

            <FullWidthButtonSpaceBetween
              type="default"
              onClick={openDrawer}
              size="large"
            >
              Advanced options
              <PlusCircleOutlined />
            </FullWidthButtonSpaceBetween>

            <Drawer
              title="Advanced options"
              placement="bottom"
              closeIcon={<CloseCircleOutlined />}
              onClose={closeDrawer}
              open={open}
              keyboard={true}
              footer={
                <Button type="default" onClick={closeDrawer}>
                  Apply
                </Button>
              }
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

                <Form.Item label="Message length">
                  <Radio.Group
                    options={lengthOptions}
                    onChange={onLengthChange}
                    value={length}
                    optionType="button"
                  />
                </Form.Item>

                <Checkbox onChange={() => setEmoticon(true)}>
                  Include emojis
                </Checkbox>
              </Form>
            </Drawer>

            <div className="form-card p-6 my-6 w-full">
              <Form
                form={form}
                name="form"
                initialValues={{ remember: true }}
                onFinish={onSubmit}
                autoComplete="off"
              >
                <Form.Item
                  name="prompt"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter atleat one word as a prompt',
                    },
                  ]}
                >
                  <CustomInput
                    placeholder="Generate message about..."
                    value={prompt}
                    type="text"
                    onChange={(e) => setPrompt(e.target.value)}
                    maxLength={128}
                    size="large"
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

                <Form.Item className="mb-0">
                  <FullWidthButton
                    type="default"
                    htmlType="submit"
                    loading={loading}
                    disabled={loading}
                    size="large"
                  >
                    {loading ? 'Generating' : 'Generate'}
                    {loading ? <BulbFilled /> : <BulbOutlined />}
                  </FullWidthButton>
                </Form.Item>
              </Form>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

const MessageCardDiv = styled.div`
  border-radius: 2rem 2rem 0.1rem;
  background-color: #efefef;
`;

const NoMessageCardDiv = styled.div`
  color: #979797;
  border: dashed 3.5px #efefef;
  border-radius: 2rem 2rem 0.1rem;
`;

const CustomInput = styled(Input)`
  border: none;
  font-size: 1rem;
  height: 3.25rem;
  border: 1px solid #eaeaea;
`;

const FullWidthButton = styled(Button)`
  min-width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: none;

  &.ant-btn-default {
    font-size: 1rem;
    border-radius: 0.5rem;
    height: 3.25rem;
    background-color: #282828;
    color: #ffffff;
    border: none;
  }
`;

const FullWidthButtonSpaceBetween = styled(FullWidthButton)`
  justify-content: space-between;
  box-shadow: none;

  &.ant-btn-default {
    border-radius: 5rem;
    background-color: #f9f9f9;
    color: #282828;
    padding: 0 24px;
  }
`;
