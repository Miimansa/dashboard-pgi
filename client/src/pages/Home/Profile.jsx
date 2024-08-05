import React, { useState } from 'react';
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
            </div>
        </div>
    );
}    

export default Profile;