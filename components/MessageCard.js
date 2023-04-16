import styled from 'styled-components';
import { Skeleton } from 'antd';

export default function MessageCard({ state, message }) {
  return (
    <MessageCardDiv className="message-container p-6" state={state}>
      {state === 'loading' ? <Skeleton active title={false} /> : message}
    </MessageCardDiv>
  );
}

const MessageCardDiv = styled.div`
  border-radius: 2rem 2rem 0.1rem;
  background-color: #b4e4c4;
  color: #1d5a6e;
  font-weight: 500;
  line-height: 1.6rem;

  ${(props) =>
    props.state === 'error' &&
    `
      border: dashed 3.5px #EF6F6C;
      background-color: transparent;
  `}

  ${(props) =>
    props.state === 'empty' &&
    `
      border: dashed 2px #EF6F6C;
      background-color: transparent;
      opacity: 60%;
  `}
`;
