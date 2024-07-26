import React, { useEffect, useState, useCallback, memo } from "react";
import GroupedBarChartConn from "../Graphs/GroupedBarChartConn";
import LineChart from "../Graphs/LineChart";
import PieChart from "../Graphs/PieChart";
import GroupedBarChart from "../Graphs/GroupedBarChart";
import Styles from './Home.module.css'
import { genderCount, genderDistribution } from '../Graphs/data/Homedata'
import { getdata_home } from "../Functions_Files/Fetchdata";
import { useDispatch, useSelector } from 'react-redux';
import FlexiblePlotlyChart from "../Graphs/FlexibleChart";
import ClipLoader from "react-spinners/ClipLoader";
import { setloading_text } from "../../state/filtersSlice";
import { formatDataForPieChart } from "../Functions_Files/file_functions";
import Switch from '@mui/material/Switch';
import { message } from "antd";
const useWindowResize = (callback, deps) => {
    const handleResize = useCallback(() => {
        callback();
    }, [callback]);

    useEffect(() => {
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [...deps, handleResize]);
};



const Home = () => {
    const currentTheme = useSelector((state) => state.graph.currentTheme);
    const [themeKey, setThemeKey] = useState(0);
    const [checked, setChecked] = React.useState(true);
    const handleChange = (e) => {
        setChecked(e.target.checked);
        if (e.target.checked) message.info("Pie chart showing data for Gender Count")
        else message.info("Pie chart showing data for Visits vs admissions count")
    };
    useEffect(() => {
        setThemeKey(prevKey => prevKey + 1);
    }, [currentTheme]);
    const from_date = useSelector((state) => state.filter.from_date || '').replace(/\//g, '-');
    const to_date = useSelector((state) => state.filter.to_date || '').replace(/\//g, '-');
    const group = useSelector((state) => state.filter.group);
    const department = useSelector((state) => state.filter.department) || '';

    const [selectedBar, setSelectedBar] = useState(null);
    const [pieChartData, setPieChartData] = useState();
    const [renderCount, setRenderCount] = useState(0);
    const [small, setsmall] = useState(false);

    const [loading, setloading] = useState(false);
    const handleWindowResize = useCallback(() => {
        setRenderCount((prevCount) => prevCount + 1);
    }, []);

    useWindowResize(handleWindowResize, []);

    //fetching data for homepage
    const [data, setData] = useState()
    const token = useSelector((state) => state.user.token);

    const Userselection = useSelector((state) => state.user.user);
    // console.log("data in home:", Userselection)
    // console.log(Userselection?.bio.home)
    const dispatch = useDispatch();
    const fetchData = async () => {
        dispatch(setloading_text(true))
        try {
            setloading(true)
            console.log(group)
            const res = await getdata_home(from_date, to_date, department, group, token);
            setData(res.data);
            // console.log(res.data);
        } catch (error) {
            console.error('Error in fetching data:', error);
        }
        setloading(false)
        dispatch(setloading_text(false))
    };
    useEffect(() => {
        fetchData();
    }, [department, group, from_date, to_date]);

    const departmentWisePatientCount = data?.department_wise_patient_count || [];
    const visitVsAdmissions = data?.visits_vs_admissions || [];
    const departmentWisePatients = data?.department_wise_patients || [];
    const genderCount = data?.gender_count || [];
    const admissioncount = data?.label.admissions || 0;
    const visitcount = data?.label.visits || 0;
    const inpatient_outpatient = data?.inpatient_outpatient || [];
    const patientcount = data?.label.patients || 0;

    useEffect(() => {
        console.log('useEffect triggered. selectedBar:', selectedBar);
        if (selectedBar !== null) {
            console.log('selectedBar is not null, processing...');
            const filteredGenderCount = selectedBar.map(item => ({
                name: item.name,
                value: item.y
            }));

            console.log('Filtered gender count:', filteredGenderCount);
            const formattedData = formatDataForPieChart(filteredGenderCount);
            console.log('Formatted data for pie chart:', formattedData);
            setPieChartData(formattedData);
            setsmall(true)
        } else {
            console.log('selectedBar is null, using default data');
            if (data?.gender_distribution) {
                const formattedData = formatDataForPieChart(data.gender_distribution);
                console.log('Formatted default data for pie chart:', formattedData);
                setPieChartData(formattedData);
                setsmall(false)
            } else {
                console.log('No default data available, setting pieChartData to null');
                setPieChartData(null);
            }
        }
    }, [selectedBar, data]);
    const theme = useSelector((state => state.user.user.theme))
    return (
        <>
            {loading ?
                <div className={Styles.cont_preloader}>
                    < ClipLoader className={`${theme === 'dark' && Styles.cont_preloader_load}`} />
                </div>
                :
                <div className={Styles.cont}>
                    <div className={Styles.up}>
                        <p className={Styles.up_count}>Visits:&nbsp; <strong>{visitcount}</strong></p>
                        <p className={`${Styles.up_count} ${Styles.up_count2} `}>Admissions:&nbsp; <strong>{admissioncount}</strong></p>
                        <p className={`${Styles.up_count} ${Styles.up_count3} `}>Patients:&nbsp; <strong>{patientcount}</strong></p>
                    </div>

                    <div className={Styles.down}>
                        <div className={Styles.down_up}>
                            <div className={Styles.down_upchild}>
                                <FlexiblePlotlyChart
                                    key={`chart-${themeKey}`}
                                    chartType={Userselection?.bio?.home?.departmentWisePatientCount?.SelectedType}
                                    data={departmentWisePatientCount}
                                    chartTitle="Department wise visits count"
                                    xAxisTitle="Time"
                                    yAxisTitle="Count"
                                />
                            </div>
                            <div className={Styles.down_upchild}>
                                <FlexiblePlotlyChart
                                    key={`chart-${themeKey}`}
                                    chartType={Userselection?.bio?.home?.visitsVsAdmissions?.SelectedType}
                                    data={visitVsAdmissions}
                                    chartTitle="Visits vs Admissions count"
                                    xAxisTitle="Time"
                                    yAxisTitle="Count"
                                />

                            </div>
                        </div>
                        <div className={Styles.down_down}>
                            <div className={Styles.down_downchild1}>
                                <FlexiblePlotlyChart
                                    key={`chart-${themeKey}`}
                                    data={genderCount}
                                    chartTitle="Gender wise visits count"
                                    xAxisTitle="Time"
                                    yAxisTitle="Count"
                                    chartType={Userselection?.bio?.home?.genderCount?.SelectedType}
                                    onBarClick={(filteredData) => {
                                        console.log('Clicked bar data:', filteredData);
                                        setSelectedBar(filteredData);
                                    }}
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
                                            key={`chart-${themeKey}`}
                                            data={pieChartData}
                                            chartTitle={`Gender wise visits count${selectedBar ? ` for ${selectedBar[0].x}` : ''}`}
                                            chartType={Userselection?.bio?.home?.genderDistribution?.SelectedType}
                                            issmallfont={small}
                                        />
                                        :
                                        <FlexiblePlotlyChart
                                            key={`chart-${themeKey}`}
                                            data={formatDataForPieChart(inpatient_outpatient)}
                                            chartTitle={`Visits vs admissions count${selectedBar ? ` for ${selectedBar[0].x}` : ''}`}
                                            chartType={Userselection?.bio?.home?.genderDistribution?.SelectedType}
                                        />
                                    }
                                </>
                                <>
                                    <FlexiblePlotlyChart
                                        key={`chart-${themeKey}`}
                                        data={formatDataForPieChart(departmentWisePatients)}
                                        chartTitle="Department wise visits count"
                                        chartType={Userselection?.bio?.home?.departmentWisePatients?.SelectedType}
                                    />
                                </>
                            </div>
                        </div>
                    </div>
                </div>}
        </>
    )
}

export default Home;