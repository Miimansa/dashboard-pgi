import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { validUser } from "../Functions_Files/Fetchdata";
import ClipLoader from "react-spinners/ClipLoader";
const Protect = ({ children }) => {
    const token = useSelector((state) => state.user?.token);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isValid, setIsValid] = useState(false);
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
            navigate('/');
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        validateUser();
    }, []);

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