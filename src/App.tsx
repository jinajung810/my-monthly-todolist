import React from 'react';
import { Global, css } from '@emotion/react';
import styled from '@emotion/styled/macro';
import { RecoilRoot } from 'recoil';

import Calendar from './features/Calendar';
import TodoFormModal from './features/TodoFormModal';
import TodoStatisticsModal from './features/TodoStatisticsModal';

const globalStyle = css`
  html, body {
    background-color: #19181A;
    margin: 0;
    font-family: sans-serif, serif, "Apple SD Gothic Neo";
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  padding: 24px;
`;

const App: React.FC = () => (
  <RecoilRoot>
    <Global styles={globalStyle} />
    <Container>
      {/** Calendar */}
      <Calendar />
    </Container>
    {/** Modal */}
    <TodoFormModal />
    <TodoStatisticsModal />
  </RecoilRoot>
)

export default App;
