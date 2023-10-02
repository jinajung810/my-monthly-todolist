import React from 'react';
import styled from "@emotion/styled/macro";
import './modal.css';

import Portal from "./Portal";

interface Props {
  isOpen: boolean;  // 모달이 열린 상태인지 여부 
  onClose: () => void; // 모달을 닫을 때 호출할 함수 
  children?: React.ReactNode | React.ReactNode[]; // 모달 내부에 표시할 자식 컴포넌트 
}

const Modal = ({ children, onClose, isOpen }: Props) => (
  <>
    {
      isOpen && (  //isOpen이 true일 때만 모달을 렌더링 
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

const Overlay = styled.div` //블러 배경효과 
  position: fixed;
  z-index: 10;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Dim = styled.div` // 배경을 클릭하면 모달이 닫힘
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
`;

const Container = styled.div` // 모달 내용을 포함하는 컨테이너 
  max-width: 390px;
  position: relative;
  width: 100%;
`;