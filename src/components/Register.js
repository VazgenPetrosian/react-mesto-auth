import React from "react";
import { useState, useEffect } from "react";
import { Routes, Link, Route, Navigate, useNavigate } from "react-router-dom";

function Register({ onRegister }) {
  const [formValue, setFormValue] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValue({
      ...formValue,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister(formValue.password, formValue.email);
    setFormValue({});
  };

  return (
    <div className="auth">
      <h2 className="auth__title">Регистрация</h2>
      <form className="auth__form" onSubmit={handleSubmit}>
        <input
          type="email"
          className="auth__input"
          required
          minLength="8"
          maxLength="40"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          value={formValue.email || ""}
        ></input>
        <span className="auth__input-error auth-error"></span>
        <input
          type="password"
          className="auth__input"
          name="password"
          placeholder="Пароль"
          required
          minLength="2"
          maxLength="30"
          onChange={handleChange}
          value={formValue.password || ""}
        ></input>
        <span className="auth__input-error auth-error"></span>
        <button type="submit" className="auth__button">
          Зарегистрироваться
        </button>
        <Link to="/sign-in" className="auth__sign-up">
          Уже зарегистрированы? Войти
        </Link>
      </form>
    </div>
  );
}
export default Register;
