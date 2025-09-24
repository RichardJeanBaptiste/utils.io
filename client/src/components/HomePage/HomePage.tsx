import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import { FaGoogle } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import './HomePage.css'

function HomePage() {
    return (
        <div className="root">
            <Form className='login_form'>
                <div style={{ width: '100%', height: '100%', position: 'relative'}}>
                    <Form.Group className='email_form'>
                        <Form.Label>Login:</Form.Label>
                        <Form.Control type="email" placeholder="name@example.com"/>
                    </Form.Group>

                    <Form.Group className='pass_form'>
                        <Form.Label>Password:</Form.Label>
                        <Form.Control type="passwprd" placeholder='*************'/>
                    </Form.Group>

                    <div style={{ display: 'flex', flexDirection: 'row', width: '100%', height: '10%'}}>
                        <Button variant='link'>Forgot Password?</Button>
                        <Button variant='link'>Login</Button>
                    </div>

                    <div className='login_icons'>
                        <Button variant='light'>
                            <FaGoogle/>
                        </Button>

                        <Button variant='light'>
                            <FaFacebook/>
                        </Button>
                        
                        <Button variant='light'>
                            <FaGithub />
                        </Button>
                    </div>
                </div> 
            </Form>
        </div>
    )
}


export default HomePage;