import React, { useEffect, useState } from "react";
import Styles from './Dashboard.module.css'
import { Link, Outlet, useLocation } from "react-router-dom";
import IMG from '../../assets/sgpgi_logo.png'
import Select from 'react-select'
import { colourStyles, option_groups, options_fordate } from "../Functions_Files/filters_data";
import { useDispatch, useSelector } from 'react-redux';
import { setDepartment, setFrom_date, setGroup, setTo_date } from "../../state/filtersSlice";
import { HiHome } from "react-icons/hi";
import { FaFlask, FaSearchPlus, FaTools, FaEdit } from "react-icons/fa";
import { BsPatchQuestionFill } from "react-icons/bs";
import { BiSolidBellPlus } from "react-icons/bi";
import DatePicker from "react-datepicker";
import { getDefaultValues } from "../Functions_Files/Fetchdata";

import "react-datepicker/dist/react-datepicker.css";
import { IoArrowBackOutline, IoArrowForwardOutline, IoBody } from "react-icons/io5";
import { MdOutlineZoomInMap, MdZoomOutMap } from "react-icons/md";
import Logo_mim from '../../assets/Miimansa_logo.png'
import toast, { Toaster } from 'react-hot-toast';
import { ScaleLoader } from 'react-spinners';
import MenuSimple from "./MU_dropdown";
import { message } from "antd";

const Dashboard = ({ Department_list }) => {
    const dispatch = useDispatch();
    const token = useSelector((state) => state.user.token);
    // states for filters
    const [group_in, setGroup_in] = useState(option_groups[1]);
    console.log(group_in)
    const [department_in, setDepartment_in] = useState();
    const [from_date_in, setFrom_date_in] = useState(new Date("2010-01-01"));
    const [to_date_in, setTo_date_in] = useState(new Date("2019-12-31"));
    const [active, setActive] = useState([false, false, false, false, false, false]);
    const defaultValues = {
        group: option_groups[1],
        department: Department_list ? Department_list.map(item => ({ label: item, value: item })) : [],
        from_date: new Date("2010-01-01"),
        to_date: new Date("2019-12-31")
      };
      const resetFilters = () => {
        setGroup_in(defaultValues.group);
        setDepartment_in(defaultValues.department);
        setFrom_date_in(defaultValues.from_date);
        setTo_date_in(defaultValues.to_date);
        dispatch(setGroup(defaultValues.group.name));
        dispatch(setFrom_date(defaultValues.from_date.toLocaleDateString('en-US')));
        dispatch(setTo_date(defaultValues.to_date.toLocaleDateString('en-US')));
        dispatch(setDepartment(Department_list.join(", ")));
        setSearch(false);
      };
    // To collapse navbar
    const [hide, setHide] = useState(false);
    const hideonclick = () => setHide(!hide);

    //For zooming full screen
    const [zoom, setZoom] = useState(false);
    const zoomonclick = () => setZoom(!zoom);

    //For showing search bar
    const [search, setSearch] = useState(false);
    const searchonClick = () => setSearch(!search);

    //listning groupselection
    const groupSelection = (e) => {
        setGroup_in(e);
        console.log(group_in)
        if (e.name === 'Monthly') {
            // Set dates to first day of the month
            setFrom_date_in(new Date(from_date_in.getFullYear(), from_date_in.getMonth(), 1));
            setTo_date_in(new Date(to_date_in.getFullYear(), to_date_in.getMonth() + 1, 0));
        }
        else {
            // Set dates to first and last day of the year
            setFrom_date_in(new Date(from_date_in.getFullYear(), 0, 1));
            setTo_date_in(new Date(to_date_in.getFullYear(), 11, 31));
        }
    }
    const group_store = useSelector((state) => state.filter.group);
    const notify_date = (section) => toast.error("Date interval should be correct", {
        duration: 1000,
        position: "top-center",
        style: {
            borderRadius: '10px',
            background: '#FFF',
            color: '#000',
        },
    });

    const setValues = () => {
        if (from_date_in > to_date_in) {
            console.log('Initial date is less than the final date.');
            notify_date();
            return;
        }
        const fromDateFormatted = from_date_in.toLocaleDateString('en-US')
        const toDateFormatted = to_date_in.toLocaleDateString('en-US')
        dispatch(setFrom_date(fromDateFormatted));
        dispatch(setTo_date(toDateFormatted));
        dispatch(setGroup(group_in?.name));
        
        // Check if department_in is an array (multiple selections) or a single object
        const selectedDepartments = Array.isArray(department_in) 
            ? department_in.map(option => option.value).join(", ")
            : department_in ? department_in.value : "";
        
        dispatch(setDepartment(selectedDepartments));
        searchonClick();
    }
    // getting data from store
    const department_store = useSelector((state) => state.filter.department);

    // adding all department list to usestate
    const [op_dept, setOp_dept] = useState();
    useEffect(() => {
        const loadData = async () => {
            try {
                const defaultValues = await getDefaultValues(token);
                
                if (Department_list) {
                    const allDepartments = Department_list.map((item) => ({
                        label: item,
                        value: item
                    }));
                    setOp_dept(allDepartments);
    
                    // Use default departments if available, otherwise use all departments
                    const defaultDepts = defaultValues.default_departments && defaultValues.default_departments.length > 0
                        ? defaultValues.default_departments.map(dept => ({ label: dept, value: dept }))
                        : allDepartments;
                    console.log(defaultDepts)
                    setDepartment_in(defaultDepts);
                    
                    // Set other default values
                    setGroup_in(defaultValues.default_group || option_groups[1]);
                    setFrom_date_in(new Date(defaultValues.default_from_date || "2010-01-01"));
                    setTo_date_in(new Date(defaultValues.default_to_date || "2019-12-31"));
                }
            } catch (error) {
                console.error('Error loading default values:', error);
                // Fallback to using all departments if there's an error
                if (Department_list) {
                    const allDepartments = Department_list.map((item) => ({
                        label: item,
                        value: item
                    }));
                    setDepartment_in(allDepartments);
                    setOp_dept(allDepartments);
                }
            }
        };
    
        loadData();
    }, [Department_list, token]);

    // for loading animation
    const loading = useSelector((state => state.filter.loading))
    const theme = useSelector((state => state.user.user.theme))
    const location = useLocation();
    useEffect(() => {
        const paths = [
            '/dashboard',
            '/dashboard/labs',
            '/dashboard/resources',
            '/dashboard/emergency',
            '/dashboard/disease',
            '/dashboard/PatientExplorer'
        ];

        const currentIndex = paths.indexOf(location.pathname);

        if (currentIndex !== -1) {
            const newActive = paths.map((_, index) => index === currentIndex);
            setActive(newActive);
        }
    }, [location.pathname]);
    const section = ['Home', 'Labs', 'Resources', 'Emergency', 'Disease', 'Patient_Explorer']

    const notifyZoom = () => {
        const activeSections = section.filter((_, index) => active[index]);
        message.info(`Zooming to ${activeSections}`);
    };

    return (<>
        <div className={Styles.container}>
            <Toaster />
            <div className={Styles.contdown}>
                <div className={`${Styles.contleft} ${hide && Styles.hide_onclick_width_l} ${zoom && Styles.zoom_in_l}`} >
                    <div className={Styles.contup_left}>
                        <img className={`${Styles.item1} ${hide && Styles.hidelogo} ${theme === 'dark' && Styles.sgpgi_logo_invert} `} src={IMG} alt="logo" ></img>
                        <div className={Styles.item2}>
                            <p>SGPGI</p>
                            <p className={Styles.item2_1}>DASHBOARD</p>
                        </div>
                    </div>
                    <div onClick={hideonclick} >
                        {
                            !hide
                                ?
                                <div className={Styles.backarrow} >
                                    < IoArrowBackOutline className={Styles.backarrow_arrow} />
                                    <p>Collapse</p>
                                </div>
                                :
                                <IoArrowForwardOutline className={`${Styles.hidearrow} ${Styles.backarrow_arrow}`} />
                        }
                    </div>

                    <Link to='' className={Styles.links} >
                        <div className={`${Styles.items}  ${active[0] && Styles.isactive}`} >
                            <HiHome />
                            <p className={`${hide && Styles.hide_onclick}`}>Visits</p>

                        </div>
                    </Link>
                    <Link to='labs' className={Styles.links}>
                        <div className={`${Styles.items} ${active[1] && Styles.isactive}`} >
                            <FaFlask />
                            <p className={`${hide && Styles.hide_onclick}`}>Labs</p>
                        </div>
                    </Link>
                    <Link to='resources' className={Styles.links}>
                        <div className={`${Styles.items} ${active[2] && Styles.isactive}`} >
                            <FaTools />
                            <p className={`${hide && Styles.hide_onclick}`}>Resources</p>
                        </div>
                    </Link>
                    <Link to='emergency' className={Styles.links}>
                        <div className={`${Styles.items} ${active[3] && Styles.isactive}`} >
                            <BiSolidBellPlus />
                            <p className={`${hide && Styles.hide_onclick}`}>Admissions</p>
                        </div>
                    </Link>
                    {/* <Link to='disease' className={Styles.links}>
                        <div className={`${Styles.items} ${active[4] && Styles.isactive}`} >
                            <IoBody />
                            <p className={`${hide && Styles.hide_onclick}`}>Disease</p>
                        </div>
                    </Link> */}
                    {/* <Link to='PatientExplorer' className={Styles.links}> */}
                    <div
                        className={`${Styles.items_query}`}>
                        <BsPatchQuestionFill />
                        <p style={{ fontSize: '15px' }} className={`${hide && Styles.hide_onclick}`}>Disease</p>
                    </div>
                    <div
                        className={`${Styles.items_query}`}>
                        <BsPatchQuestionFill />
                        <p style={{ fontSize: '15px' }} className={`${hide && Styles.hide_onclick}`}>Patient Explorer</p>
                    </div>
                    {/* </Link> */}
                    <div className={Styles.poweredbydiv}>
                        <p>Powered By</p>
                        <img src={Logo_mim} alt="LOGO"></img>
                    </div>
                </div>
                <div className={`${Styles.contright}  ${hide && Styles.hide_onclick_width_r} ${zoom && Styles.zoom_in_r} `}>
                    <div className={`${Styles.filtercont} ${zoom && Styles.zoom_in_filter}`}>
                        {
                            !search ? (
                                loading ? (
                                    <p className={Styles.filterload}  ><ScaleLoader className={`${theme === 'dark' && Styles.sgpgi_logo_invert}`} /></p>
                                ) : (
                                    <div className={`${Styles.contrup} ${zoom && Styles.zoom_in_filter} ${Styles.editbar}`}>
                                        <p className={Styles.preview_text}>
                                            {`You are viewing data from `}
                                            <strong>{from_date_in.toLocaleDateString('en-GB', options_fordate)}</strong>
                                            {` to `}
                                            <strong>{to_date_in.toLocaleDateString('en-GB', options_fordate)}</strong>
                                            {`, Grouped by `}
                                            <strong>{group_store}</strong>
                                            {` for `}
                                            <strong>{department_store}</strong>
                                            {` department `}
                                        </p>
                                        <div className={Styles.filter_edit_button_up}>
                                            <button className={Styles.filter_edit_button} onClick={searchonClick}>
                                                <FaEdit /> Edit
                                            </button>
                                        </div>
                                    </div>
                                )
                            ) :

                                <div className={`${Styles.contrup} ${zoom && Styles.zoom_in_filter}`}>
                                    <div className={Styles.contrup_items1}>
                                        <div className={Styles.calitem}>
                                            <Select
                                                className={Styles.single_select}
                                                options={option_groups}
                                                placeholder="GroupBy"
                                                onChange={(e) => groupSelection(e)}
                                                styles={colourStyles}
                                                defaultValue={group_in}
                                            />
                                        </div>
                                        <div className={Styles.calitem}>
                                            <DatePicker
                                                selected={from_date_in}
                                                onChange={(date) => setFrom_date_in(date)}
                                                dateFormat={group_in?.name === 'Monthly' ? "MM-yyyy" : group_in?.name === 'Yearly' ? "yyyy" : "MM-dd-yyyy"}
                                                showMonthYearPicker={group_in?.name === 'Monthly'}
                                                showYearPicker={group_in?.name === 'Yearly'}
                                                placeholderText="Start Date"
                                                className={Styles.datepicker}
                                                minDate={new Date("2010-01-01")}
                                                maxDate={new Date("2019-12-31")}
                                            />
                                        </div>
                                        <div className={Styles.calitem}>
                                            <DatePicker
                                                selected={to_date_in}
                                                onChange={(date) => {
                                                    const selectedDate = new Date(date);
                                                    const groupType = group_in?.name;

                                                    if (groupType === 'Monthly') {
                                                        selectedDate.setMonth(selectedDate.getMonth() + 1);
                                                        selectedDate.setDate(0); // Set to the last day of the previous month
                                                    } else if (groupType === 'Yearly') {
                                                        selectedDate.setMonth(11); // December
                                                        selectedDate.setDate(31); // 31st December
                                                    } else if (groupType === 'Weekly') {
                                                        const day = selectedDate.getDay();
                                                        selectedDate.setDate(selectedDate.getDate());
                                                    }

                                                    setTo_date_in(selectedDate);
                                                }}
                                                dateFormat={group_in?.name === 'Monthly' ? "MM-yyyy" : group_in?.name === 'Yearly' ? "yyyy" : "MM-dd-yyyy"}
                                                showMonthYearPicker={group_in?.name === 'Monthly'}
                                                showYearPicker={group_in?.name === 'Yearly'}
                                                placeholderText="End Date"
                                                className={Styles.datepicker}
                                                minDate={new Date("2010-01-01")}
                                                maxDate={new Date("2019-12-31")}
                                            />
                                        </div>

                                        <div className={Styles.multi_select}>
                                        <Select
                                                options={op_dept}
                                                placeholder="Select Department..."
                                                onChange={setDepartment_in}
                                                styles={colourStyles}
                                                isMulti
                                                value={department_in}
                                            />
                                        </div>
                                        <div className={Styles.search_button}>
                                        <button onClick={setValues}> <FaSearchPlus /> Search</button>
                                        <button onClick={resetFilters}>Reset</button>
                                        <button onClick={() => setSearch(false)}>X</button>
                                        </div>
                                    </div>
                                    
                                    
                                </div>
                        }
                        <div className={Styles.profile} ><MenuSimple />
                        </div>
                    </div>
                    <div className={`${Styles.contrmid} ${zoom && Styles.contmid_onzoom}`} >
                        {
                            !zoom
                                ?
                                <MdZoomOutMap onClick={() => { zoomonclick(); notifyZoom(); }} />
                                :
                                <MdOutlineZoomInMap onClick={zoomonclick} />
                        }
                    </div>
                    <div className={`${Styles.contrdown} ${zoom && Styles.zoom_in_bottom}`}>
                        <Outlet />
                    </div>
                </div>
            </div>
        </div >
    </>)
}

export default Dashboard;
