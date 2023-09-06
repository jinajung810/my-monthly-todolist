import { atom, atomFamily, selectorFamily } from 'recoil';
import { isSameDay } from '../../utils/date';

// 할일 객체의 인터페이스 정의
export interface Todo {
  id: string;
  content: string;
  done: boolean;
  date: Date;
}

// 전체 할일 목록을 관리하는 Atom
export const todoListState = atom<Array<Todo>>({
  key: 'todoListState',
  default: [],
});

// 선택된 날짜를 관리하는 Atom
export const selectedDateState = atom<Date>({
  key: 'selectedDateState',
  default: new Date(),
});

// 선택된 할일 항목을 관리하는 Atom
export const selectedTodoState = atom<Todo | null>({
  key: 'selectedTodoState',
  default: null,
});

// 선택된 날짜에 따라 필터링된 할일 목록을 관리하는 Atom 팩토리
export const filteredTodoListState = atomFamily<Array<Todo>, Date>({
  key: 'filteredTodoListState',
  default: selectorFamily({
    key: 'filteredTodoListState/default',
    get: (selectedDate) => ({ get }) => {
      // 전체 Todo 목록을 가져옴
      const todoList = get(todoListState);

      // 선택된 날짜와 일치하는 할일 항목만 필터링하여 반환
      return todoList.filter(todo => isSameDay(todo.date, selectedDate));
    }
  })
})
