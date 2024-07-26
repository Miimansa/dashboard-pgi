import React, { useState } from "react";
import { dataConfig } from "../../Functions_Files/filters_data";
import Select from 'react-select';
import Styles from './Graphfilter.module.css';
import { updateUser } from "../../Functions_Files/Fetchdata";
import { useDispatch, useSelector } from "react-redux";
import { convertObject } from "../../Functions_Files/file_functions";
import { setUser } from "../../../state/userSlice";
import { useNavigate } from 'react-router-dom'
import FadeLoader from "react-spinners/FadeLoader";

const Graphfilter_home = () => {
    // State to store selected types for each item
    const [selectedTypes, setSelectedTypes] = useState({});
    const navigate = useNavigate();
    // Handle change for each Select component
    const handleChange = (selectedOption, itemLabel) => {
        setSelectedTypes(prevSelectedTypes => ({
            ...prevSelectedTypes,
            [itemLabel]: selectedOption
        }));
    };
    const [loading, setloading] = useState(false);
    const token = useSelector((state) => (state.user.token));
    const dispatch = useDispatch();
    const handleUpdate = async () => {
        setloading(true)
        const formattedData = convertObject(selectedTypes, 'home');
        const res = await updateUser(token, formattedData)
        dispatch(setUser(res.data));
        setloading(false)
        navigate('/dashboard')
    }
    const user = useSelector((state) => (state.user.user.bio.home));
    return (
        <>
            {dataConfig.home.map((item, index) => (
                <div key={index}>
                    <label>Select type for <strong>{item.label}</strong> :</label>
                    <Select
                        options={item.compatibleTypes}
                        value={selectedTypes[item.label]}
                        defaultInputValue={user[item.label].SelectedType}
                        onChange={(selectedOption) => handleChange(selectedOption, item.label)}
                    />
                </div>
            ))}
            <button className={Styles.save_button} onClick={handleUpdate}>
                {loading ? "saving..." : "save"}
            </button>
        </>
    );
};

export default Graphfilter_home;
