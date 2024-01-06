import './styles.css';
import Navbar from './Navbar';
import { Button, Container, List } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import { observer } from 'mobx-react-lite';
import { Outlet, useLocation } from 'react-router-dom';
import HomePage from '../../features/Home/HomePage';

function App() {
  const location = useLocation();
  return (
    location.pathname === '/' ? <HomePage /> : (
      <>

        <Navbar />
        <div style={{ marginTop: '7em' }}>
          <Container>
            <Outlet />
          </Container>
        </div>
      </>
    )


  );

}

export default observer(App);
