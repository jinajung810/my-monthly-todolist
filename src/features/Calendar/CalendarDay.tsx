import React from 'react';
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from '@emotion/styled/macro';
import TodoList from '../TodoList';
import { filteredTodoListState, selectedDateState } from '../TodoList/atom';
import { todoStatisticsModalOpenState } from '../TodoStatisticsModal/atom';
import { isSameDay } from '../../utils/date';


interface Props {
  date: Date;
}

const CalendarDay = ({ date }:Props) => {
  // 현재 날짜 가져오기
  const today = new Date();

  // 선택된 날짜 상태
  const selectedDate = useRecoilValue(selectedDateState);

  // 선택된 날짜를 설정하는 함수
  const setSelectedDate = useSetRecoilState(selectedDateState);

  // 선택된 날짜 변경 핸들러
  const handleDateSelect = (d: number) => {
     // 선택된 날짜 업데이트
    setSelectedDate(new Date(selectedDate.setDate(d)));
  }

  // 날짜에 따른 필터링된 Todo 목록 상태
  const todoList = useRecoilValue(filteredTodoListState(date));

  // 통계 모달 열기 함수 
  const setTodoStatisticsModalOpen = useSetRecoilState(todoStatisticsModalOpenState);

  // 통계 모달 열기 핸들러
  const handleTodoStatisticsModalOpen = (event: React.SyntheticEvent<HTMLDivElement>) => {
    // 이벤트 버블링 방지
    event.stopPropagation();

    // 통계 모달 열기
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
  
  border: 1px solid rgba(255, 255, 255, .2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Container = styled.div``;

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