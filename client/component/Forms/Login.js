import React, { useState, useEffect } from 'react';

// Components
import Input from './Input';
import Label from './Label';
import Button from '../Button/Button';
import Form from './Form';
import findSSIDCookie from '../../utils/findSSIDCookie';

const Login = ({ setAuth, setCurrentUser }) => {
  //data to set initial state
  const [login, setLogin] = useState({
    email: null,
    password: null,
  });
  const [errorOnLogin, setErrorOnLogin] = useState(false);

  // if error state changed and error div rendered change it back in 3 sec
  useEffect(() => {
    if (errorOnLogin) {
      setTimeout(() => {
        setErrorOnLogin(false);
      }, 3000);
    }
  }, [errorOnLogin]);

  // submitting request to verify user,
  // if success - set auth to true, this will trigger rerender of App component and redirect from landing to main page;
  // if success - set user name in localStorage,
  // if admin - set user status in localStorage,
  // if new messages available - set newMessage property in localStorage
  // get cookie and store in localStorage,
  const postLogin = async (loginData) => {
    return fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });
  };

  const authorize = async () => {
    try {
      // POST Login information
      const loginData = await postLogin(login);
      const loginResponse = await loginData.json();

      if (!loginResponse.hasLogged) {
        setErrorOnLogin(true);
      } else if (loginResponse.hasLogged) {
        const ssidToken = findSSIDCookie(document.cookie);
        localStorage.setItem('email', `${login.email}`);
        //! ////////////////////////////////////////////////////////////////
        setCurrentUser(loginResponse.userInfo);
        if (ssidToken) {
          // Set the token in Local Storage
          localStorage.setItem('token', ssidToken);
          // Set the name in Local Storage
          localStorage.setItem(
            'name',
            `${loginResponse.userInfo.firstName} ${loginResponse.userInfo.lastName}`,
          );
        }
        // Set the state of the app to reflect administrative privileges
        if (loginResponse.userInfo.isAdmin) {
          localStorage.setItem('admin', 'true');
        }
        // setAuth of in a parent component
        setAuth(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Form>
      {errorOnLogin && (
        <div className="loginerror-message">
          Information you provided does not match our records.
        </div>
      )}
      <Label>
        Email:
        <Input
          type="email"
          placeholder="me@you.com"
          onChange={(e) => setLogin((login) => ({ ...login, email: e.target.value }))}
        />
      </Label>
      <Label>
        Password:
        <Input
          type="password"
          onChange={(e) => setLogin((login) => ({ ...login, password: e.target.value }))}
        />
      </Label>
      <Button variant="submit" onClick={authorize}>
        Log In
      </Button>
    </Form>
  );
};

export default Login;
