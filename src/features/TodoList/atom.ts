import { atom, atomFamily, selectorFamily } from 'recoil';
import { isSameDay } from '../../utils/date';

export interface Todo {
  id: string;
  content: string;
  done: boolean;
  date: Date;
}

export const todoListState = atom<Array<Todo>>({
  key: 'todoListState',
  default: [],
});

export const selectedDateState = atom<Date>({
  key: 'selectedDateState',
  default: new Date(),
});

export const selectedTodoState = atom<Todo | null>({
  key: 'selectedTodoState',
  default: null,
});

export const filteredTodoListState = atomFamily<Array<Todo>, Date>({
  key: 'filteredTodoListState',
  default: selectorFamily({
    key: 'filteredTodoListState/default',
    get: (selectedDate) => ({ get }) => {
      const todoList = get(todoListState);

      return todoList.filter(todo => isSameDay(todo.date, selectedDate));
    }
  })
})
