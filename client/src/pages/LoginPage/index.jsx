import React from 'react';
import "./styles.css";
import { useEffect, useState } from 'react';
import axios from 'axios'

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
{/*
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("submit", {email, password});
    };
*/}

const handleSubmit = async e => {
    e.preventDefault();
    const user = { email, password };
    // enviar o nome de usuário e a senha ao servidor
    const response = await axios.post(
      "http://ld-patrimony-management-1460998202.us-east-1.elb.amazonaws.com/api/v1/login",
      user
    );

    
    // definir o state do usuário
   // setUser(response.data)
    // armazenar o usuário em localStorage
    localStorage.setItem('user', response.data)
    console.log(response.data)
  };
    return(
        <div id="Login">
            <h1 className="title">Login</h1>
            <form className="form" onSubmit={handleSubmit}>
                <div className="field">
                    <label htmlFor="email">E-mail</label>
                    <input 
                    type="string" 
                    name="email" 
                    id="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="field">
                    <label htmlFor="password">Senha</label>
                    <input 
                    type="string" 
                    name="password" 
                    id="password"
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    />
                </div>

                <div className="actions">
                    <button type="submit">Entrar</button>
                </div>
            </form>
        </div>

    );
}

export default LoginPage