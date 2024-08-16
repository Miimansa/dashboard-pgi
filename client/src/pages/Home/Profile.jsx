import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styles from './Profile.module.css';
import IMG from '../../assets/user.png';
import Graphfilter from './filters/Graphfilter';
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import DefaultDepartments from './DefaultDepartments';
import { changeNewPassword } from '../Functions_Files/Fetchdata';
import { message } from 'antd';

const Profile = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => (state.user.user));
    const [isEditable, setIsEditable] = useState(false);
    const [showPasswordChange, setShowPasswordChange] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.full_name,
        email: user?.email,
        username: user.username,
        profileImage: IMG
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });

    const [labelColors, setLabelColors] = useState(() => {
        const savedColors = localStorage.getItem('labelColors');
        return savedColors ? JSON.parse(savedColors) : {
            'M': '#3366cc',
            'F': '#dd4477',
            'O': '#ff9900',
            'Male': '#3366cc',
            'Female': '#dd4477',
            'Others': '#ff9900',
            'Surgical Gastroenterology': '#109618',
            'Paediatric Gastroenterology': '#990099',
            'Gastroenterology': '#0099c6',
            'Hematology': '#dc3912',
            'Hepatology': '#66aa00',
            'Total Visits': '#b82e2e',
            'Total Admissions': '#316395',
            'Inpatient': '#994499',
            'Outpatient': '#22aa99',
            'IN': '#994499',
            'OP': '#22aa99'
        };
    });

    useEffect(() => {
        localStorage.setItem('labelColors', JSON.stringify(labelColors));
    }, [labelColors]);

    const handleColorChange = (label, color) => {
        setLabelColors(prevColors => ({
            ...prevColors,
            [label]: color
        }));
    };

    const resetColors = () => {
        const defaultColors = {
            'M': '#3366cc',
            'F': '#dd4477',
            'O': '#ff9900',
            'Male': '#3366cc',
            'Female': '#dd4477',
            'Others': '#ff9900',
            'Surgical Gastroenterology': '#109618',
            'Paediatric Gastroenterology': '#990099',
            'Gastroenterology': '#0099c6',
            'Hematology': '#dc3912',
            'Hepatology': '#66aa00',
            'Total Visits': '#b82e2e',
            'Total Admissions': '#316395',
            'Inpatient': '#994499',
            'Outpatient': '#22aa99',
            'IN': '#994499',
            'OP': '#22aa99'
        };
        setLabelColors(defaultColors);
        localStorage.setItem('labelColors', JSON.stringify(defaultColors));
        message.success('Colors reset to default');
    };

    const saveColors = () => {
        localStorage.setItem('labelColors', JSON.stringify(labelColors));
        message.success('Colors saved successfully');
    };
    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleSubmitPasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
            message.error('New Password and Confirm New Password do not match.');
            return;
        }
        try {
            await changeNewPassword(user.email, passwordData.currentPassword, passwordData.newPassword);
            message.success('Password changed successfully!');
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: ''
            });
            setShowPasswordChange(false);
        } catch (error) {
            console.error('Error changing password:', error);
            message.error(error.message || 'Failed to change password. Please try again.');
        }
    };
    return (
        <div className={styles.container}>
            <div className={styles.backprofile} onClick={(e) => navigate(-1)}>
                <IoArrowBackOutline />
            </div>
            <div className={styles.leftDiv}>
                <div className={styles.section}>
                    <img className={styles.profile_image} src={formData.profileImage} alt='profile-img'></img>
                </div>
                <div className={styles.section}>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        disabled
                    />
                </div>
                <div className={styles.section}>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        disabled
                    />
                </div>
                <div className={styles.section}>
                    <label>Username:</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        disabled
                    />
                </div>
                {!showPasswordChange && (
                    <button className={styles.ChangePassword} onClick={() => setShowPasswordChange(!showPasswordChange)}>
                        Change Password
                    </button>
                )}
                {showPasswordChange && (
                    <form onSubmit={handleSubmitPasswordChange}>
                        <div className={styles.section}>
                            <label>Current Password:</label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                required
                            />
                        </div>
                        <div className={styles.section}>
                            <label>New Password:</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                required
                            />
                        </div>
                        <div className={styles.section}>
                            <label>Confirm New Password:</label>
                            <input
                                type="password"
                                name="confirmNewPassword"
                                value={passwordData.confirmNewPassword}
                                onChange={handlePasswordChange}
                                required
                            />
                        </div>
                        <div className={styles.passwordButtons}>
                            <button type="button" onClick={() => setShowPasswordChange(false)}>Cancel</button>
                            <button type="submit">Submit Password Change</button>
                        </div>
                    </form>
                )}
                 <DefaultDepartments />
            </div>

            
            <div className={styles.rightDiv}>
                <Graphfilter />
                <div className={styles.colorSection}>
                    <h3>Label Colors</h3>
                    {Object.entries(labelColors).map(([label, color]) => (
                        <div key={label} className={styles.colorItem}>
                            <label>{label}:</label>
                            <input
                                type="color"
                                value={color}
                                onChange={(e) => handleColorChange(label, e.target.value)}
                            />
                        </div>
                    ))}
                    <div className={styles.colorButtons}>
                        <button onClick={saveColors}>Save Colors</button>
                        <button onClick={resetColors}>Reset to Default</button>
                    </div>
                </div>
            </div>
        </div>
    );
}    

export default Profile;