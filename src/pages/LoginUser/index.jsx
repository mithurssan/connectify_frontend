import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setToken, setUsername, setIsLoaded, setVerified } from '../../actions';
import LoginImage from '../../assets/Connectify.jpg';
import './style.css';

const LoginUser = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [password, setPassword] = useState('');

	const username = useSelector((state) => state.user.username);
	const verified = useSelector((state) => state.app.verified);
	const isLoaded = useSelector((state) => state.app.isLoaded);

	useEffect(() => {
		const fetchToken = async () => {
			try {
				const storedToken = localStorage.getItem('token');
				if (storedToken) {
					dispatch(setToken(storedToken));
				}
			} catch (error) {
				console.log(error);
			}
		};

		fetchToken();
	}, [dispatch]);

	useEffect(() => {
		if (verified && isLoaded) {
			loginUser();
		}
	}, [verified, isLoaded]);

	const errorCreate = (error) =>
		toast.error(error, {
			position: 'top-center',
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: 'light',
		});

	const loginUser = async () => {
		dispatch(setIsLoaded(false));

		try {
			const url = 'http://127.0.0.1:5000/users/login';
			const data = {
				user_username: username,
				user_password: password,
			};
			const res = await axios.post(url, data);

			if (verified) {
				dispatch(setToken(res.data.token));
				navigate('/dashboard');
			}
		} catch (error) {
			if (error && password.length != 0) {
				errorCreate('Incorrect credentials');
			}
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (username.length === 0 || password.length === 0) {
			errorCreate('Enter username and password');
			dispatch(setIsLoaded(false));
		} else {
			getUsers();
			dispatch(setIsLoaded(true));
		}
	};

	async function getUsers() {
		try {
			const url = 'http://127.0.0.1:5000/users/';
			const res = await axios.get(url);
			const data = await res.data;

			const user = data.find((u) => u.user_username === username);

			dispatch(setVerified(user.user_verified));
		} catch (error) {
			if (error) {
				errorCreate("User doesn't exist");
			}
		}
	}

	return (
		<div className="container-login-register">
			<form onSubmit={handleSubmit} className="user-container">
				<label htmlFor="username" className="user-label">
					Username:
				</label>
				<input type="text" id="username" value={username} onChange={(e) => dispatch(setUsername(e.target.value))} className="user-text" />

				<label htmlFor="password" className="user-label">
					Password:
				</label>
				<input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="user-text" />

				<input type="submit" value="Login" className="login-register-button" />
				<div className="container">
					<Link to="/login-register" className="sign-in-business">
						Login as a Business
					</Link>
				</div>
			</form>

			<div className="login-register-image">
				<img src={LoginImage} alt="login-page" className="image" />
			</div>
			<ToastContainer />
		</div>
	);
};

export default LoginUser;
