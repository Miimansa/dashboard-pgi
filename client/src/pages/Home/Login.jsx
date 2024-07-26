import React, { useState } from "react";
import Styles from './Login.module.css';
import { Link } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import { FaUnlockKeyhole } from "react-icons/fa6";
import Loading_button from "../UI_components/Mui_loadingbutton";
import IMG from '../../assets/sgpgi_logo.png'
import { loginUser } from "../Functions_Files/Fetchdata";
import { notify_error, notify_success } from "../Functions_Files/file_functions";
import { Toaster } from 'react-hot-toast';
import { useDispatch } from "react-redux";
import { setToken, setUser } from "../../state/userSlice";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
const Login = () => {
    const navigate = useNavigate();
    const [loading, setloading] = useState(false);
    const dispatch = useDispatch();
    const handlelogin = async () => {
        setloading(true);
        if (!formData.username || !formData.password) {
            setloading(false); // Stop loading if there's an error
            return notify_error("Fill Username or Password");
        }
        dispatch(setToken(null));
        let res;
        try {
            res = await loginUser(formData);
            console.log(res);
            if (res.status === 200 || res.status === 201) {
                dispatch(setToken(res.data.access_token));
                dispatch(setUser(res.data.user));
                navigate('/dashboard');
                message.success("Welcome to SGPGI Dashboard");
                setloading(false);
            } else if (res.status === 401 || res.status === 404) {
                message.error(res.data.message || "An error occurred");
                setloading(false);
            }
        } catch (error) {
            setloading(false);
            console.log(error.response?.data?.message || "An error occurred");
            message.error(error.response?.data?.message || "An error occurred");
        }
    };
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const handleChange = (e) => {
        console.log(e.target)
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };
    return (
        <>
            <Toaster />
            <div className={Styles.main}>
                <div className={Styles.loginup}>
                    <img src={IMG} alt="logo" />
                    <div>
                        SGPGI DASHBOARD
                    </div>
                </div>
                <div className={Styles.heading}>
                    USER LOGIN
                </div>
                <div className={Styles.items}>
                    <p><MdEmail /></p>
                    <input
                        type="email"
                        id="username"
                        placeholder="Email"
                        value={formData.username}
                        onChange={handleChange}
                    />
                </div>
                <div className={Styles.items}>
                    <p> <FaUnlockKeyhole /></p>
                    <input
                        type="password"
                        id="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>
                <div className={Styles.buttons} >
                    <Loading_button
                        name="Login"
                        loading={loading}
                        handleclick={handlelogin}
                    />
                </div>
                <Link to='/signup' className={Styles.links}>
                    <div>Don't have an account? Signup first</div>
                </Link>
                <Link to='/forgetpassword' className={Styles.links}>
                    <div>Forget Password?</div>
                </Link>
            </div >
        </>
    );
}

export default Login;
