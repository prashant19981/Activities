
import { Button, Container, Menu } from "semantic-ui-react";
import 'semantic-ui-css/semantic.min.css';
import { NavLink } from "react-router-dom";

const Navbar = () =>{
    return(
        <Menu inverted fixed="top">
            <Container>
                <Menu.Item as={NavLink} to='/' header>
                    <img src="/assets/logo.png" alt="logo" style={{marginRight:'5px'}}/>
                    Reactivities
                </Menu.Item>
                <Menu.Item as={NavLink} to='/activities' name='Activities'/>
                <Menu.Item >
                    <Button as={NavLink} to='/createActivity'  positive content='Create Activity'/>
                </Menu.Item>
            </Container>
        </Menu>
    );
}

export default Navbar ;