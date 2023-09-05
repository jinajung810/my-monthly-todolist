import { atom } from 'recoil';

export const todoFormModalOpenState = atom<boolean>({
  key: 'todoFormModalOpenState',
  default: false
});
