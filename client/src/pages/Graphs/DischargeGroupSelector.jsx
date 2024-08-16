import React, { useState, useEffect } from 'react';
import { Select, Radio, Typography, Button, Spin } from 'antd';
import { SearchOutlined, UndoOutlined } from '@ant-design/icons';
import FlexiblePlotlyChart from "../Graphs/FlexibleChart";
import { formatDataForPieChart } from '../Functions_Files/file_functions';
import { useDispatch, useSelector } from 'react-redux';
import styles from './DischargeStatusSelector.module.css';
import { setloading_text } from '../../state/filtersSlice';
import { getDischargeData } from '../Functions_Files/Fetchdata';

const { Option } = Select;
const { Title, Text } = Typography;



const DischargeStatusSelector = ({ dischargeTypes }) => {
    const [displayFactor, setDisplayFactor] = useState('department');
    const department = useSelector((state) => state.filter.department);
    const from_date = useSelector((state) => state.filter.from_date || '').replace(/\//g, '-');
    const to_date = useSelector((state) => state.filter.to_date || '').replace(/\//g, '-');
    const departments = department ? department.split(',').map(d => d.trim()) : [];
    const [loading, setLoading] = useState(false);
    const [selectedDepartments, setSelectedDepartments] = useState(departments);
    const [selectedDischargeTypes, setSelectedDischargeTypes] = useState(['Death','Normal Discharge']);
    const [factor, setFactor] = useState('department');
    const [groupingType, setGroupingType] = useState('Monthly');
    const [pieChartData, setPieChartData] = useState([]);
    const token = useSelector((state) => state.user.token);
    const dispatch = useDispatch();

    const fetchData = async () => {
        setLoading(true);
        dispatch(setloading_text(true));
        try {
            if (selectedDepartments.length === 0 || selectedDischargeTypes.length === 0) {
                setPieChartData([]);
            } else {
                const res = await getDischargeData(from_date, to_date, selectedDepartments.join(','), selectedDischargeTypes.join(','),factor, groupingType, token);
                setPieChartData(formatDataForPieChart(res.data));
            }
            setDisplayFactor(factor);
        } catch (error) {
            console.error('Error in fetching data:', error);
        } finally {
            setLoading(false);
            dispatch(setloading_text(false));
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleReset = () => {
        setSelectedDepartments(departments);
        setSelectedDischargeTypes([]);
        setFactor('department');
        setGroupingType('Monthly');
    };
    console.log(factor)
    const getChartTitle = () => {
        const factorName = factor.charAt(0).toUpperCase() + factor.slice(1);
        let departmentInfo = selectedDepartments.length === 0 
            ? "No Departments" 
            : selectedDepartments.length === departments.length 
                ? "All Departments" 
                : `${selectedDepartments.length} Selected Department${selectedDepartments.length > 1 ? 's' : ''}`;
        
        let dischargeTypeInfo = selectedDischargeTypes.length === 0
            ? "No Discharge Types"
            : selectedDischargeTypes.length === dischargeTypes.length 
                ? "All Discharge Types" 
                : `${selectedDischargeTypes.length} Selected Discharge Type${selectedDischargeTypes.length > 1 ? 's' : ''}`;

        let line1, line2;
        switch (factor) {
            case 'department':
                line1 = `Department Wise Discharge Count`;
                line2 = `for ${dischargeTypeInfo}`;
                break;
            case 'dischargeType':
                line1 = `Discharge Type Wise Count`;
                line2 = `for ${departmentInfo}`;
                break;
            default:
                line1 = `${factorName} Wise Discharge Count`;
                line2 = '';
        }
        return [line1, line2];
    };

    const [titleLine1, titleLine2] = getChartTitle();

    return (
        <div className={styles.outerContainer}>
            <div className={styles.titleContainer}>
                <Title level={4}>{titleLine1}</Title>
                <Title level={5}>{titleLine2}</Title>
            </div>

            <div className={styles.container}>
                <div className={styles.leftPanel}>
                    <div className={styles.selectWrapper}>
                        <div className={styles.labelWrapper}>
                            <Text strong>Departments</Text>
                            <Radio checked={factor === 'department'} onChange={() => setFactor('department')} disabled={loading} />
                        </div>
                        <Select
                            mode="multiple"
                            placeholder="Select departments"
                            value={selectedDepartments}
                            onChange={setSelectedDepartments}
                            className={styles.styledSelect}
                            maxTagCount={1}
                            maxTagPlaceholder={(omittedValues) => `+${omittedValues.length} more`}
                            disabled={loading}
                        >
                            {departments.map((dept, index) => (
                                <Option key={index} value={dept}>{dept}</Option>
                            ))}
                        </Select>
                    </div>

                    <div className={styles.selectWrapper}>
                        <div className={styles.labelWrapper}>
                            <Text strong>Discharge Types</Text>
                            <Radio checked={factor === 'dischargeType'} onChange={() => setFactor('dischargeType')} disabled={loading} />
                        </div>
                        <Select
                            mode="multiple"
                            placeholder="Select discharge types"
                            value={selectedDischargeTypes}
                            onChange={setSelectedDischargeTypes}
                            className={styles.styledSelect}
                            maxTagCount={1}
                            maxTagPlaceholder={(omittedValues) => `+${omittedValues.length} more`}
                            disabled={loading}
                        >
                            {dischargeTypes.map((type, index) => (
                                <Option key={index} value={type}>{type}</Option>
                            ))}
                        </Select>
                    </div>

                    <div className={styles.buttonGroup}>
                        <Button 
                            type="primary" 
                            icon={<SearchOutlined />} 
                            onClick={fetchData} 
                            className={styles.iconButton}
                            disabled={loading}
                        />
                        <Button 
                            icon={<UndoOutlined />} 
                            onClick={handleReset} 
                            className={styles.iconButton}
                            disabled={loading}
                        />
                    </div>
                </div>
                <div className={styles.rightPanel}>
                    {loading ? (
                        <div className={styles.loadingContainer}>
                            <Spin size="large" />
                            <Text>Loading data...</Text>
                        </div>
                    ) : (
                        <FlexiblePlotlyChart
                            data={pieChartData}
                            chartType="pie"
                            issmallfont={true}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default DischargeStatusSelector;