import React, { useState } from "react";
import Styles from './Signup.module.css';
import { Link, useNavigate } from "react-router-dom";
import { FaUserAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import Loading_button from "../UI_components/Mui_loadingbutton";
import IMG from '../../assets/sgpgi_logo.png';
import { FaKey } from "react-icons/fa";
import toast, { Toaster } from 'react-hot-toast';
import { registerUser, resendOtp, verifyotp } from "../Functions_Files/Fetchdata";
import OtpInput from 'react-otp-input';
const Signup = () => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        username: '',
        password: '',
        bio: ''
    });
    const navigate = useNavigate();

    const [otpdiv, setOtpdiv] = useState(false);
    const onchangePassowrd = (e) => {
        setPassword(e.target.value)
    }
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };
    const notify_error = (message) => toast.error(message,
        {
            duration: 2000,
            position: "top-center",
        }
    );
    const notify_seccess = (message) => toast.success(message,
        {
            duration: 2000,
            position: "top-center",
        }
    );
    const notify_info = (message) => toast.info(message,
        {
            duration: 2000,
            position: "top-center",
        }
    );
    const handleSignup = async (e) => {
        e.preventDefault();

        if (typeof password === 'undefined' || password.length < 8) {
            return notify_error("Password length is short");
        }
        setLoading(true);
        if (typeof formData === 'undefined' || typeof formData.password === 'undefined' || formData.password !== password) {
            setLoading(false); // Stop loading if there's an error
            return notify_error("Password should be the same");
        }
        let res;
        try {
            setLoading(true);
            res = await registerUser(formData);
            setLoading(false);
            console.log(res);
            if (res.status === 200 || res.status === 201) {
                setOtpdiv(true);
                notify_seccess(res.data.message || "Operation successful");
            }
        } catch (error) {
            setLoading(false);
            if (error.response) {
                notify_error(error.response.data.message || "An error occurred");
            } else if (error.request) {
                notify_error("No response received from server");
            } else {
                notify_error(error.message || "An error occurred");
            }
        }

    }
    const handleverifyOtp = async () => {
        let res;
        setLoading(true)
        try {
            res = await verifyotp(otp, formData.email);
            setLoading(false);
            if (res.status === 200 || res.status === 201) {
                notify_seccess(res.data.message);
                setTimeout(() => {
                    navigate("/");
                }, 1000);
            } else {
                notify_error("Server Error occured, try again");
            }
        } catch (error) {
            setLoading(false);
            if (error.response) {
                notify_error(error.response.data.message || "An error occurred");
            } else if (error.request) {
                notify_error("No response received from server");
            } else {
                notify_error(error.message || "An error occurred");
            }
        }
    }
    const [resendloading, setresendloading] = useState(false)
    const handleresendotp = async () => {
        let res;
        setresendloading(true)
        try {
            res = await resendOtp(formData.email);
            setresendloading(false);
            if (res.status === 200 || res.status === 201) {
                notify_seccess(res.data.message);
            }
            else {
                notify_error("Server Error occured, try again");
            }
        } catch (error) {
            setresendloading(false);
            return notify_error("Server Error occured, try again");
        }
    }
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
                    USER SIGNUP
                </div>
                {
                    !otpdiv
                        ?
                        <>
                            <div className={Styles.items}>
                                <p><FaUserAlt /></p>
                                <input
                                    type="text"
                                    id="full_name"
                                    placeholder="Full Name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className={Styles.items}>
                                <p><MdEmail /></p>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className={Styles.items}>
                                <p><MdOutlineDriveFileRenameOutline /></p>
                                <input
                                    type="text"
                                    id="username"
                                    placeholder="User Id"
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className={Styles.items}>
                                <p><FaKey /></p>
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className={Styles.items}>
                                <p><FaKey /></p>
                                <input
                                    type="password"
                                    id="cpassword"
                                    placeholder="Confirm Password"
                                    value={password}
                                    onChange={(e) => onchangePassowrd(e)}
                                />
                            </div>
                            <div className={Styles.buttons}>
                                <Loading_button
                                    name="Get Otp"
                                    loading={loading}
                                    handleclick={(e) => handleSignup(e)}

                                />
                            </div>
                            <Link to='/' className={Styles.links}>
                                <div>Already have an account?</div>
                            </Link>
                        </>
                        :
                        <div className={Styles.otpmaindiv}>
                            <div className={Styles.otpmain}>
                                <OtpInput
                                    value={otp}
                                    onChange={setOtp}
                                    numInputs={6}
                                    renderSeparator={<span>-</span>}
                                    renderInput={(props) => <input {...props} />}
                                    inputStyle={Styles.inputotp}
                                />
                            </div>
                            <div className={Styles.sendbuttons}>
                                <div className={Styles.buttons} >
                                    <Loading_button
                                        name="Verify Otp"
                                        loading={loading}
                                        handleclick={handleverifyOtp}
                                    />
                                </div>
                                <div className={Styles.buttons}  >
                                    <Loading_button
                                        name="Resend Otp"
                                        loading={resendloading}
                                        handleclick={handleresendotp}
                                    />
                                </div>
                            </div>
                        </div>
                }
            </div>
        </>
    );
}

export default Signup;
