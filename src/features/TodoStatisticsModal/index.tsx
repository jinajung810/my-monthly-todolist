import { useRef, useState } from 'react'
import { useRecoilCallback, useRecoilState, useRecoilValue } from 'recoil'
import { v4 as uuidv4} from 'uuid';
import { HiOutlineTrash } from 'react-icons/hi';
import styled from '@emotion/styled/macro';
import { todoStatisticsModalOpenState, todoStatisticsState } from './atom';
import Modal from '../../components/Modal';
import { filteredTodoListState, selectedDateState, todoListState } from '../TodoList/atom';
import { getSimpleDateFormat } from '../../utils/date';

  
  const TodoStatisticsModal= () => {

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [todo, setTodo] = useState<string>('');
  const [todoList, setTodoList] = useRecoilState(todoListState);

  const selectedDate = useRecoilValue(selectedDateState);
  const [isOpen, setIsOpen] = useRecoilState(todoStatisticsModalOpenState);

  const reset = () => {
    setTodo('');
    inputRef.current?.focus();
  }

  const addTodo = useRecoilCallback(({ snapshot, set }) => () => {
    const todoList = snapshot.getLoadable(todoListState).getValue();

    const newTodo = { id: uuidv4(), content: todo, done: false, date: selectedDate };

    set(todoListState, [...todoList, newTodo]);
  }, [todo, selectedDate, todoList]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addTodo();
      reset();
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodo(e.target.value);
  }

  

  const filteredTodoList = useRecoilValue(filteredTodoListState(selectedDate));
  const statistics = useRecoilValue(todoStatisticsState(selectedDate));

  
  // 모달을 닫는 함수
  const handleClose = () => setIsOpen(false);

  // 할 일 삭제 함수
  const removeTodo = (id: string): void => {
    setTodoList(todoList.filter(todo => todo.id !== id));
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <Container>
        <Card>
          <Date>{getSimpleDateFormat(selectedDate)}</Date>
          <Statistics>할 일 {statistics.total - statistics.done}개 남음</Statistics>
          <AddTodo ref={inputRef} onKeyPress={handleKeyPress} value={todo} onChange={handleChange}/>
          <TodoList>
            {
              filteredTodoList?.map(todo => (
                <TodoItem key={todo.id}>
                  <Content>{todo.content}</Content>
                  {/* 할 일 삭제 버튼 */}
                  <TodoActions>
                    <TodoActionButton secondary onClick={() => removeTodo(todo.id)}>
                      <HiOutlineTrash />
                    </TodoActionButton>
                  </TodoActions>
                </TodoItem>
              ))
            }
          </TodoList>
        </Card>
      </Container>
    </Modal>
  )
}

export default TodoStatisticsModal;

const Container = styled.div`
  width: 100vw;
  max-width: 386px;
  padding: 8px;
`;

const Date = styled.small`
  display: block;
  color: #C9C8CC;
`;

const Statistics = styled.p`
  color: #7047EB;
  font-size: 16px;
  font-weight: bold;
`;

const AddTodo = styled.input`
  border: none;
  outline: none;
  background: none;
  width:100%;
  border-bottom: 1px solid #fff;
  color: #C9C8CC;
  caret-color: #C9C8CC;
  font-size: 15px;
  padding: 5px 5px;
  box-sizing: border-box;
  margin-bottom: 20px;
`

const TodoItem = styled.li`
  width: 100%;
  display: flex;
  color: #C9C8CC;
  align-items: center;
  border-radius: 8px;
`;

const Content = styled.span`
  flex: 1 0 95%;
`;

const TodoActions = styled.span`
  flex: 1 0 5%;
`;

const TodoActionButton = styled.button<{ secondary?: boolean; }>`
  border: none;
  background-color: transparent;
  color: ${({ secondary }) => secondary && '#ff6b6b'};
  cursor: pointer;
`;

const TodoList = styled.ul`
  list-style: circle;
  margin: 0;
  padding: 0;
  width: 100%;
  ${TodoItem} + ${TodoItem} {
    margin-top: 8px;
  }
`;

const Card = styled.div`
  width: 100%;
  max-width: 370px;
  border-radius: 16px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  padding: 24px;
  box-sizing: border-box;
  background-color: #19181A;
  ${Date} + ${TodoList} {
    margin-top: 24px;
  }
;
`;