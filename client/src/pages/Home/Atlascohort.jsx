import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getperson_list } from "../Functions_Files/Fetchdata";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Atlascohort = () => {
    const [personData, setPersonData] = useState(null);
    const [limit, setLimit] = useState(10);
    const [loading, setLoading] = useState(false);
    const token = useSelector((state) => state.user.token);

    useEffect(() => {
        fetchData(limit);
    }, [limit]);

    const fetchData = async (limit) => {
        setLoading(true);
        const data = await getperson_list(limit, token);
        if (data.data && data.data.persondata) {
            setPersonData(data.data.persondata);
        }
        setLoading(false);
    };

    const exportToExcel = () => {
        if (!personData) return;

        const dataArray = personData.person_id.map((id, index) => ({
            "Sr.": index + 1,
            "Person ID": id,
            "Year of Birth": personData.year_of_birth[index],
            "Age": personData.age[index],
            "Gender": personData.gender_source_value[index],
            "Source Value": personData.person_source_value[index],
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataArray);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Person Data");

        // Create and trigger a download
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(data, "PersonData.xlsx");
    };

    const limitArray = [10, 20, 50, 100, 500, 1000];

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", width: "100%" }}>
            <h2 style={{ color: "white", backgroundColor: "black", padding: "10px", borderRadius: "5px", textAlign: "center", fontSize: "24px", fontWeight: "bold", marginBottom: "10px" }}>
                Person Data
            </h2>

            {/* Controls */}
            <div style={{ marginBottom: "10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                    <label style={{ fontWeight: "bold", marginRight: "10px" }}>Select Limit:</label>
                    <select
                        style={{ padding: "8px", border: "2px solid #000000", borderRadius: "5px", cursor: "pointer", backgroundColor: "white" }}
                        value={limit}
                        onChange={(e) => setLimit(Number(e.target.value))}
                    >
                        {limitArray.map((num) => (
                            <option key={num} value={num}>{num}</option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={exportToExcel}
                    style={{
                        padding: "8px 12px",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontWeight: "bold"
                    }}
                    disabled={!personData}
                >
                    Export to Excel
                </button>
            </div>

            {loading ? (
                <p style={{ marginTop: "20px", textAlign: "center", fontSize: "18px", fontWeight: "bold" }}>Loading...</p>
            ) : personData ? (
                <div style={{ maxHeight: "60vh", overflowY: "auto", border: "2px solid #ddd", borderRadius: "5px", backgroundColor: "#f9f9f9" }}>
                    <table style={{ width: "100%", backgroundColor: "white", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ backgroundColor: "#f8b34b", color: "white", textAlign: "center" }}>
                                <th style={{ padding: "10px", border: "1px solid #ddd" }}>Sr.</th>
                                <th style={{ padding: "10px", border: "1px solid #ddd" }}>Person ID</th>
                                <th style={{ padding: "10px", border: "1px solid #ddd" }}>Year of Birth</th>
                                <th style={{ padding: "10px", border: "1px solid #ddd" }}>Age</th>
                                <th style={{ padding: "10px", border: "1px solid #ddd" }}>Gender</th>
                                <th style={{ padding: "10px", border: "1px solid #ddd" }}>Source Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {personData.person_id.map((id, index) => (
                                <tr key={id} style={{ textAlign: "center", backgroundColor: index % 2 === 0 ? "#f2f2f2" : "white" }}>
                                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{index + 1}</td>
                                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{id}</td>
                                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{personData.year_of_birth[index]}</td>
                                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{personData.age[index]}</td>
                                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{personData.gender_source_value[index]}</td>
                                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{personData.person_source_value[index]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p style={{ marginTop: "20px", textAlign: "center", fontSize: "18px", fontWeight: "bold" }}>No data available.</p>
            )}
        </div>
    );
};

export default Atlascohort;
