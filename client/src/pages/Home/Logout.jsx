import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearUser } from "../../state/userSlice";
import Styles from './Login.module.css';
import { clearFilters } from "../../state/filtersSlice";
const Logout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(clearUser());
        dispatch(clearFilters());
        localStorage.clear()
        navigate('/');
    }

    return (
        <button onClick={handleLogout} className={Styles.logout_button}>
            Logout
        </button>
    );
}

export default Logout;
