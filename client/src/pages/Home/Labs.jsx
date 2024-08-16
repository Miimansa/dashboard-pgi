import React from "react";
import { useState, useEffect } from "react";
import Styles from './Labs.module.css'
import FlexiblePlotlyChart from "../Graphs/FlexibleChart";
import { useDispatch, useSelector } from "react-redux";
import { setloading_text } from "../../state/filtersSlice";
import { getdata_lab, gettypes_test, updateDefaultValues, getDefaultValues } from "../Functions_Files/Fetchdata";
import ClipLoader from "react-spinners/ClipLoader";
import { formatDataForPieChart } from "../Functions_Files/file_functions";
import { colourStyles } from "../Functions_Files/filters_data";
import Select from 'react-select'
import Switch from '@mui/material/Switch';
import LabFactorSelector from "../Graphs/LabTypeAgg";
import { message, Button,Select as AntSelect } from "antd";

const { Option } = AntSelect;
const options = [
    { value: 'chart1', label: 'chart1' },
    { value: 'chart2', label: 'chart2' },
    { value: 'chart3', label: 'chart3'  },
    { value: 'chart4', label: 'chart4'  },
    { value: 'None', label: 'None' }
];


const Labs = () => {
    const [typetest, settypetest] = useState([]);
    const [type, setType] = useState([]);
    const [type_string, settype_string] = useState();
    const [checked, setChecked] = React.useState(true);
    const [loading, setloading] = useState(true);
    const [data, setdata] = useState(null);
    const [selectedChart, setSelectedChart] = useState(null);
    const [showFullScreenChart, setShowFullScreenChart] = useState(false);

    const currentTheme = useSelector((state) => state.graph.currentTheme);
    const [themeKey, setThemeKey] = useState(0);
    const Userselection = useSelector((state) => state.user.user);
    const from_date = useSelector((state) => state.filter.from_date || '').replace(/\//g, '-');
    const to_date = useSelector((state) => state.filter.to_date || '').replace(/\//g, '-');
    const group = useSelector((state) => state.filter.group);
    const department = useSelector((state) => state.filter.department) || '';
    const token = useSelector((state) => state.user.token);
    const theme = useSelector((state => state.user.user.theme));
    const dispatch = useDispatch();
    console.log(selectedChart)
    console.log(showFullScreenChart)
    console.log(typetest)
    useEffect(() => {
        setThemeKey(prevKey => prevKey + 1);
    }, [currentTheme]);

    const handleChange = (e) => {
        setChecked(e.target.checked);
        if (e.target.checked) message.info("Department wise lab patient count")
        else message.info("Lab Count Aggregator")
    };

    const setSessionLabTypes = (types) => {
        localStorage.setItem('labTypes', JSON.stringify(types));
    };

    const getSessionLabTypes = () => {
        const types = localStorage.getItem('labTypes');
        return types ? JSON.parse(types) : null;
    };

    const changetypeformat = (data) => {
        const formattedType = data.map(item => ({
            label: item,
            value: item
        }));
        settypetest(formattedType);
    };

    const handleType = () => {
        const typeString = type.map((item) => item.label).toString();
        settype_string(typeString);
        setSessionLabTypes(type.map(item => item.label));
    };

    useEffect(() => {
        fetchData(true);
    }, []);

    useEffect(() => {
        if (type_string !== undefined) {
            fetchData();
        }
    }, [department, group, from_date, to_date, type_string]);

    const fetchData = async (initialLoad = false) => {
        dispatch(setloading_text(true))
        setloading(true)
        try {
            let currentTypeString = type_string;
            if (initialLoad || !currentTypeString) {
                currentTypeString = await loadDefaultValues();
                settype_string(currentTypeString);
            }
            const res = await getdata_lab(from_date, to_date, department, group, token, currentTypeString);
            const res_type = await gettypes_test(token);
            changetypeformat(res_type.data);
            setdata(res.data)
            setloading(false)
        } catch (error) {
            console.error('Error in fetching data:', error);
            setloading(false)
        }
        dispatch(setloading_text(false))
    };

    useEffect(() => {
        if (type_string !== undefined) {
            fetchData();
        }
    }, [department, group, from_date, to_date, type_string]);

    const loadDefaultValues = async () => {
        try {
            const sessionTypes = getSessionLabTypes();
            if (sessionTypes) {
                const sessionLabTypes = sessionTypes.map(item => ({
                    label: item,
                    value: item
                }));
                setType(sessionLabTypes);
                return sessionTypes.join(',');
            }

            const defaultValues = await getDefaultValues(token);
            if (defaultValues.default_labtypes) {
                const defaultLabTypes = defaultValues.default_labtypes.map(item => ({
                    label: item,
                    value: item
                }));
                setType(defaultLabTypes);
                return defaultValues.default_labtypes.join(',');
            }
            return '';
        } catch (error) {
            console.error('Error loading default values:', error);
            message.error("Failed to load default lab types");
            return '';
        }
    };

    const handleSetDefault = async () => {
        try {
            const defaultLabTypes = type.map(item => item.value);
            await updateDefaultValues(token, { default_labtypes: defaultLabTypes });
            const typeString = defaultLabTypes.join(',');
            settype_string(typeString);
            setSessionLabTypes(defaultLabTypes);
            message.success("Default lab types updated successfully");
        } catch (error) {
            console.error('Error setting default values:', error);
            message.error("Failed to update default lab types");
        }
    };

    const handleChartChange = value => {
        setSelectedChart(value);
        if(value=='None')
            setShowFullScreenChart(false);
    };
    const handleViewChart = () => {
        setShowFullScreenChart(true);
    };

    return (<>
        {loading ?
            <div className={Styles.cont_preloader}>
                < ClipLoader className={`${theme === 'dark' && Styles.cont_preloader_load}`} />
            </div>
            :
            <div className={Styles.cont}>
                <div className={Styles.up}>
                    <div className={Styles.dropdown}>
                            <AntSelect
                                style={{ width: 200 }}
                                placeholder="Full Screen Chart"
                                onChange={handleChartChange}
                            >
                                <Option value="chart1">Chart 1</Option>
                                <Option value="chart2">Chart 2</Option>
                                <Option value="chart3">Chart 3</Option>
                                <Option value="chart4">Chart 4</Option>
                                <Option value="None">None</Option>
                            </AntSelect>
                            <Button onClick={handleViewChart}>View</Button>
                        </div>
                </div>
                <div className={Styles.down}>
                    
                    {showFullScreenChart && selectedChart !== 'None' ? (
                        selectedChart === "chart1" ? (
                            <FlexiblePlotlyChart
                                key={`chart-${themeKey}`}
                                data={data?.lab_order_count}
                                chartTitle="Lab order count"
                                xAxisTitle="Time"
                                yAxisTitle="Count"
                                chartType={Userselection?.bio?.labs?.LabOrderCount?.SelectedType}
                            />
                        ) : selectedChart === "chart2" ? (
                            <FlexiblePlotlyChart
                                key={`chart-${themeKey}`}
                                data={data?.lab_orders_by_department}
                                chartTitle="Department wise lab orders count"
                                xAxisTitle="Time"
                                yAxisTitle="Count"
                                chartType={Userselection?.bio?.labs?.labOrdersByDepartment?.SelectedType}
                            />
                        ) : selectedChart === "chart3" ? (
                            <>
                            <div className={Styles.multi_select}>
                        <Select
                            onChange={(selectedOptions) => {
                                setType(selectedOptions);
                            }}
                            className={Styles.multi_select_in}
                            placeholder="Select disease type..."
                            styles={colourStyles}
                            isMulti
                            options={typetest}
                            value={type}
                        />
                        <button onClick={handleType}>Reload</button>
                        <button onClick={handleSetDefault}>Set</button>
                    </div>
                            <FlexiblePlotlyChart
                                data={data?.monthly_lab_test_counts}
                                key={`chart-${themeKey}`}
                                chartTitle="Lab Test types count"
                                xAxisTitle="Time"
                                yAxisTitle="Count"
                                chartType={Userselection?.bio?.labs?.monthlyLabTestCounts?.SelectedType}
                            />
                            </>
                        ) : selectedChart === "chart4" ? (
                            
                            <LabFactorSelector testTypes={typetest.map(item => item.label)} />
                        ) : null
                    ) : (
                        <>
                            <div className={Styles.down_up}>
                                <div className={Styles.down_upchild}>
                                    <FlexiblePlotlyChart
                                        key={`chart-${themeKey}`}
                                        data={data?.lab_order_count}
                                        chartTitle="Lab order count"
                                        xAxisTitle="Time"
                                        yAxisTitle="Count"
                                        chartType={Userselection?.bio?.labs?.LabOrderCount?.SelectedType}
                                    />
                                </div>
                                <div className={Styles.down_upchild}>
                                    <FlexiblePlotlyChart
                                        key={`chart-${themeKey}`}
                                        data={data?.lab_orders_by_department}
                                        chartTitle="Department wise lab orders count"
                                        xAxisTitle="Time"
                                        yAxisTitle="Count"
                                        chartType={Userselection?.bio?.labs?.labOrdersByDepartment?.SelectedType}
                                    />
                                </div>
                            </div>
                            <div className={Styles.multi_select}>
                        <Select
                            onChange={(selectedOptions) => {
                                setType(selectedOptions);
                            }}
                            className={Styles.multi_select_in}
                            placeholder="Select disease type..."
                            styles={colourStyles}
                            isMulti
                            options={typetest}
                            value={type}
                        />
                        <button onClick={handleType}>Reload</button>
                        <button onClick={handleSetDefault}>Set</button>
                    </div>
                            <div className={Styles.down_down}>
                            
                                <div className={Styles.down_downchild1}>
                                    <FlexiblePlotlyChart
                                        data={data?.monthly_lab_test_counts}
                                        key={`chart-${themeKey}`}
                                        chartTitle="Lab Test types count"
                                        xAxisTitle="Time"
                                        yAxisTitle="Count"
                                        chartType={Userselection?.bio?.labs?.monthlyLabTestCounts?.SelectedType}
                                    />
                                </div>
                                <div className={Styles.down_downchild2}>
                                    <Switch
                                        checked={checked}
                                        onChange={handleChange}
                                        inputProps={{ 'aria-label': 'controlled' }}
                                    />
                                    <>
                                        {checked ?
                                            
                                            <LabFactorSelector testTypes={typetest.map(item => item.label)} />
                                            :
                                            <FlexiblePlotlyChart
                                                data={formatDataForPieChart(data?.patient_count_by_total_department)}
                                                chartTitle={"Department wise lab orders"}
                                                chartType={Userselection?.bio?.labs?.patientCountByDepartment?.SelectedType}
                                                key={`chart-${themeKey}`}
                                            />
                                        }
                                    </>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        }
    </>
    );
}
export default Labs;