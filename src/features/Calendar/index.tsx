import { useEffect, useMemo } from 'react';
import { useRecoilCallback, useRecoilValue, useSetRecoilState } from 'recoil';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi'
import styled from '@emotion/styled/macro';
import CalendarDay from "./CalendarDay";
import { selectedDateState, selectedTodoState, todoListState } from '../TodoList/atom';


const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

const Calendar = () => {
  // 선택된 날짜 상태
  const selectedDate = useRecoilValue(selectedDateState);

  // 선택된 날짜 설정 함수
  const setSelectedDate = useSetRecoilState(selectedDateState);

  // 선택된 날짜의 연도, 월, 첫날, 마지막날 계산
  const { year, month, firstDay, lastDay } = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const date = selectedDate.getDate();

    return ({
      year,
      month,
      date,
      firstDay: new Date(year, month, 1),
      lastDay: new Date(year, month + 1, 0)
    })
  }, [selectedDate]);

  // 이전 월로 이동하는 핸들러
  const handleGoTo = (d: Date) => {
    setSelectedDate(d);
  }

  // 날짜 테이블에서 날짜 전에 빈 칸을 채우는 함수
  const pad = () => [...Array(firstDay.getDay()).keys()].map((p: number) => <TableData key={`pad_${p}`} />);

  // 날짜 범위를 생성하는 함수
  const range = () => [...Array(lastDay.getDate()).keys()].map((d: number) => (
    <CalendarDay key={d} date={new Date(year, month, d + 1)} />
  ));

  // 달력 날짜를 렌더링하는 함수
  const renderDays = () => {
    const items = [...pad(), ...range()];

    const weeks = Math.ceil(items.length / 7);

    return [...Array(weeks).keys()].map((week: number) => (
      <tr key={`week_${week}`}>
        {items.slice(week * 7, week * 7 + 7)}
      </tr>
    ));
  }

  // 투두 목록 상태
  const todoList = useRecoilValue(todoListState);

  // 선택된 Todo를 삭제하는 Recoil 콜백
  const removeTodo = useRecoilCallback(({ snapshot, set }) => () => {
    const todoList = snapshot.getLoadable(todoListState).getValue();
    const selectedTodo = snapshot.getLoadable(selectedTodoState).getValue();

    set(todoListState, todoList.filter(todo => todo.id !== selectedTodo?.id));
  }, [selectedDate, todoList]);

  // 백스페이스 키를 눌렀을 때 선택된 Todo 삭제
  useEffect(() => {
    const onBackspaceKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Backspace') {
        removeTodo();
      }
    };

    window.addEventListener('keydown', onBackspaceKeyDown);

    return () => {
      window.removeEventListener('keydown', onBackspaceKeyDown);
    }
  }, [removeTodo]);

  return (
    <Base>
      <Header>
        <ButtonContainer>
          {/* 이전 월로 이동하는 버튼 */}
          <ArrowButton pos="left" onClick={() => handleGoTo(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)))}>
            <BiChevronLeft />
          </ArrowButton>

          {/* 다음 월로 이동하는 버튼 */}
          <Title>{`${MONTHS[month]} ${year}`}</Title>

          {/* 다음 월로 이동하는 버튼 */}
          <ArrowButton pos="right" onClick={() => handleGoTo(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)))}>
            <BiChevronRight />
          </ArrowButton>
        </ButtonContainer>
      </Header>

      {/* 달력 테이블 */}
      <Table>
        <TableHeader>
          <tr>
            {
              DAYS.map((day, index) => (
                <th key={day} align="center">{day}</th>
              ))
            }
          </tr>
        </TableHeader>
        <TableBody>
          {renderDays()}
        </TableBody>
      </Table>
    </Base>
  )
}

export default Calendar;

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h1`
  margin: 0;
  padding: 8px 24px;
  font-size: 24px;
  font-weight: normal;
  text-align: center;
  color: #F8F7FA;
`;

const ArrowButton = styled.button<{ pos: 'left' | 'right' }>`
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  background-color: transparent;
  font-size: 18px;
  cursor: pointer;
  color: #F8F7FA;
`;

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  height: 100%;
  border-spacing: 0;
`;

const TableHeader = styled.thead`
  padding-block: 12px;
  > tr {
    > th {
      padding-block: 12px;
      font-weight: normal;
      color: #F8F7FA;
      // background-color: rgba(255, 255, 255, .1);
    }
  }
`;

const TableBody = styled.tbody`
  > tr {
    > td {
      width: 128px;
      height: 128px;
      box-sizing: border-box;
    }
  }
`;

const Base = styled.div`
  min-width: 900px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 16px;
  padding: 24px;
  height: 100%;
  box-sizing: border-box;
  background-color: #28272A;
  ${Header} + ${Table} {
    margin-top: 36px;
  }
`;

const TableData = styled.td`
  text-align: center;
  color: #C9C8CC;
  padding: 8px;
  position: relative;
`;