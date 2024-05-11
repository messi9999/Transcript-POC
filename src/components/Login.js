import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Login.css"

export default function Login() {
    const base_url = process.env.REACT_APP_BASEURL
    let navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    //
    const handleLogin = async (event) => {
        event.preventDefault();
        const response = await fetch("https://poc-transcript-server.azurewebsites.net/" + '/api/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        localStorage.setItem('token', data.token)
        navigate('/dashboard');
    };
    return (
        <div className='login-main'>
            <div className='login-form'>
                <h1>Login</h1>
                <form onSubmit={handleLogin} className='login-main-form'>
                    <div>
                        <label>
                            Username:
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <br />
                    <div>
                        <label>
                            Password:
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <br />
                    <button disabled={username === "" || password === ""} type="submit">Log In</button>
                </form>
            </div>
        </div>
    );
}
