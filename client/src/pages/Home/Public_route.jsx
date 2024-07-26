import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { validUser } from "../Functions_Files/Fetchdata";
import ClipLoader from "react-spinners/ClipLoader";
const Public = ({ children }) => {
    const token = useSelector((state) => state.user?.token);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isValid, setIsValid] = useState(false);
    const validateUser = async () => {
        if (!token) {
            setIsValid(true);
            setIsLoading(false);
            localStorage.clear();

            return;
        }
        try {
            const res = await validUser(token);
            if (res.status === 200) {
                navigate('/dashboard');
            }
            else {
                setIsValid(true);
                setIsLoading(false);
                localStorage.clear();
                return;
            }
        } catch (error) {
            console.error('Error in validate user:', error);
            localStorage.clear();
            setIsLoading(false);
            setIsValid(true);
            return;
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

export default Public;