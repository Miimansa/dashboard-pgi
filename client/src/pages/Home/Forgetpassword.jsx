import React, { useState } from "react";
import IMG from '../../assets/sgpgi_logo.png';
import { message } from "antd";
import Styles from './Login.module.css';
import { MdEmail } from "react-icons/md";
import Loading_button from "../UI_components/Mui_loadingbutton";
import OtpInput from 'react-otp-input';
import { FaKey } from "react-icons/fa";
import { changePassword, requestResetPassword, requestVerify } from "../Functions_Files/Fetchdata";
import { useNavigate } from "react-router-dom";


const Forgetpassword = () => {
    const [step, setStep] = useState('email');


    // getopt
    const [email, setEmail] = useState('')
    const [loading, setloading] = useState(false)
    const handleChange = (event) => {
        setEmail(event.target.value);
    };
    const handleEmailSubmit = async () => {
        try {
            if (!email) return message.error("Email Required")
            setloading(true)
            const res = await requestResetPassword(email);
            if (res.status == 200) {
                message.success(res.data.message);
                setloading(false)
                setStep('otp');
            }
        } catch (error) {
            setloading(false);
            message.error(error.response?.data?.message || "An error occurred");
        }
    };
    const emailSection = (
        <>
            <div className={Styles.items}>
                <p><MdEmail /></p>
                <input
                    type="email"
                    id="username"
                    placeholder="Email"
                    value={email}
                    onChange={handleChange}
                />
            </div>
            <div className={Styles.buttons} >
                <Loading_button
                    name="Get Otp"
                    loading={loading}
                    handleclick={handleEmailSubmit}
                />
            </div>
        </>
    );


    // check otp
    const [otp, setOtp] = useState("");
    const handleOtpVerify = async () => {
        try {
            if (!otp) return message.error("Otp Required")
            setloading(true)
            const res = await requestVerify(email, otp);
            if (res.status == 200) {
                message.success(res.data.message);
                setloading(false)
                setStep('password');
            }
        } catch (error) {
            setloading(false);
            message.error(error.response?.data?.message || "An error occurred");
        }
    };
    const otpSection = (
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
            <div className={Styles.buttons_for} >
                <Loading_button
                    loading={loading}
                    name="Verify Otp"
                    handleclick={handleOtpVerify}
                />
            </div>
        </div>
    );

    // change password
    const [password, setPassword] = useState('');
    const [pass, setPass] = useState('')
    const navigate = useNavigate()
    const onchangePassowrd = (e) => {
        setPassword(e.target.value)
    }
    const onchangePass = (e) => {
        setPass(e.target.value)
    }
    const handleChangePassword = async () => {
        if (!pass || !password) return message.error("password Required");
        if (pass !== password) return message.error("password should be same");
        try {
            setloading(true)
            const res = await changePassword(email, password);
            if (res.status == 200) {
                message.success(res.data.message);
                setloading(false)
                navigate('/')
            }
        } catch (error) {
            setloading(false);
            message.error(error.response?.data?.message || "An error occurred");
        }
    };
    const passwordSection = (
        <>
            <div className={Styles.items}>
                <p><FaKey /></p>
                <input
                    value={password}
                    onChange={onchangePassowrd}
                    type="password"
                    id="password"
                    placeholder="Password"
                />
            </div>
            <div className={Styles.items}>
                <p><FaKey /></p>
                <input
                    value={pass}
                    onChange={onchangePass}
                    type="password"
                    id="cpassword"
                    placeholder="Confirm Password"
                />
            </div>
            <div className={Styles.buttons_for} >
                <Loading_button
                    name="Change password"
                    loading={loading}
                    handleclick={handleChangePassword}
                />
            </div>
        </>
    );

    return (
        <div className={Styles.main}>
            <div className={Styles.loginup}>
                <img src={IMG} alt="logo" />
                <div>SGPGI DASHBOARD</div>
            </div>
            <div className={Styles.heading}>Forget Password</div>

            {step === 'email' && emailSection}
            {step === 'otp' && otpSection}
            {step === 'password' && passwordSection}
        </div>
    );
}

export default Forgetpassword;
