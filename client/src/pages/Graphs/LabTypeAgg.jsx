import React, { useState, useEffect } from 'react';
import { Select, Radio, Typography, Button, Spin } from 'antd';
import { SearchOutlined, UndoOutlined } from '@ant-design/icons';
import FlexiblePlotlyChart from "../Graphs/FlexibleChart";
import { formatDataForPieChart } from '../Functions_Files/file_functions';
import { useDispatch, useSelector } from 'react-redux';
import styles from './LabFactorSelector.module.css';
import { setloading_text } from '../../state/filtersSlice';
import { getLabData } from '../Functions_Files/Fetchdata';
const { Option } = Select;
const { Title, Text } = Typography;


const LabFactorSelector = ({ testTypes }) => {
    const [displayFactor, setDisplayFactor] = useState('department');
    const department = useSelector((state) => state.filter.department);
    const from_date = useSelector((state) => state.filter.from_date || '').replace(/\//g, '-');
    const to_date = useSelector((state) => state.filter.to_date || '').replace(/\//g, '-');
    const departments = department ? department.split(',').map(d => d.trim()) : [];
    const [loading, setLoading] = useState(false);
    const [selectedDepartments, setSelectedDepartments] = useState(departments);
    const [selectedTestTypes, setSelectedTestTypes] = useState([]);
    const [factor, setFactor] = useState('department');
    const [groupingType, setGroupingType] = useState('Monthly');
    const [pieChartData, setPieChartData] = useState([]);
    const token = useSelector((state) => state.user.token);
    const dispatch = useDispatch();

    const fetchData = async () => {
        setLoading(true);
        dispatch(setloading_text(true));
        try {
            if (selectedDepartments.length === 0 || selectedTestTypes.length === 0) {
                setPieChartData([]);
            } else {
                const res = await getLabData(from_date, to_date, selectedDepartments.join(','), selectedTestTypes.join(','),factor, groupingType, token);
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
        setSelectedTestTypes([]);
        setFactor('department');
    };

    const getChartTitle = () => {
        const factorName = factor.charAt(0).toUpperCase() + factor.slice(1);
        let departmentInfo = selectedDepartments.length === 0 
            ? "No Departments" 
            : selectedDepartments.length === departments.length 
                ? "All Departments" 
                : `${selectedDepartments.length} Selected Department${selectedDepartments.length > 1 ? 's' : ''}`;
        
        let testTypeInfo = selectedTestTypes.length === 0
            ? "No Test Types"
            : selectedTestTypes.length === testTypes.length 
                ? "All Test Types" 
                : `${selectedTestTypes.length} Selected Test Type${selectedTestTypes.length > 1 ? 's' : ''}`;

        let line1, line2;
        switch (factor) {
            case 'department':
                line1 = `Department Lab Record Count`;
                line2 = `for ${testTypeInfo}`;
                break;
            case 'testType':
                line1 = `Test Type Lab Record Count`;
                line2 = `for ${departmentInfo}`;
                break;
            default:
                line1 = `${factorName} Lab Record Count`;
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
                            <Text strong>Test Types</Text>
                            <Radio checked={factor === 'testType'} onChange={() => setFactor('testType')} disabled={loading} />
                        </div>
                        <Select
                            mode="multiple"
                            placeholder="Select test types"
                            value={selectedTestTypes}
                            onChange={setSelectedTestTypes}
                            className={styles.styledSelect}
                            maxTagCount={1}
                            maxTagPlaceholder={(omittedValues) => `+${omittedValues.length} more`}
                            disabled={loading}
                        >
                            {testTypes.map((type, index) => (
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

export default LabFactorSelector;