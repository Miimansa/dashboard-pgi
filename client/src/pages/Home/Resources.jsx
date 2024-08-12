import React, { useEffect, useState } from "react";
import BloodGroupSelector from "../Graphs/BloodGroupFactorSelector";
import Styles from './Resources.module.css'
import { useDispatch, useSelector } from "react-redux";
import LineChart from "../Graphs/LineChart";
import { OxygencylinderByDepartment, bloodPacketsUsedByBloodGroup, operationTheaterContributionByDepartment, operationTheaterOccupancyByDepartment, bloodUsedByDepartment } from '../Graphs/data/resourcesdata'
import FlexiblePlotlyChart from "../Graphs/FlexibleChart";
import { setloading_text } from "../../state/filtersSlice";
import { getdata_resources } from "../Functions_Files/Fetchdata";
import ClipLoader from "react-spinners/ClipLoader";
import { formatDataForPieChart } from "../Functions_Files/file_functions";
import { Select, Button } from "antd";

const { Option } = Select;

const Resources = () => {
    const Userselection = useSelector((state) => state.user.user);
    const processData = (rawData) => {
        return rawData.map(dept => {
            const sortedIndices = dept.x.map((year, index) => ({ year: Number(year), index }))
                .sort((a, b) => a.year - b.year)
                .map(item => item.index);

            return {
                name: dept.name,
                x: sortedIndices.map(i => Number(dept.x[i])),
                y: sortedIndices.map(i => dept.y[i])
            };
        });
    };

    const from_date = useSelector((state) => state.filter.from_date || '').replace(/\//g, '-');
    const to_date = useSelector((state) => state.filter.to_date || '').replace(/\//g, '-');
    const group = useSelector((state) => state.filter.group);
    const department = useSelector((state) => state.filter.department) || '';
    const token = useSelector((state) => state.user.token);
    const [data, setdata] = useState(null);
    const dispatch = useDispatch();
    const [loading, setloading] = useState(true);
    const theme = useSelector((state => state.user.user.theme))
    const [selectedChart, setSelectedChart] = useState(null);
    const [showFullScreenChart, setShowFullScreenChart] = useState(false);

    const fetchData = async () => {
        dispatch(setloading_text(true))
        setloading(true)
        try {
            const res = await getdata_resources(from_date, to_date, department, group, token);
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
                    <p className={Styles.up_count}>OT Requests: {data?.labels?.OTCount}</p>
                    <p className={Styles.up_count}>Blood Packets: {data?.labels?.blood_count}</p>
                    <div className={Styles.dropdown}>
                        <Select
                            style={{ width: 200 }}
                            placeholder="Full Screen Chart"
                            onChange={handleChartChange}
                        >
                            <Option value="chart1">chart1</Option>
                            <Option value="chart2">chart2</Option>
                            <Option value="chart3">chart3</Option>
                            <Option value="chart4">chart4</Option>
                            <Option value="None">None</Option>
                        </Select>
                        <Button onClick={handleViewChart}>View</Button>
                    </div>
                </div>
                <div className={Styles.down}>
                    {showFullScreenChart && selectedChart !== 'None' ? (
                        selectedChart === "chart1" ? (
                            <FlexiblePlotlyChart
                                data={data?.bloodUsedByDepartment}
                                xAxisTitle={"Date"}
                                yAxisTitle={"Blood Packets"}
                                chartTitle={"Department wise Blood Packets count"}
                                chartType={Userselection?.bio?.resources?.bloodUsedByDepartment?.SelectedType}
                            />
                        ) : selectedChart === "chart2" ? (
                            <FlexiblePlotlyChart
                                data={formatDataForPieChart(data?.bloodPacketsUsedByBloodGroup)}
                                chartTitle={"Blood group wise"}
                                chartType={Userselection?.bio?.resources?.bloodPacketsUsedByBloodGroup?.SelectedType}
                            />
                        ) : selectedChart === "chart3" ? (
                            <FlexiblePlotlyChart
                                data={data?.operationTheaterOccupancyByDepartment}
                                chartTitle="Department wise  OT Requests"
                                xAxisTitle="Date"
                                yAxisTitle="Request Counts"
                                chartType={Userselection?.bio?.resources?.operationTheaterOccupancyByDepartment?.SelectedType}
                            />
                        ) : selectedChart === "chart4" ? (
                            <FlexiblePlotlyChart
                                data={formatDataForPieChart(data?.operationTheaterContributionByDepartment)}
                                chartTitle="Department wise OT request"
                                chartType={Userselection?.bio?.resources?.operationTheaterContributionByDepartment?.SelectedType}
                            />
                        ) : null
                    ) : (
                        <>
                            <div className={Styles.down_up}>
                                <div className={Styles.down_upchild}>
                                    <FlexiblePlotlyChart
                                        data={data?.bloodUsedByDepartment}
                                        xAxisTitle={"Date"}
                                        yAxisTitle={"Blood Packets"}
                                        chartTitle={"Department wise Blood Packets count"}
                                        chartType={Userselection?.bio?.resources?.bloodUsedByDepartment?.SelectedType}
                                    />
                                </div>
                                <div className={Styles.down_upchild}>
                                    <BloodGroupSelector/>
                                </div>
                            </div>
                            <div className={Styles.down_down}>
                                <div className={Styles.down_downchild1}>
                                    <FlexiblePlotlyChart
                                        data={data?.operationTheaterOccupancyByDepartment}
                                        chartTitle="Department wise  OT Requests"
                                        xAxisTitle="Date"
                                        yAxisTitle="Request Counts"
                                        chartType={Userselection?.bio?.resources?.operationTheaterOccupancyByDepartment?.SelectedType}
                                    />
                                </div>
                                <div className={Styles.down_downchild2}>
                                    <FlexiblePlotlyChart
                                        data={formatDataForPieChart(data?.operationTheaterContributionByDepartment)}
                                        chartTitle="Department wise OT request"
                                        chartType={Userselection?.bio?.resources?.operationTheaterContributionByDepartment?.SelectedType}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        }
    </>);
}
export default Resources;