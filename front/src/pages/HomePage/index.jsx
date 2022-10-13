import React from 'react';
import "./styles.css";
import { Link } from 'react-router-dom';


//import { Header } from '../../componentes/header';
import { MainButton } from '../../componentes/mainButton/';

const HomePage = () => {
    return (
        <div className="Home">
          
          <div className="main-content">
            <section>
              <div className="headline-container">
                <img src={require("../../assets/logo.png") } alt=""/>
                <h1>Controle de Patrimônio</h1>
                <h4>Cadastre seus itens.</h4>
                <div className="btnContainer">
                  <Link to="/cadastro">
                    <MainButton buttonText="Cadastrar"/>
                  </Link>
                  <Link to="/login">
                    <MainButton buttonText="Entrar"/>
                  </Link>
                </div>
              </div>
              
            </section>
          </div>
        </div>
      );
}    

export default HomePage


