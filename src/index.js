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

import { render } from "@testing-library/react";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./index.scss";

const App = () => {
	return (
		<Router>
			<div className="all-works">
				<div className="container">
					<Header />
					<div className="app">
						<Routes>
							<Route exact path="/" element={<Home />} />
							<Route exact path="/employees" element={<Employees />} />
						</Routes>
					</div>
				</div>
			</div>
		</Router>
	);
};

const Home = () => {
	return <h1>this is the home page</h1>;
};

class Employees extends Component {
	state = {
		data: {},
		filter: "",
		category: "all",
	};
	maxItemId = 333;

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

	onDeleteItem = (id) => {
		const newArray = this.state.data.data.filter((item) => item.id !== id);
		const newObj = Object.assign({}, this.state.data, { data: newArray });
		this.setState({ data: newObj });
	};

	onAddItem = (e, input) => {
		e.preventDefault();
		if (input.first_name && input.last_name && input.email && input.avatar) {
			this.maxItemId += 1;
			const newId = this.maxItemId;
			const newArray = [...this.state.data.data, { ...input, id: newId }];
			const newObj = Object.assign({}, this.state.data, { data: newArray });
			this.setState({ data: newObj });
		}
	};

	onChangeProp = (id, prop) => {
		this.setState(({ data }) => {
			return {
				data: data.map((item) => {
					if (item.id === id) {
						const newItem = { ...item, [prop]: !item[prop] };
						return newItem;
					}

					return item;
				}),
			};
		});
	};

	onChangeFilter = (filter) => {
		this.setState(() => {
			return { filter };
		});
	};

	filteredData = (items, filter) => {
		if (filter.length === 0) {
			return items;
		}
		const newData = items.filter((item) => {
			if (item.name.indexOf(filter) > -1) {
				return item;
			}
		});

		return newData;
	};

	onChangeBtn = (category) => {
		this.setState({ category });
	};

	filteredCategory = (items, category) => {
		switch (category) {
			case "all":
				return items;
			case "increase":
				return items.filter((item) => {
					return item.increase;
				});
			case "moreThen1000":
				return items.filter((item) => {
					return item.salary > 1000;
				});
			default:
				return items;
		}
	};

	render() {
		const { data, filter, category } = this.state;
		return (
			<div className="app">
				<div className="search-panel"></div>
				<EmployeesList
					data={data}
					onDeleteItem={this.onDeleteItem}
					onChangeProp={this.onChangeProp}
				/>
				<EmployeesAddForm onAddItem={this.onAddItem} />
			</div>
		);
	}
}

const Header = () => {
	return (
		<header className="header">
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
		</header>
	);
};

const EmployeesList = ({ data, onDeleteItem, onChangeProp }) => {
	let elements = [];
	if (data.data) {
		elements = data.data.map((item) => {
			return (
				<EmployeesListItem
					key={item.id}
					name={item.first_name}
					onDeleteItem={() => {
						onDeleteItem(item.id);
					}}
				/>
			);
		});
	}
	return <ul className="app-list list-group">{elements}</ul>;
};

const EmployeesListItem = ({ name, onDeleteItem }) => {
	let classNames = "list-group-item d-flex justify-content-between";

	return (
		<li className={classNames}>
			<span className="list-group-item-label" data-prop="like">
				{name}
			</span>
			<div className="d-flex justify-content-center align-items-center">
				<button
					type="button"
					className="btn-trash btn-sm "
					onClick={onDeleteItem}
				>
					<i className="fas fa-trash"></i>
				</button>
			</div>
		</li>
	);
};

class EmployeesAddForm extends Component {
	state = {
		first_name: "",
		last_name: "",
		email: "",
		avatar: "",
	};

	onValueChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value,
		});
	};

	render() {
		const { first_name, last_name, email, avatar } = this.state;
		const { onAddItem } = this.props;

		return (
			<div className="app-add-form">
				<h3>Add a new employee</h3>
				<form
					className="add-form d-flex"
					onSubmit={(e) => {
						onAddItem(e, this.state);
						this.setState({
							first_name: "",
							last_name: "",
							email: "",
							avatar: "",
						});
					}}
				>
					<input
						type="text"
						className="form-control new-post-label"
						placeholder="First name"
						name="first_name"
						value={first_name}
						onChange={this.onValueChange}
					/>
					<input
						type="text"
						className="form-control new-post-label"
						placeholder="Last name"
						name="last_name"
						value={last_name}
						onChange={this.onValueChange}
					/>
					<input
						type="email"
						className="form-control new-post-label"
						placeholder="Email"
						name="email"
						value={email}
						onChange={this.onValueChange}
					/>
					<input
						type="text"
						className="form-control new-post-label"
						placeholder="Avatar"
						name="avatar"
						value={avatar}
						onChange={this.onValueChange}
					/>
					<button type="submit" className="btn btn-primary">
						Add
					</button>
				</form>
			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById("root"));
