import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { validUser } from "../Functions_Files/Fetchdata";
import ClipLoader from "react-spinners/ClipLoader";
import { message } from "antd";
import { clearToken, clearUser } from "../../state/userSlice";
const Protect = ({ children }) => {
    const token = useSelector((state) => state.user?.token);
    console.log(token)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const [isValid, setIsValid] = useState(false);
    const location = useLocation();
    const validateUser = async () => {
        if (!token) {
            navigate('/');
            return;
        }
        try {
            const res = await validUser(token);
            if (res.status === 200) {
                setIsValid(true);
            }
        } catch (error) {
            console.error('Error in validate user:', error);
            localStorage.clear();
            message.info("login first")
            navigate('/');
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        validateUser();
    }, [location.pathname]);

    if (isLoading) {
        return <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
        }}>
            <ClipLoader />
        </div>
    }

    return isValid ? children : null;
};

export default Protect;