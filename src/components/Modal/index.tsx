import React from 'react';
import styled from "@emotion/styled/macro";
import './modal.css';

import Portal from "./Portal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode | React.ReactNode[];
}

const Modal: React.FC<Props> = ({ children, onClose, isOpen }) => (
  <>
    {
      isOpen && (
        <Portal selector="#modal-root">
          <Overlay>
            <Dim onClick={onClose} />
            <Container>{children}</Container>
          </Overlay>
        </Portal>
      )
    }
  </>
)

export default Modal;

const Overlay = styled.div`
  position: fixed;
  z-index: 99;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Dim = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
`;

const Container = styled.div`
  max-width: 456px;
  position: relative;
  width: 100%;
`;