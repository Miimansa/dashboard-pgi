import React, { useState } from 'react';
import { useSelector } from 'react-redux'; // Corrected import
import styles from './Profile.module.css';
import IMG from '../../assets/user.png';
import Graphfilter from './filters/Graphfilter';
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
const Profile = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => (state.user.user));
    const [isEditable, setIsEditable] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.full_name,
        email: user?.email,
        username: user.username,
        profileImage: IMG
    });
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
            </div>
            <div className={styles.rightDiv}>
                <Graphfilter />
            </div>
        </div>
    );
};

export default Profile;
