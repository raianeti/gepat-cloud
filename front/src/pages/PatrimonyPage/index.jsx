import React from 'react';
import "./styles.css";
import { useEffect, useState } from 'react';
import axios from 'axios'
//import { Link } from 'react-router-dom';
import { MainButton } from '../../componentes/mainButton';

const PatrimonyPage = () => {
    const [name, setName] = useState("");
    const [number, setNumber] = useState("");
    const [location, setLocation] = useState("");


const handleSubmit = async e => {
        e.preventDefault();
        const user = { name, number, location };
        // enviar o nome de usuário e a senha ao servidor
        const response = await axios.post(
          "http://ld-patrimony-management-1460998202.us-east-1.elb.amazonaws.com/api/v1/patrimony",
          user
        );
    
        
        // definir o state do usuário
       // setUser(response.data)
        // armazenar o usuário em localStorage
        localStorage.setItem('user', response.data)
        console.log(response.data)
      };
    return(
        <div id="Patrimony">
            <h1 className="title">Cadastro de Itens</h1>
            <form className="form" onSubmit={handleSubmit}>
                <div className="field">
                    <label htmlFor="name">Nome</label>
                    <input 
                    type="string" 
                    name="name" 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="field">
                    <label htmlFor="string">Número</label>
                    <input 
                    type="string" 
                    name="number" 
                    id="number" 
                    value={number} 
                    onChange={(e) => setNumber(e.target.value)}
                    />
                </div>

                <div className="field">
                    <label htmlFor="string">Local</label>
                    <input 
                    type="string" 
                    name="location" 
                    id="location"
                    value={location} 
                    onChange={(e) => setLocation(e.target.value)} 
                    />
                </div>

                <div className="actions">
                    <button type="submit">Cadastrar</button>
                </div>
                
             
            </form>
        </div>

    );
}

export default PatrimonyPage