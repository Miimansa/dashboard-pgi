import React, { useEffect, useState } from "react";
import Styles from './Disease.module.css'
import LineChart from "../Graphs/LineChart";
import Select from 'react-select'
import { diseaseCounts, deathTally, patientCountByDisease, genderAgeDistribution, totalSurvivalRate } from '../Graphs/data/diseasedata'
import GaugeChart from "../Graphs/GaugeChart";
import PyramidChart from "../Graphs/PyramidChart";
import { useDispatch, useSelector } from "react-redux";
import { colourStyles, options_disease } from "../Functions_Files/filters_data";
import GroupedBarChart from "../Graphs/GroupedBarChart";
import DiseaseSearchTable from "./DiseaseSearchTable";
import FlexiblePlotlyChart from "../Graphs/FlexibleChart";
import ClipLoader from "react-spinners/ClipLoader";
import { setloading_text } from "../../state/filtersSlice";
import { getdata_disease } from "../Functions_Files/Fetchdata";
import { formatDataForPieChart } from "../Functions_Files/file_functions";
const Disease = () => {
    const currentTheme = useSelector((state) => state.graph.currentTheme);
    const [themeKey, setThemeKey] = useState(0);

    useEffect(() => {
        setThemeKey(prevKey => prevKey + 1);
    }, [currentTheme]);

    const Userselection = useSelector((state) => state.user.user);
    const [disease, setDisease] = useState([]);
    const [showCharts, setShowCharts] = useState(true);
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
            const res = await getdata_disease(from_date, to_date, department, group, token);
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
    }, [department, group, from_date, to_date]);
    const [loading, setloading] = useState(true);
    const theme = useSelector((state => state.user.user.theme))
    console.log(Userselection?.bio?.disease?.genderAgeDistribution?.SelectedType)
    const Charts = () => (
        <div className={Styles.down}>
            <div className={Styles.down_up}>
                <div className={Styles.down_upchild}>
                    <FlexiblePlotlyChart data={data?.diseaseCounts}
                        key={`chart-${themeKey}`}
                        chartTitle={"Patient distribution over diseases"}
                        xAxisTitle={"Date"}
                        yAxisTitle={"Patients"}
                        chartType={Userselection?.bio?.disease?.diseaseCounts?.SelectedType}
                    />
                </div>
                <div className={Styles.down_upchild}>
                    <FlexiblePlotlyChart data={data?.deathTally}
                        key={`chart-${themeKey}`}
                        chartTitle={"Death tally over diseases"}
                        xAxisTitle={"Date"}
                        yAxisTitle={"Patients"}
                        chartType={Userselection?.bio?.disease?.deathTally?.SelectedType} />
                </div>
            </div>
            <div className={Styles.down_down}>
                <div className={Styles.down_downchild1}>
                    <FlexiblePlotlyChart data={data?.patientCountByDisease}
                        key={`chart-${themeKey}`}
                        chartTitle={"Patient distribution over diseases"}
                        xAxisTitle={"Disease"}
                        yAxisTitle={"Patients"}
                        chartType={Userselection?.bio?.disease?.patientCountByDisease?.SelectedType}
                    />
                </div>
                <div className={Styles.down_downchild2}>
                    <FlexiblePlotlyChart data={formatDataForPieChart(data?.genderAgeDistribution)}
                        key={`chart-${themeKey}`}
                        chartTitle={"Male/Female bifurcation in Disease"}
                        xaxisTitle={"Patients"}
                        yaxisTitle={"Age groups"}
                        chartType={Userselection?.bio?.disease?.genderAgeDistribution?.SelectedType}
                    // chartType={"pie"}
                    />
                    <GaugeChart
                        Rate={(data?.totalSurvivalRate) * 0.01}
                    />
                </div>
            </div>
        </div>
    );

    const Table = () => (
        <div className={Styles.table_down}>
            <DiseaseSearchTable className={Styles.table_down} />
        </div>
    );

    return (
        <>
            {loading ?
                <div className={Styles.cont_preloader}>
                    < ClipLoader className={`${theme === 'dark' && Styles.cont_preloader_load}`} />
                </div>
                :
                <div className={Styles.cont}>
                    <div className={Styles.up}>
                        <div className={Styles.slider_container}>
                            <label className={Styles.switch}>
                                <input
                                    type="checkbox"
                                    checked={showCharts}
                                    onChange={() => setShowCharts(!showCharts)}
                                />
                                <span className={Styles.slider}></span>
                            </label>
                            <span className={Styles.slidertext}>{showCharts ? 'Charts' : 'Table'}</span>
                        </div>
                        {showCharts && <Select
                            className={Styles.multi_select}
                            options={options_disease}
                            value={disease}
                            placeholder="Select Diseases..."
                            onChange={setDisease}
                            styles={colourStyles}
                            isMulti
                        />}
                    </div>
                    {showCharts ? <Charts /> : <Table />}
                </div>
            }
        </>
    );
}

export default Disease;