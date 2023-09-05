import React from 'react';
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from '@emotion/styled/macro';

import TodoList from '../TodoList';

import { filteredTodoListState, selectedDateState } from '../TodoList/atom';
import { isSameDay } from '../../utils/date';

import { todoStatisticsModalOpenState } from '../TodoStatisticsModal/atom';

interface Props {
  date: Date;
}

const CalendarDay: React.FC<Props> = ({ date }) => {
  const today = new Date();

  const selectedDate = useRecoilValue(selectedDateState);
  const todoList = useRecoilValue(filteredTodoListState(date));

  const setSelectedDate = useSetRecoilState(selectedDateState);

  const setTodoStatisticsModalOpen = useSetRecoilState(todoStatisticsModalOpenState);



  const handleDateSelect = (d: number) => {
    setSelectedDate(new Date(selectedDate.setDate(d)));
  }

  const handleTodoStatisticsModalOpen = (event: React.SyntheticEvent<HTMLDivElement>) => {
    event.stopPropagation();

    setTodoStatisticsModalOpen(true);
  }

  return (
    <TableData
      key={`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`}
      align="center"
      onClick={() => handleDateSelect(date.getDate())}
      onDoubleClick={handleTodoStatisticsModalOpen}
    >
      <Container>
        <DisplayDate
          isSelected={isSameDay(selectedDate, date)}
          isToday={isSameDay(date, today)}
          onClick={() => handleDateSelect(date.getDate())}
        >
          {date.getDate()}
        </DisplayDate>
        <TodoList
          items={todoList}
        />
      </Container>
    </TableData>
  )
}

export default CalendarDay;

const TableData = styled.td`
  text-align: center;
  color: #C9C8CC;
  padding: 8px;
  position: relative;
  background-color: rgba(255, 255, 255, .1);
`;

const DisplayDate = styled.div<{ isToday?: boolean; isSelected?: boolean; }>`
  color: ${({ isToday }) => isToday && '#F8F7FA'};
  background-color: ${({ isToday, isSelected }) => isSelected ? '#7047EB' : isToday ? '#313133' : ''};
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  align-self: flex-end;
  position: absolute;
  top: 5px;
  left: 5px;
  width: 26px;
  height: 26px;
  cursor: pointer;
`;

const Container = styled.div``;