import React from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import styled from '@emotion/styled/macro';
import { Todo, selectedTodoState } from './atom';
import { todoStatisticsModalOpenState } from "../TodoStatisticsModal/atom";

interface Props {
  items: Array<Todo>;
}

const MAX_TODO_LIST_LENGTH = 4;

const TodoList = ({ items }:Props) => {
  // 선택된 할일을 가져옴
  const selectedTodo = useRecoilValue(selectedTodoState);

  // 선택된 할일을 설정하는 함수
  const setSelectedTodo = useSetRecoilState(selectedTodoState);

  // 할일 아이템을 클릭할 때 호출되는 핸들러
  const handleClick = (event: React.SyntheticEvent<HTMLLIElement>, todo: Todo) => {
    event.stopPropagation();

    // 선택된 할일을 변경하거나 선택 해제
    setSelectedTodo(selectedTodo?.id === todo.id && selectedTodo.date === todo.date ? null : todo);
  }

  // 통계 모달의 열림 상태를 설정하는 함수
  const setTodoStatisticsModalOpen = useSetRecoilState(todoStatisticsModalOpenState);

  // 통계 모달을 열기 위한 핸들러
  const handleTodoStatisticsModalOpen = (event: React.SyntheticEvent<HTMLLIElement>) => {
    event.stopPropagation();

    setTodoStatisticsModalOpen(true);
  }

  return (
    <Base>
      {
        // 최대 `MAX_TODO_LIST_LENGTH` 개의 할일 아이템을 렌더링
        items.slice(0, MAX_TODO_LIST_LENGTH).map((item, index) => (
          <TodoItem
            key={item.id}
            done={item.done}
            selected={item.date === selectedTodo?.date && item.id === selectedTodo?.id}
            onClick={(event: React.SyntheticEvent<HTMLLIElement>) => handleClick(event, item)}
          >
            {item.content}
          </TodoItem>
        ))
      }
      {
        // 할일 아이템이 `MAX_TODO_LIST_LENGTH` 개를 초과할 경우 "그 외" 아이템 표시
        items.length > MAX_TODO_LIST_LENGTH && (
          <EtcItem onClick={handleTodoStatisticsModalOpen}>{`그 외 ${items.length - MAX_TODO_LIST_LENGTH}개...`}</EtcItem>)
      }
    </Base>
  )
}

export default TodoList;


const TodoItem = styled.li<{ done?: boolean; selected?: boolean; }>`
  max-width: 100px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  background-color: ${({ done, selected }) => selected ? 'rgba(112, 71, 235, 1)' : done ? 'transparent' :  'rgba(112, 71, 235, 0.4)'};
  padding: 2px 4px;
  margin: 0;
  border-radius: 8px;
  font-size: 10px;
  text-decoration: ${({ done }) => done && 'line-through'};
  cursor: pointer;
`;

const EtcItem = styled.li`
  padding: 2px 4px;
  margin: 0;
  font-size: 10px;
  cursor: pointer;
`;

const Base = styled.ul`
  list-style: none;
  margin: 15px 0 0 0;
  padding: 0;
  width: 100%;
  height: 60px;
  ${TodoItem} + ${TodoItem} {
    margin-top: 1px;
  }
`;