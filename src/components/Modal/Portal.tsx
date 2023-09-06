import React from 'react';
import { createPortal } from 'react-dom';

interface Props {
  // Portal을 렌더링할 외부 DOM 요소를 선택하기 위한 CSS 선택자
  selector?: string;  
  // Portal 내부에 렌더링할 자식 컴포넌트
  children?: React.ReactNode | React.ReactNode[];  
}

const Portal = ({ children, selector }:Props) => {
  // 지정된 선택자에 해당하는 DOM 요소 찾기
  const rootElement = selector && document.querySelector(selector);

  return (
    <>
      {/* 만약 지정된 선택자에 해당하는 DOM 요소가 존재하면, 
        createPortal 함수를 사용하여 자식 컴포넌트를 해당 DOM 요소로 렌더링,
        그렇지 않으면, 자식 컴포넌트를 그대로 렌더링 */}
      {rootElement ? createPortal(children, rootElement) : children}
    </>
  );
}

export default Portal;
