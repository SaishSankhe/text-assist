import { useState } from 'react';

import styled from 'styled-components';
import { Button } from 'antd';
import { CopyOutlined, CopyFilled } from '@ant-design/icons';

export default function CopyToClipboard({ copyText }) {
  const [isCopied, setIsCopied] = useState(false);

  async function copyTextToClipboard(text) {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand('copy', true, text);
    }
  }

  const handleCopyClick = () => {
    copyTextToClipboard(copyText)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <CopyButton
      type="default"
      onClick={handleCopyClick}
      className="mb-6 px-6 w-8/12"
    >
      {isCopied ? 'Ready to paste!' : 'Copy message'}
      {isCopied ? <CopyFilled /> : <CopyOutlined />}
    </CopyButton>
  );
}

const CopyButton = styled(Button)`
  border: none;
  box-shadow: none;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;

  &.ant-btn-default {
    font-size: 1rem;
    border-radius: 5rem;
    height: 3.25rem;
    background-color: #282828;
    color: #ffffff;
    border: none;
  }
`;
