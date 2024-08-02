import React from "react";

import { useState, useEffect } from "react";
import Styles from './Labs.module.css'
import FlexiblePlotlyChart from "../Graphs/FlexibleChart";
import { useDispatch, useSelector } from "react-redux";
import { setloading_text } from "../../state/filtersSlice";
import { getdata_lab, gettypes_test } from "../Functions_Files/Fetchdata";
import ClipLoader from "react-spinners/ClipLoader";
import { formatDataForPieChart } from "../Functions_Files/file_functions";
import { colourStyles } from "../Functions_Files/filters_data";
import Select from 'react-select'
import Switch from '@mui/material/Switch';
import { message } from "antd";

const Labs = () => {
    const loadSelectedTests = () => {
        const savedTests = localStorage.getItem('selectedLabTests');
        return savedTests ? JSON.parse(savedTests) : [null];
      };
    const currentTheme = useSelector((state) => state.graph.currentTheme);
    const [themeKey, setThemeKey] = useState(0);
    const [typetest, settypetest] = useState([]);
    const [type, setType] = useState(() => {
        const savedTests = loadSelectedTests();
        return savedTests || ['initial'];
      });
    const [type_string, settype_string] = useState();
    const [checked, setChecked] = React.useState(true);
    const handleChange = (e) => {
        setChecked(e.target.checked);
        if (e.target.checked) message.info("Pie chart showing data for Gender Count")
        else message.info("Pie chart showing data for Visits vs admissions count")
    };
    const changetypeformat = (data) => {
        const formattedType = data.map(item => ({
          label: item,
          value: item
        }));
        settypetest(formattedType);
        
        const savedTests = loadSelectedTests();
        if (savedTests) {
          setType(savedTests);
        } else if (type[0] === 'initial') {
          setType(formattedType.slice(0, 5));
        }
      };
    const handleType = () => {
        const typeString = type.map((item) => item.label).toString();
        settype_string(typeString);
        saveSelectedTests(type);
      };
    useEffect(() => {
        setThemeKey(prevKey => prevKey + 1);
    }, [currentTheme]);
    const Userselection = useSelector((state) => state.user.user);
    console.log(Userselection)
    //fetching data 
    const from_date = useSelector((state) => state.filter.from_date || '').replace(/\//g, '-');
    const to_date = useSelector((state) => state.filter.to_date || '').replace(/\//g, '-');
    const group = useSelector((state) => state.filter.group);
    const department = useSelector((state) => state.filter.department) || '';
    const token = useSelector((state) => state.user.token);
    const [data, setdata] = useState(null);
    const dispatch = useDispatch();
    const fetchData = async () => {
        dispatch(setloading_text(true))
        setloading(true)
        try {
            const res = await getdata_lab(from_date, to_date, department, group, token, type_string);
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
        fetchData();
    }, [department, group, from_date, to_date, type_string]);
    const [loading, setloading] = useState(true);
    const theme = useSelector((state => state.user.user.theme))
    const saveSelectedTests = (tests) => {
        localStorage.setItem('selectedLabTests', JSON.stringify(tests));
      };
      
      
    return (<>
        {loading ?
            <div className={Styles.cont_preloader}>
                < ClipLoader className={`${theme === 'dark' && Styles.cont_preloader_load}`} />
            </div>
            :
            <div className={Styles.cont}>
                <div className={Styles.down}>
                    <div className={Styles.down_up}>
                        <div className={Styles.down_upchild}>
                            <FlexiblePlotlyChart
                                key={`chart-${themeKey}`}
                                data={data?.lab_order_count}
                                chartTitle="Lab order count"
                                xAxisTitle="Time"
                                yAxisTitle="Count"
                                chartType={Userselection?.bio?.labs?.LabOrderCount?.SelectedType}
                            // chartType={"line"}

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
                            // chartType={"line"}
                            />
                        </div>
                    </div>
                    <div className={Styles.multi_select}>
                    <Select
                        onChange={(selectedOptions) => {
                            setType(selectedOptions);
                            saveSelectedTests(selectedOptions);
                        }}
                        className={Styles.multi_select_in}
                        placeholder="Select disease type..."
                        styles={colourStyles}
                        isMulti
                        options={typetest}
                        value={type}
                        />
                        <button onClick={handleType}>Reload</button>
                    </div>
                    <div className={Styles.down_down}>
                        <div className={Styles.down_downchild1}>
                            <FlexiblePlotlyChart data={data?.monthly_lab_test_counts}
                                key={`chart-${themeKey}`}
                                chartTitle="Lab Test types count"
                                xAxisTitle="Time"
                                yAxisTitle="Count"
                                // chartType={"line"}
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
                                         <FlexiblePlotlyChart
                                         data={formatDataForPieChart(data?.patient_count_by_department)}
                                         chartTitle={"Lab Test wise lab orders"}
                                         chartType={Userselection?.bio?.labs?.patientCountByDepartment?.SelectedType}
                                         // chartType={"pie"}
                                         key={`chart-${themeKey}`}
                                     />
                                        :
                                        <FlexiblePlotlyChart
                                        data={formatDataForPieChart(data?.patient_count_by_total_department)}
                                        chartTitle={"Department wise lab orders"}
                                        chartType={Userselection?.bio?.labs?.patientCountByDepartment?.SelectedType}
                                        // chartType={"pie"}
                                        key={`chart-${themeKey}`}
                                    />
                                    }
                                </>
                           

                        </div>
                    </div>
                </div>
            </div>
        }
    </>
    );
}
export default Labs;