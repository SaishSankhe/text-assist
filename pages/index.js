import { useState, useRef } from 'react';
import CopyToClipboard from '@/components/CopyToClipboard';
import LinkPreview from '@/components/LinkPreview';
import styled from 'styled-components';
import { Montserrat } from 'next/font/google';

import {
  Button,
  Checkbox,
  Form,
  Input,
  Drawer,
  Select,
  Radio,
  Skeleton,
} from 'antd';
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
  const [isError, setIsError] = useState(false);
  const [tone, setTone] = useState('normal');
  const [language, setLanguage] = useState('english');
  const [style, setStyle] = useState('casual');
  const [emoticon, setEmoticon] = useState(false);
  const [length, setLength] = useState('normal');

  const inputRef = useRef(null);

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
      setIsResult(false);
      setIsError(false);

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
        setIsError(true);
        setIsResult(false);

        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setResult(data.result);
      if (data.result.error) setIsError(true);

      setIsResult(true);
      setLoading(false);
    } catch (error) {
      setIsError(true);
      setIsResult(false);
      setLoading(false);
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
      <LinkPreview>
        <title>Text generator</title>
      </LinkPreview>

      <main className={montserrat.className}>
        <section className="p-4 flex flex-col overflow-scroll">
          <h1 className="text-xl font-bold text-center">Text Assist</h1>
          <div className="message-container flex flex-col flex-1 justify-center">
            {isResult ? (
              <MessageCardDiv className="message-container p-6">
                {result.message}
              </MessageCardDiv>
            ) : loading ? (
              <MessageCardDivSkeleton className="message-container p-6">
                <Skeleton active={loading} title={false} />
              </MessageCardDivSkeleton>
            ) : isError ? (
              <ErrorMessageCardDiv className="message-container p-6">
                Apologies! Something went wrong. Please try once again.
              </ErrorMessageCardDiv>
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

            <CustomDrawer
              title="Advanced options"
              placement="bottom"
              closeIcon={<CloseCircleOutlined />}
              onClose={closeDrawer}
              open={open}
              keyboard={true}
              footer={
                <Button
                  type="default"
                  size="large"
                  onClick={closeDrawer}
                  className="mr-3 apply-btn"
                >
                  Apply
                </Button>
              }
              height={'auto'}
              className="mb-4 mx-4 pb-4"
            >
              <Form layout="vertical">
                <Form.Item label="Message language">
                  <Radio.Group
                    size="large"
                    options={languageOptions}
                    onChange={onLanguageChange}
                    value={language}
                    optionType="button"
                  />
                </Form.Item>

                <Form.Item label="Message style">
                  <Radio.Group
                    size="large"
                    options={styleOptions}
                    onChange={onStyleChange}
                    value={style}
                    optionType="button"
                  />
                </Form.Item>

                <Form.Item label="Message length">
                  <Radio.Group
                    size="large"
                    options={lengthOptions}
                    onChange={onLengthChange}
                    value={length}
                    optionType="button"
                  />
                </Form.Item>

                <LargerFontCheckbox onChange={() => setEmoticon(!emoticon)}>
                  Include emojis
                </LargerFontCheckbox>
              </Form>
            </CustomDrawer>

            <div className="form-card p-6 mt-4 mb-6 w-full">
              <Form
                form={form}
                name="form"
                initialValues={{ remember: true }}
                onFinish={onSubmit}
                autoComplete="off"
                layout="vertical"
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
                    name="prompt"
                    value={prompt}
                    type="text"
                    onChange={(e) => setPrompt(e.target.value)}
                    maxLength={128}
                    size="large"
                    ref={inputRef}
                    suffix={
                      <CloseCircleOutlined
                        className={
                          prompt.length === 0 ? 'icon-hidden' : 'icon-show'
                        }
                        onClick={() => {
                          setPrompt('');
                          form.setFieldsValue({ prompt: '' });
                        }}
                      />
                    }
                  />
                </Form.Item>

                <InputAttachedOptions className="p-4 mb-4">
                  <Form.Item label="Tone of the message" className="mb-4">
                    <Select
                      size="large"
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
                        { value: 'motivational', label: 'Motivational' },
                      ]}
                    />
                  </Form.Item>

                  <SmallButtonSpaceBetween
                    size="large"
                    type="default"
                    onClick={openDrawer}
                  >
                    More options
                    <PlusCircleOutlined />
                  </SmallButtonSpaceBetween>
                </InputAttachedOptions>

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
  background-color: #ef6f6c;
  color: #fffdf9;
`;

const NoMessageCardDiv = styled.div`
  color: #1d5a6e;
  border: dashed 3.5px #ef6f6c;
  border-radius: 2rem 2rem 0.1rem;
`;

const ErrorMessageCardDiv = styled(NoMessageCardDiv)`
  border: dotted 3.5px red;
`;

const CustomInput = styled(Input)`
  border: none;
  font-size: 1rem;
  height: 3.25rem;
  background-color: #fffdf9;
  border-bottom: 1px solid #cae2e4;
  border-radius: 0.5rem 0.5rem 0 0;
`;

const InputAttachedOptions = styled.div`
  background-color: #fffdf9;
  border-radius: 0 0 0.5rem 0.5rem;
  margin-top: -24px;
  color: #1d5a6e;
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
    background-color: #1d5a6e;
    color: #fffdf9;
    border: none;
  }
`;

const SmallButtonSpaceBetween = styled(Button)`
  min-width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: none;

  &.ant-btn-default {
    font-size: 0.85rem;
    border-radius: 0.5rem;
    border: none;
    background-color: #cae2e4;
    color: #1d5a6e;
  }
`;

const CustomDrawer = styled(Drawer)`
  border-radius: 2rem;

  &.ant-drawer-content {
    width: auto;
    background-color: #fffdf9;
  }
`;

const LargerFontCheckbox = styled(Checkbox)`
  font-size: 1rem !important;
`;

const MessageCardDivSkeleton = styled(MessageCardDiv)`
  background-color: #cae2e4;
`;
