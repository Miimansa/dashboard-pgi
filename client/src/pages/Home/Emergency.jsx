import React, { useEffect, useState } from "react";
import GroupedBarChartConn from "../Graphs/GroupedBarChartConn";
import PieChart from "../Graphs/PieChart";
import GroupedBarChart from "../Graphs/GroupedBarChart";
import LineChart from "../Graphs/LineChart";
import FlexiblePlotlyChart from "../Graphs/FlexibleChart";
import { uniquePatientCounts, survivalDeathCounts, durationOfStay, genderDistribution, totalPatientCount } from "../Graphs/data/emergencydata";
import Styles from './Emergency.module.css'
import ClipLoader from "react-spinners/ClipLoader";
import { useDispatch, useSelector } from 'react-redux';
import { setloading_text } from "../../state/filtersSlice";
import { getdata_emergency } from "../Functions_Files/Fetchdata";
import { formatDataForPieChart } from "../Functions_Files/file_functions";
import Select from 'react-select';
import { colourStyles } from "../Functions_Files/filters_data";
import { getDischargeType } from "../Functions_Files/Fetchdata";
const Emergency = () => {
    const currentTheme = useSelector((state) => state.graph.currentTheme);
    const [themeKey, setThemeKey] = useState(0);
    useEffect(() => {
        setThemeKey(prevKey => prevKey + 1);
    }, [currentTheme]);
    const Userselection = useSelector((state) => state.user.user);
    console.log(Userselection)
    // console.log(Userselection?.bio?.Emergency?.uniquePatientCounts?.SelectedType)

    //fetching data 
    const from_date = useSelector((state) => state.filter.from_date || '').replace(/\//g, '-');
    const to_date = useSelector((state) => state.filter.to_date || '').replace(/\//g, '-');
    const group = useSelector((state) => state.filter.group);
    const department = useSelector((state) => state.filter.department) || '';
    const token = useSelector((state) => state.user.token);
    const [data, setdata] = useState(null);
    const dispatch = useDispatch();
    const changeTypeFormat = (data) => {
        const formattedType = data.map(item => ({
            label: item,
            value: item
        }));
        setTypeEmergency(formattedType);
        
        const savedTypes = loadSelectedTypes();
        if (savedTypes) {
            setType(savedTypes);
        } else if (type[0] === 'initial') {
            console.log(formattedType.slice(0, 5))
            setType([
                { value: 'Death', label: 'Death' },
                { value: 'Normal Discharge', label: 'Normal Discharge' }
            ]);
        }
    };
    
    const handleType = () => {
        const typeStr = type.map((item) => item.label).toString();
        setTypeString(typeStr);
        saveSelectedTypes(type);
    };
    
    const saveSelectedTypes = (types) => {
        localStorage.setItem('selectedEmergencyTypes', JSON.stringify(types));
    };
    const fetchData = async () => {
        dispatch(setloading_text(true))
        setloading(true)
        try {
            const res = await getdata_emergency(from_date, to_date, department, group, token, typeString);
            const res_type = await getDischargeType(token);
            changeTypeFormat(res_type.data);
            setdata(res.data)
            setloading(false)
        } catch (error) {
            console.error('Error in fetching data:', error);
            setloading(false)
        }
        dispatch(setloading_text(false))
    };
    const loadSelectedTypes = () => {
        const savedTypes = localStorage.getItem('selectedEmergencyTypes');
        return savedTypes ? JSON.parse(savedTypes) : null;
    };
    const [typeEmergency, setTypeEmergency] = useState([]);
const [type, setType] = useState(() => {
    const savedTypes = loadSelectedTypes();
    return savedTypes || ['initial'];
});
const [typeString, setTypeString] = useState(['Normal Discharge','Death']);
useEffect(() => {
    fetchData();
}, [department, group, from_date, to_date, typeString]);
    const [loading, setloading] = useState(true);
    const theme = useSelector((state => state.user.user.theme))
    const admissioncount = data?.label.admissions || 0;
    console.log(data)
    return (<>
        {loading ?
            <div className={Styles.cont_preloader}>
                < ClipLoader className={`${theme === 'dark' && Styles.cont_preloader_load}`} />
            </div>
            :
            <div className={Styles.cont}>
                <div className={Styles.up}>
                    <p className={Styles.up_count}>Admissions: {admissioncount}</p>
                </div>
                <div className={Styles.down}>
                    <div className={Styles.down_up}>
                        <div className={Styles.down_upchild}>
                            <FlexiblePlotlyChart data={data?.uniquePatientCounts}
                                key={`chart-${themeKey}`}
                                chartTitle={"Department wise Patient count"}
                                xAxisTitle={"Date"}
                                yAxisTitle={"Patient counts"}
                                chartType={Userselection?.bio?.emergency?.uniquePatientCounts?.SelectedType}
                            // chartType={"groupedBar"}
                            />
                        </div>
                        <div className={Styles.down_upchild}>
                            {/* this graph will turn to pie chart when single */}
                            <FlexiblePlotlyChart
                                key={`chart-${themeKey}`}
                                data={data?.durationOfStay}
                                chartTitle="Department wise average duration of stay"
                                xAxisTitle="Time"
                                yAxisTitle="Duration (Days)"
                                chartType={Userselection?.bio?.emergency?.durationOfStay?.SelectedType}
                            // chartType={"groupedBar"}
                            />
                        </div>
                    </div>
                    <div className={Styles.multi_select}>
                                <Select
                                    onChange={(selectedOptions) => {
                                        setType(selectedOptions);
                                        saveSelectedTypes(selectedOptions);
                                    }}
                                    className={Styles.multi_select_in}
                                    placeholder="Select emergency type..."
                                    styles={colourStyles}
                                    isMulti
                                    options={typeEmergency}
                                    value={type}
                                />
                                <button onClick={handleType}>Reload</button>
                            </div>
                    <div className={Styles.down_down}>
                        <div className={Styles.down_downchild1}>
                            {/* // this raph will turn to heatmap when single */}
                          
                             <FlexiblePlotlyChart
                                key={`chart-${themeKey}`}
                                data={data?.survivalDeathCounts}
                                chartTitle="Discharge : normal / death"
                                xAxisTitle="Time"
                                yAxisTitle="Patient count"
                                chartType={Userselection?.bio?.emergency?.survivalDeathCounts?.SelectedType}
                            // chartType={"groupedBar"}
                            />
                        </div>
                        <div className={Styles.down_downchild2}>
                            <FlexiblePlotlyChart
                                key={`chart-${themeKey}`}
                                data={formatDataForPieChart(data?.genderDistribution)}
                                chartTitle="Discharge : normal / death"
                                chartType={Userselection?.bio?.emergency?.genderDistribution?.SelectedType}
                            // chartType={"pie"}
                            />
                            <FlexiblePlotlyChart
                                key={`chart-${themeKey}`}
                                data={formatDataForPieChart(data?.totalPatientCount)}
                                chartTitle="Department wise admissions"
                                chartType={Userselection?.bio?.emergency?.totalPatientCount?.SelectedType}
                            // chartType={"pie"}
                            />
                        </div>
                    </div>
                </div>
            </div>
        }
    </>);
}
export default Emergency;