import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import { message } from 'antd';
import { getDefaultValues, updateDefaultValues, getDeptList } from "../Functions_Files/Fetchdata";
import { colourStyles } from "../Functions_Files/filters_data";
import styles from './DefaultDepartments.module.css';

const DefaultDepartments = () => {
    const [departments, setDepartments] = useState([]);
    const [defaultDepartments, setDefaultDepartments] = useState([]);
    const token = useSelector((state) => state.user.token);

    useEffect(() => {
        const loadData = async () => {
            try {
                const defaultValues = await getDefaultValues(token);
                if (defaultValues.default_departments) {
                    const defaultDepts = defaultValues.default_departments.map(dept => ({
                        label: dept,
                        value: dept
                    }));
                    setDefaultDepartments(defaultDepts);
                }
                const allDepartments = await getDeptList(token);
                setDepartments(allDepartments.map(dept => ({
                    label: dept,
                    value: dept
                })));
            } catch (error) {
                console.error('Error loading departments:', error);
                message.error("Failed to load departments");
            }
        };

        loadData();
    }, [token]);

    const handleDepartmentChange = (selectedOptions) => {
        setDefaultDepartments(selectedOptions);
    };

    const handleSetDefaultDepartments = async () => {
        try {
            const defaultDepts = defaultDepartments.map(dept => dept.value);
            await updateDefaultValues(token, { default_departments: defaultDepts });
            message.success("Default departments updated successfully");
        } catch (error) {
            console.error('Error setting default departments:', error);
            message.error("Failed to update default departments");
        }
    };

    return (
        <div className={styles.container}>
            <h3>Default Departments</h3>
            <Select
                isMulti
                options={departments}
                value={defaultDepartments}
                onChange={handleDepartmentChange}
                styles={colourStyles}
                className={styles.select}
                placeholder="Select default departments..."
            />
            <button onClick={handleSetDefaultDepartments} className={styles.setDefaultButton}>
                Set Default Departments
            </button>
        </div>
    );
};

export default DefaultDepartments;