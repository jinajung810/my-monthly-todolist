import { useRef, useState } from 'react'
import { useRecoilCallback, useRecoilState, useRecoilValue } from 'recoil'
import { v4 as uuidv4} from 'uuid';
import { HiOutlineTrash } from 'react-icons/hi';
import { BsPencil } from 'react-icons/bs';
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';
import styled from '@emotion/styled/macro';
import { todoStatisticsModalOpenState, todoStatisticsState } from './atom';
import Modal from '../../components/Modal';
import { filteredTodoListState, selectedDateState, todoListState } from '../TodoList/atom';
import { getSimpleDateFormat } from '../../utils/date';

  
const TodoStatisticsModal = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [todo, setTodo] = useState<string>('');

  // 수정 중인 할 일의 ID를 저장
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null); 
  const [todoList, setTodoList] = useRecoilState(todoListState);
  const selectedDate = useRecoilValue(selectedDateState);
  const [isOpen, setIsOpen] = useRecoilState(todoStatisticsModalOpenState);

  const filteredTodoList = useRecoilValue(filteredTodoListState(selectedDate));
  const statistics = useRecoilValue(todoStatisticsState(selectedDate));

  // 모달을 닫는 함수
  const handleClose = () => setIsOpen(false);

  // 할 일 삭제 함수
  const removeTodo = (id: string): void => {
    setTodoList(todoList.filter(todo => todo.id !== id));
  }

  // 입력된 할 일을 추가하는 함수
  const addTodo = useRecoilCallback(({ snapshot, set }) => () => {
    const todoList = snapshot.getLoadable(todoListState).getValue();
    const newTodo = { id: uuidv4(), content: todo, done: false, date: selectedDate };
    set(todoListState, [...todoList, newTodo]);
    reset();
  }, [todo, selectedDate]);

  const reset = () => {
    setTodo('');
    inputRef.current?.focus();
  }

  // EditMode 상태를 추가하고 초기값을 false로 설정합니다.
  const [editMode, setEditMode] = useState<boolean>(false);

  // 수정 버튼을 클릭하여 할 일 수정 모드를 시작
  const startEditTodo = (id: string) => {
    setEditingTodoId(id);
    const todoToEdit = todoList.find(todo => todo.id === id);
    if (todoToEdit) {
      setTodo(todoToEdit.content);
    } 
    // EditMode를 true로 설정하여 수정 모드로 전환합니다.
    setEditMode(true);
  }

  // 수정된 할 일을 저장
  const saveEditedTodo = () => {
    if (editingTodoId) {
      const updatedTodoList = todoList.map(todoItem => {
        if (todoItem.id === editingTodoId) {
          return { ...todoItem, content: todo };
        }
        return todoItem;
      });
      setTodoList(updatedTodoList);
      setEditingTodoId(null);
      reset();
    }
    setEditMode(false); // 수정 모드 종료
  }
  // 수정 중인 할 일 입력 필드에서 엔터 키를 누를 때 호출되는 함수
  const handleEditKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      saveEditedTodo(); // 엔터 키를 누를 때 수정된 내용을 저장
    }
  }
  // 수정 취소
  const cancelEditTodo = () => {
    setEditingTodoId(null);
    reset();
    setEditMode(false); // 수정 모드 종료
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (editingTodoId) {
        // 수정 중인 할 일이 있다면 수정 완료 처리
        saveEditedTodo();
      } else {
        addTodo();
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodo(e.target.value);
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <Container>
        <Card>
          <Date>{getSimpleDateFormat(selectedDate)}</Date>
          <Statistics>할 일 {statistics.total - statistics.done}개 남음</Statistics>
          <AddTodo
            ref={inputRef}
            onKeyPress={handleKeyPress}
            value={editMode ? '' : todo} // EditMode일 때는 빈 값, 그 외에는 todo 값을 표시
            onChange={handleChange}
          />
          <TodoList>
            {filteredTodoList?.map(todoItem => (
              <TodoItem key={todoItem.id}>
                {editingTodoId === todoItem.id ? (
                  <>
                    <EditMode
                      type="text"
                      value={todo}
                      onChange={handleChange}
                      onKeyPress={handleEditKeyPress} // 엔터 키 이벤트 처리를 위한 이벤트 핸들러 추가
                      autoFocus // 수정 버튼을 누르면 자동으로 input에 포커스가 가도록 설정
                    />
                    <TodoActionEdit onClick={saveEditedTodo}>
                      <AiOutlineCheck size='15'/>
                    </TodoActionEdit>
                    <TodoActionEdit onClick={cancelEditTodo}>
                      <AiOutlineClose size='15' />
                    </TodoActionEdit>
                  </>
                ) : (
                  <>
                    <Content>{todoItem.content}</Content>
                    <TodoActions>
                      <TodoActionEdit onClick={() => startEditTodo(todoItem.id)}>
                        <BsPencil size='15' />
                      </TodoActionEdit>
                      <TodoActionDelete onClick={() => removeTodo(todoItem.id)}>
                        <HiOutlineTrash size='18' />
                      </TodoActionDelete>
                    </TodoActions>
                  </>
                )}
              </TodoItem>
            ))}
          </TodoList>
        </Card>
      </Container>
    </Modal>
  );
}

export default TodoStatisticsModal;

const Container = styled.div`
  width: 100vw;
  max-width: 390px;
  // padding: 8px;
`;

const Date = styled.small`
  display: block;
  color: #313133;
`;

const Statistics = styled.p`
  color: #3868d9;
  font-size: 16px;
  font-weight: bold;
`;

const AddTodo = styled.input`
  border: none;
  outline: none;
  background: none;
  width:100%;
  border-bottom: 1px solid #fff;
  color: #313133;
  caret-color: #313133;
  font-size: 15px;
  padding: 5px 5px;
  box-sizing: border-box;
  margin-bottom: 20px;
`

const TodoItem = styled.li`
  width: 100%;
  display: flex;
  color: #313133;
  align-items: center;
  border-radius: 8px;
`;

const EditMode = styled.input`
  border: none;
  outline: none;
  background: none;
  width:100%;
  color: #313133;
  caret-color: #7047EB;
  font-size: 15px;
  padding: 2px 0px;
  box-sizing: border-box;
  border-bottom: 1px solid #fff;
`
const Content = styled.span`
  flex: 1 0 83%;
`;

const TodoActions = styled.span`
  flex: 1 0 15%;
  display: flex;
`;

const TodoActionEdit = styled.button`
border: none;
background-color: transparent;
color: #7047EB;
cursor: pointer;
`

const TodoActionDelete = styled.button`
  border: none;
  background-color: transparent;
  color:#ff6b6b;
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
  max-width: 390px;
  border-radius: 16px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  padding: 24px;
  box-sizing: border-box;
  background-color: #C9C8CC;
  ${Date} + ${TodoList} {
    margin-top: 24px;
  }
;
`;