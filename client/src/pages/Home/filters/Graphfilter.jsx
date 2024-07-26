import React, { useState } from "react";
import Styles from './Graphfilter.module.css';
import Graphfilter_home from "./Graphfilter_home";
import Graphfilter_lab from "./Graphfilter_lab";
import Graphfilter_disease from "./Graphfilter_disease";
import Graphfilter_emergency from "./Graphfilter_emergency";
import Graphfilter_resources from "./Graphfilter_resources";

const Graphfilter = () => {
    const [selectedFilter, setSelectedFilter] = useState("home");

    const handleChange = (event) => {
        setSelectedFilter(event.target.value);
    };

    return (
        <div className={Styles.graphFilter}>
            <div className={Styles.sectionitem}>
                <label><b>Select Section</b></label>
                <select value={selectedFilter} onChange={handleChange}
                    className={Styles.sectionoption}>
                    <option className={Styles.sectionoption_item} value="home">Home</option>
                    <option className={Styles.sectionoption_item} value="lab">Lab</option>
                    <option className={Styles.sectionoption_item} value="disease">Disease</option>
                    <option className={Styles.sectionoption_item} value="emergency">Emergency</option>
                    <option className={Styles.sectionoption_item} value="resources">Resources</option>
                </select>
            </div>

            {selectedFilter === "home" && <Graphfilter_home />}
            {selectedFilter === "lab" && <Graphfilter_lab />}
            {selectedFilter === "disease" && <Graphfilter_disease />}
            {selectedFilter === "emergency" && <Graphfilter_emergency />}
            {selectedFilter === "resources" && <Graphfilter_resources />}
        </div>
    );
};

export default Graphfilter;
