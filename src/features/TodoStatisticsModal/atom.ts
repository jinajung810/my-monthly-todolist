import { atom, atomFamily, selectorFamily } from 'recoil';
import { filteredTodoListState } from '../TodoList/atom';

// 통계 모달의 열림 상태를 관리하는 Atom
export const todoStatisticsModalOpenState = atom<boolean>({
  key: 'todoStatisticsModalOpenState',
  default: false
});

// 선택된 날짜에 따른 통계 정보를 관리하는 Atom 팩토리
export const todoStatisticsState = atomFamily<{ total: number, done: number }, Date>({
  key: 'todoStatisticsState',
  default: selectorFamily({
    key: 'todoStatisticsState/default',
    get: (selectedDate) => ({ get }) => {
      // 선택된 날짜에 따라 필터링된 할일 목록을 가져옴
      const todoList = get(filteredTodoListState(selectedDate));

      // 통계 정보를 계산하여 반환
      return {
        // 전체 할일 항목의 수
        total: todoList.length,
        // 완료된 Todo 항목의 수 (0 이상)
        done: todoList.filter(todo => todo.done).length || 0
      }
    }
  })
});
