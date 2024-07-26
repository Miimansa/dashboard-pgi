import React, { useState } from "react";
import { dataConfig } from "../../Functions_Files/filters_data";
import Select from 'react-select';
import Styles from './Graphfilter.module.css';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../../Functions_Files/Fetchdata";
import { setUser } from "../../../state/userSlice";
import { convertObject } from "../../Functions_Files/file_functions";
const Graphfilter_emergency = () => {
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
        const formattedData = convertObject(selectedTypes, 'emergency');
        console.log(formattedData)
        const res = await updateUser(token, formattedData)
        dispatch(setUser(res.data));
        setloading(false)
        navigate('/dashboard/emergency')
    }
    const user = useSelector((state) => (state.user.user.bio.emergency));
    return (
        <>
            {dataConfig.emergency.map((item, index) => (
                <div>
                    <label>Select type for <strong>{item.label}</strong> :</label>
                    <Select
                        key={index}
                        options={item.compatibleTypes}
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

export default Graphfilter_emergency;