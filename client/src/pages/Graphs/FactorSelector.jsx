import React, { useState, useEffect } from 'react';
import { Select, Radio, Typography, Button, Spin } from 'antd';
import { SearchOutlined, UndoOutlined } from '@ant-design/icons';
import FlexiblePlotlyChart from "../Graphs/FlexibleChart";
import { formatDataForPieChart } from '../Functions_Files/file_functions';
import { useDispatch, useSelector } from 'react-redux';
import styles from './FactorSelector.module.css';
import { setloading_text } from '../../state/filtersSlice';
import { getMultiData } from '../Functions_Files/Fetchdata';

const { Option } = Select;
const { Text } = Typography;

const FactorSelector = () => {
  const [displayFactor, setDisplayFactor] = useState('department');
  const department = useSelector((state) => state.filter.department);
  const from_date = useSelector((state) => state.filter.from_date || '').replace(/\//g, '-');
  const to_date = useSelector((state) => state.filter.to_date || '').replace(/\//g, '-');
  const group = useSelector((state) => state.filter.group);
  const departments = department ? department.split(',').map(d => d.trim()) : [];
  const [loading, setLoading] = useState(false);
  const [selectedDepartments, setSelectedDepartments] = useState(departments);
  const [selectedGenders, setSelectedGenders] = useState(['M', 'F', 'Others']);
  const [selectedVisitTypes, setSelectedVisitTypes] = useState(['IP', 'OP']);
  const [factor, setFactor] = useState('department');
  const [pieChartData, setPieChartData] = useState([]);
  const token = useSelector((state) => state.user.token);
  const dispatch = useDispatch();

  const fetchData = async () => {
    setLoading(true);
    dispatch(setloading_text(true));
    try {
      const res = await getMultiData(from_date, to_date, selectedDepartments, selectedGenders, selectedVisitTypes, factor, group, token);
      setPieChartData(formatDataForPieChart(res.data));
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
    setSelectedGenders(['M', 'F', 'Others']);
    setSelectedVisitTypes(['IP', 'OP']);
    setFactor('department');
  };

  return (
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
            <Text strong>Gender</Text>
            <Radio checked={factor === 'gender'} onChange={() => setFactor('gender')} disabled={loading} />
          </div>
          <Select
            mode="multiple"
            placeholder="Select genders"
            value={selectedGenders}
            onChange={setSelectedGenders}
            className={styles.styledSelect}
            disabled={loading}
          >
            <Option value="M">Male</Option>
            <Option value="F">Female</Option>
            <Option value="Others">Others</Option>
          </Select>
        </div>

        <div className={styles.selectWrapper}>
          <div className={styles.labelWrapper}>
            <Text strong>Visit Type</Text>
            <Radio checked={factor === 'visitType'} onChange={() => setFactor('visitType')} disabled={loading} />
          </div>
          <Select
            mode="multiple"
            placeholder="Select visit types"
            value={selectedVisitTypes}
            onChange={setSelectedVisitTypes}
            className={styles.styledSelect}
            disabled={loading}
          >
            <Option value="IP">Inpatient</Option>
            <Option value="OP">Outpatient</Option>
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
            chartTitle={`Distribution by ${displayFactor}`}
            chartType="pie"
          />
        )}
      </div>
    </div>
  );
};

export default FactorSelector;