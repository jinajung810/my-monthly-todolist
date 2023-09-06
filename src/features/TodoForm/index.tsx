import React, { useRef, useState } from 'react';
import { useRecoilCallback, useRecoilState, useRecoilValue } from 'recoil'
import { v4 as uuidv4} from 'uuid';
import styled from '@emotion/styled/macro';

import { todoFormModalOpenState } from './atom';
import Modal from '../../components/Modal';
import { selectedDateState, todoListState } from '../TodoList/atom';
import { getSimpleDateFormat } from '../../utils/date';

const TodoFormModal = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  
   // 선택된 날짜 상태
  const selectedDate = useRecoilValue(selectedDateState);

  // 할일 목록 상태
  const todoList = useRecoilValue(todoListState);

  // 할일 입력 상태
  const [todo, setTodo] = useState<string>('');

  // 할일 입력 폼 모달의 열림/닫힘 상태
  const [isOpen, setIsOpen] = useRecoilState(todoFormModalOpenState);

  // 입력 필드 초기화 함수
  const reset = () => {
    setTodo('');
    inputRef.current?.focus();
  }

  // 모달 닫기 함수
  const handleClose = () => setIsOpen(false);

  // Recoil 콜백을 사용하여 새로운 Todo를 추가하는 함수
  const addTodo = useRecoilCallback(({ snapshot, set }) => () => {
    const todoList = snapshot.getLoadable(todoListState).getValue();

    const newTodo = { id: uuidv4(), content: todo, done: false, date: selectedDate };

    set(todoListState, [...todoList, newTodo]);
  }, [todo, selectedDate, todoList]);

  // Enter 키를 누르면 Todo를 추가하고 입력을 초기화하며 모달을 닫는 이벤트 핸들러
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addTodo();
      reset();
      handleClose();
    }
  }

  // 할일 입력 필드 값 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodo(e.target.value);
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <Container>
        <Card>
          <Date>{getSimpleDateFormat(selectedDate)}</Date>
          <InputTodo ref={inputRef} placeholder="새로운 이벤트" onKeyPress={handleKeyPress} value={todo} onChange={handleChange} />
        </Card>
      </Container>
    </Modal>
  )
}

export default TodoFormModal;

const Container = styled.div`
  width: 100vw;
  max-width: 386px;
  padding: 8px;
`;

const Date = styled.small`
  display: block;
  color: #C9C8CC;
`;

const InputTodo = styled.input`
  padding: 16px 24px;
  border: none;
  width: 100%;
  box-sizing: border-box;
  background-color: transparent;
  color: #C9C8CC;
  caret-color: #C9C8CC;
`;

const Card = styled.div`
  width: 100%;
  max-width: 370px;
  border-radius: 16px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  padding: 24px;
  box-sizing: border-box;
  background-color: #19181A;
  ${Date} + ${InputTodo} {
    margin-top: 24px;
  }
;
`;