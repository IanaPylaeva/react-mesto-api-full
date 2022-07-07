import React from "react";
import logo from '../images/logo.svg';
import { Routes, Link, Route } from 'react-router-dom';

function Header(props) {
  return (    
    <header className="header">
      <a href="#" target="_blank" rel="noopener" className="header__logo"><img src={logo} alt="Логотип Место Россия" /></a>
      <Routes>
        <Route exact path="/" element={
          <div className="header__auth">
            <p className="header__text">{props.mail}</p>
            <Link to="/sign-in" className="header__link" type="button" onClick={props.onClick}>Выйти</Link>
          </div>
        }></Route>
        <Route path="/sign-up" element={
          <Link to="/sign-in" className="header__link">Войти</Link>
        }></Route>
        <Route path="/sign-in" element={
          <Link to="/sign-up" className="header__link">Регистрация</Link>
        }></Route>
      </Routes>
    </header>
  )
}

export default Header;