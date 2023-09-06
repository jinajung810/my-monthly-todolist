import { atom } from 'recoil';

export const todoFormModalOpenState = atom<boolean>({
  key: 'todoFormModalOpenState',

  // Atom의 초기 상태. 초기에는 Todo 입력 폼 모달이 닫혀있으므로 'false'로 설정.
  default: false 
});
