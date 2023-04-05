import { useState } from 'react';

import { Button } from 'antd';
import { CopyOutlined } from '@ant-design/icons';

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
    <Button type="default" onClick={handleCopyClick} icon={<CopyOutlined />}>
      {isCopied ? 'Copied!' : 'Copy'}
    </Button>
  );
}
