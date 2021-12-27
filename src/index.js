import { render } from "@testing-library/react";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./index.css";

class App extends Component {
  state = {
    data: {},
  };

  getResource = async (url) => {
    let res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, status: ${res.status}`);
    }

    return await res.json();
  };

  changeState = () => {
    this.getResource("https://reqres.in/api/users?per_page=12").then((res) => {
      this.setState({ data: res });
    });
  };

  componentDidMount() {
    this.changeState();
  }

  render() {
    return (
      <Router>
        <div className="all-works">
          <Header />
          <div className="app">
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route exact path="/employees" element={<Employees />} />
            </Routes>
          </div>
        </div>
      </Router>
    );
  }
}

const Home = () => {
  return <h1>this is the home page</h1>;
};

const Employees = () => {
  return <h1>this is the employees page</h1>;
};

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header__wrapper">
          <nav className="header__nav">
            <ul className="header__list">
              <li className="header__item">
                <Link to="/" className="header__link">
                  Home
                </Link>
              </li>
              <li className="header__item">
                <Link to="/employees" className="header__link">
                  Employees
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));

// 6. С использованием библиотеки React реализовать приложение, которое умеет
// показывать следующие страницы:
// ● / — главная
// ● /employees — страница со списком сотрудников
// На сайте, в шапке реализовать ссылки:
// ● Главная
// ● Сотрудники
// Получение данных должно быть реализованно посредством вызова стороннего api —
// https://reqres.in/api/users?per_page=12
// Страница Сотрудники содержит простой список сотрудников (только имена), на ней
// также есть возможность удаления и добавления нового сотрудника. Разумеется,
// отправлять результаты добавления и удаления никуда не нужно — их просто должно
// быть видно в текущем представлении.
// Оформление (дизайн) — не важно
