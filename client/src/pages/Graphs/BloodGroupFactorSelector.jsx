import React, { useState, useEffect } from 'react';
import { Select, Radio, Typography, Button, Spin } from 'antd';
import { SearchOutlined, UndoOutlined } from '@ant-design/icons';
import FlexiblePlotlyChart from "../Graphs/FlexibleChart";
import { formatDataForPieChart } from '../Functions_Files/file_functions';
import { useDispatch, useSelector } from 'react-redux';
import styles from './BloodGroupSelector.module.css';
import { setloading_text } from '../../state/filtersSlice';
import axios from 'axios';
import { getBloodGroupData } from '../Functions_Files/Fetchdata';
const { Option } = Select;
const { Title, Text } = Typography;

const BloodGroupSelector = () => {
  const [displayFactor, setDisplayFactor] = useState('DepartmentName');
  const department = useSelector((state) => state.filter.department);
  const from_date = useSelector((state) => state.filter.from_date || '').replace(/\//g, '-');
  const to_date = useSelector((state) => state.filter.to_date || '').replace(/\//g, '-');
  const group = useSelector((state) => state.filter.group);
  const departments = department ? department.split(',').map(d => d.trim()) : [];
  const [loading, setLoading] = useState(false);
  const [selectedDepartments, setSelectedDepartments] = useState(departments);
  const [selectedBloodGroups, setSelectedBloodGroups] = useState(['A+ve', 'A-ve', 'B+ve', 'B-ve', 'AB+ve', 'AB-ve', 'O+ve', 'O-ve']);
  const [factor, setFactor] = useState('DepartmentName');
  const [pieChartData, setPieChartData] = useState([]);
  const token = useSelector((state) => state.user.token);
  const dispatch = useDispatch();

  const fetchData = async () => {
    setLoading(true);
    dispatch(setloading_text(true));
    try {
      if (selectedDepartments.length === 0 || selectedBloodGroups.length === 0) {
        setPieChartData([]);
      } else {
        console.log(factor)
        const encodedBloodGroups = selectedBloodGroups.map(bg => encodeURIComponent(bg));
        const res = await getBloodGroupData(
          from_date,
          to_date,
          selectedDepartments,
          encodedBloodGroups,
          factor,
          group,
          token
        );
        setPieChartData(formatDataForPieChart(res.data));
      }
      setDisplayFactor(factor);
    } catch (error) {
      console.error('Error in fetching data:', error);
      // You might want to add some error handling here, e.g., showing an error message to the user
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
    setSelectedBloodGroups(['A+ve', 'A-ve', 'B+ve', 'B-ve', 'AB+ve', 'AB-ve', 'O+ve', 'O-ve']);
    setFactor('DepartmentName');
  };

  const getChartTitle = () => {
    const factorName = factor === 'DepartmentName' ? 'Department' : 'Blood Group';
    let departmentInfo = selectedDepartments.length === 0 
      ? "No Departments" 
      : selectedDepartments.length === departments.length 
        ? "All Departments" 
        : `${selectedDepartments.length} Selected Department${selectedDepartments.length > 1 ? 's' : ''}`;
    
    let bloodGroupInfo = selectedBloodGroups.length === 0
      ? "No Blood Groups"
      : selectedBloodGroups.length === 8 
        ? "All Blood Groups" 
        : `${selectedBloodGroups.length} Selected Blood Group${selectedBloodGroups.length > 1 ? 's' : ''}`;

    let line1 = `${factorName} wise Count`;
    let line2 = factor === 'DepartmentName' 
      ? `for ${bloodGroupInfo}` 
      : `for ${departmentInfo}`;

    return [line1, line2];
  };

  const [titleLine1, titleLine2] = getChartTitle();
  console.log(factor)
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
              <Radio checked={factor === 'DepartmentName'} onChange={() => setFactor('DepartmentName')} disabled={loading} />
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
              <Text strong>Blood Group</Text>
              <Radio checked={factor === 'bloodGroup'} onChange={() => setFactor('bloodGroup')} disabled={loading} />
            </div>
            <Select
              mode="multiple"
              placeholder="Select blood groups"
              value={selectedBloodGroups}
              onChange={setSelectedBloodGroups}
              className={styles.styledSelect}
              disabled={loading}
            >
              {['A+ve', 'A-ve', 'B+ve', 'B-ve', 'AB+ve', 'AB-ve', 'O+ve', 'O-ve'].map((bg) => (
                <Option key={bg} value={bg}>{bg}</Option>
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

export default BloodGroupSelector;