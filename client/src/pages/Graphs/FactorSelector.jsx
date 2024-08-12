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
const { Title, Text } = Typography;


const FactorSelector = () => {
  const [displayFactor, setDisplayFactor] = useState('department');
  const department = useSelector((state) => state.filter.department);
  const from_date = useSelector((state) => state.filter.from_date || '').replace(/\//g, '-');
  const to_date = useSelector((state) => state.filter.to_date || '').replace(/\//g, '-');
  const group = useSelector((state) => state.filter.group);
  const departments = department ? department.split(',').map(d => d.trim()) : [];
  const [loading, setLoading] = useState(false);
  const [selectedDepartments, setSelectedDepartments] = useState(departments);
  const [selectedGenders, setSelectedGenders] = useState(['M', 'F', 'O']);
  const [selectedVisitTypes, setSelectedVisitTypes] = useState(['IP', 'OP']);
  const [factor, setFactor] = useState('department');
  const [pieChartData, setPieChartData] = useState([]);
  const token = useSelector((state) => state.user.token);
  const dispatch = useDispatch();

  const fetchData = async () => {
    setLoading(true);
    dispatch(setloading_text(true));
    try {
      if (selectedDepartments.length === 0 || selectedGenders.length === 0 || selectedVisitTypes.length === 0) {
        setPieChartData([]);
      } else {
        const res = await getMultiData(from_date, to_date, selectedDepartments, selectedGenders, selectedVisitTypes, factor, group, token);
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
    setSelectedGenders(['M', 'F', 'O']);
    setSelectedVisitTypes(['IP', 'OP']);
    setFactor('department');
  };
  const getChartTitle = () => {
    const factorName = factor.charAt(0).toUpperCase() + factor.slice(1);
    let departmentInfo = selectedDepartments.length === 0 
      ? "No Departments" 
      : selectedDepartments.length === departments.length 
        ? "All Departments" 
        : `${selectedDepartments.length} Selected Department${selectedDepartments.length > 1 ? 's' : ''}`;
    
        let genderInfo = selectedGenders.length === 0
        ? "No Genders"
        : selectedGenders.length === 3 
          ? "All Genders" 
          : selectedGenders.map(sg => {
              switch(sg) {
                case 'M': return 'Males';
                case 'F': return 'Females';
                case 'O': return 'Others';
                default: return sg;
              }
            }).join(', ');

    
    let visitTypeInfo = selectedVisitTypes.length === 0
      ? "No Visit Types"
      : selectedVisitTypes.length === 2 
        ? "All Visit Types" 
        : selectedVisitTypes.map(vt => vt === 'IP' ? 'Inpatients' : 'Outpatients').join(', ');

    let line1, line2;
    switch (factor) {
      case 'department':
        line1 = `Department Count`;
        line2 = `for ${genderInfo} and ${visitTypeInfo}`;
        break;
      case 'gender':
        line1 = `Gender Count`;
        line2 = `for ${departmentInfo} and ${visitTypeInfo}`;
        break;
      case 'visitType':
        line1 = `Visit Type Count`;
        line2 = `for ${departmentInfo} and ${genderInfo}`;
        break;
      default:
        line1 = `${factorName} Count`;
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
            <Option value="O">Others</Option>
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
            chartType="pie"
            issmallfont={true}
          />
        )}
      </div>
    </div>
    </div>
  );
};

export default FactorSelector;