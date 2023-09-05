import React from 'react';
import { createPortal } from 'react-dom';

interface Props {
  selector?: string;
  children?: React.ReactNode | React.ReactNode[];
}

const Portal: React.FC<Props> = ({ children, selector }) => {
  const rootElement = selector && document.querySelector(selector);

  return (
    <>
      {rootElement ? createPortal(children, rootElement) : children}
    </>
  );
}

export default Portal;
