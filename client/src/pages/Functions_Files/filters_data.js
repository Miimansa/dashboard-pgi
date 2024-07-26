const options_disease = [
    { label: "diabetes", value: "diabetes" },
    { label: "hypertension", value: "hypertension" },
    { label: "asthma", value: "asthma" },
    { label: "cancer", value: "cancer" }
];
const option_groups = [
    { name: 'Yearly', label: 'Yearly' },
    { name: 'Monthly', label: 'Monthly' },
    { name: 'Weekly', label: 'Weekly' }
];
const options_tests = [
    { label: "16. S. ALT (SGPT)", value: "16. S. ALT (SGPT)" },
    { label: "01. TLC", value: "01. TLC" },
    { label: "15. S. AST (SGOT)", value: "15. S. AST (SGOT)" },
    { label: "03. HGB", value: "03. HGB" },
    { label: "08. DLC", value: "08. DLC" }
];
const colourStyles = {
    control: (provided, state) => ({
        ...provided,
        fontSize: '10px',
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        // const color = chroma(data.color);
        return {
            ...styles,
            backgroundColor: isFocused ? "#999999" : null,
            color: "#333333",
        };
    }
};
const options_fordate = { year: 'numeric', month: 'short', day: '2-digit' };
const dataConfig = {
    home: [
        {
            label: "departmentWisePatientCount",
            defaultType: { label: "line", value: "line" },
            compatibleTypes: [
                { label: 'line', value: 'line' },
                { label: 'area', value: 'area' },
                { label: 'groupedBar', value: 'groupedBar' }
            ]
        },
        {
            label: "visitsVsAdmissions",
            defaultType: { label: "groupedBar", value: "groupedBar" },
            compatibleTypes: [
                { label: 'line', value: 'line' },
                { label: 'area', value: 'area' },
                { label: 'groupedBar', value: 'groupedBar' }

            ]
        },
        {
            label: "genderCount",
            defaultType: { label: "groupedBar", value: "groupedBar" },
            compatibleTypes: [
                { label: 'line', value: 'line' },
                { label: 'groupedBar', value: 'groupedBar' },
                { label: 'area', value: 'area' }
            ]
        },
        {
            label: "departmentWisePatients",
            defaultType: { label: "pie", value: "pie" },
            compatibleTypes: [
                { label: 'pie', value: 'pie' },
                { label: 'donut', value: 'donut' }
            ]
        },
        {
            label: "genderDistribution",
            defaultType: { label: "pie", value: "pie" },
            compatibleTypes: [
                { label: 'pie', value: 'pie' },
                { label: 'donut', value: 'donut' }
            ]
        }
    ],
    labs: [
        {
            label: "LabOrderCount",
            defaultType: { label: "bar", value: "bar" },
            compatibleTypes: [
                { label: 'line', value: 'line' },
                { label: 'bar', value: 'bar' },
                { label: 'area', value: 'area' }
            ]
        },
        {
            label: "labOrdersByDepartment",
            defaultType: { label: "bar", value: "bar" },
            compatibleTypes: [
                { label: 'line', value: 'line' },
                { label: 'area', value: 'area' },
                { label: 'groupedBar', value: 'groupedBar' }
            ]
        },
        {
            label: "monthlyLabTestCounts",
            defaultType: { label: "line", value: "line" },
            compatibleTypes: [
                { label: 'line', value: 'line' },
                { label: 'area', value: 'area' },
                { label: 'groupedBar', value: 'groupedBar' },
            ]
        },
        {
            label: "patientCountByDepartment",
            defaultType: { label: "radar", value: "radar" },
            compatibleTypes: [
                { label: 'pie', value: 'pie' },
                { label: 'donut', value: 'donut' }
            ]
        }
    ],
    disease: [
        {
            label: "diseaseCounts",
            defaultType: { label: "line", value: "line" },
            compatibleTypes: [
                { label: 'line', value: 'line' },
                { label: 'bar', value: 'bar' },
                { label: 'scatter', value: 'scatter' },
                { label: 'area', value: 'area' },
                { label: 'groupedBar', value: 'groupedBar' },
                { label: 'stackedBar', value: 'stackedBar' }
            ]
        },
        {
            label: "deathTally",
            defaultType: { label: "line", value: "line" },
            compatibleTypes: [
                { label: 'line', value: 'line' },
                { label: 'bar', value: 'bar' },
                { label: 'scatter', value: 'scatter' },
                { label: 'area', value: 'area' },
                { label: 'groupedBar', value: 'groupedBar' },
                { label: 'stackedBar', value: 'stackedBar' }
            ]
        },
        {
            label: "patientCountByDisease",
            defaultType: { label: "bar", value: "bar" },
            compatibleTypes: [
                { label: 'bar', value: 'bar' },
                { label: 'groupedBar', value: 'groupedBar' },
                { label: 'stackedBar', value: 'stackedBar' },
                { label: 'line', value: 'line' },
                { label: 'scatter', value: 'scatter' },
                { label: 'area', value: 'area' }
            ]
        },
        {
            label: "genderAgeDistribution",
            defaultType: { label: "pyramid", value: "pyramid" },
            compatibleTypes: [
                { label: 'pyramid', value: 'pyramid' },
                { label: 'groupedBar', value: 'groupedBar' },
                { label: 'stackedBar', value: 'stackedBar' },
                { label: 'heatmap', value: 'heatmap' },
                { label: 'scatter', value: 'scatter' },
                { label: 'pie', value: 'pie' }
            ]
        },
        {
            label: "totalSurvivalRate",
            defaultType: { label: "gauge", value: "gauge" },
            compatibleTypes: [
                { label: 'gauge', value: 'gauge' },
                { label: 'indicator', value: 'indicator' },
                { label: 'pie', value: 'pie' },
                { label: 'donut', value: 'donut' }
            ]
        }
    ],
    emergency: [
        {
            label: "uniquePatientCounts",
            defaultType: { label: "line", value: "line" },
            compatibleTypes: [
                { label: 'line', value: 'line' },
                { label: 'groupedBar', value: 'groupedBar' },
                { label: 'area', value: 'area' }
            ]
        },
        {
            label: "survivalDeathCounts",
            defaultType: { label: "groupedBar", value: "groupedBar" },
            compatibleTypes: [
                { label: 'line', value: 'line' },
                { label: 'groupedBar', value: 'groupedBar' },
                { label: 'area', value: 'area' }
            ]
        },
        {
            label: "durationOfStay",
            defaultType: { label: "groupedBar", value: "groupedBar" },
            compatibleTypes: [
                { label: 'line', value: 'line' },
                { label: 'groupedBar', value: 'groupedBar' },
                { label: 'area', value: 'area' }
            ]
        },
        {
            label: "genderDistribution",
            defaultType: { label: "pie", value: "pie" },
            compatibleTypes: [
                { label: 'pie', value: 'pie' },
                { label: 'donut', value: 'donut' }
            ]
        },
        {
            label: "totalPatientCount",
            defaultType: { label: "pie", value: "pie" },
            compatibleTypes: [
                { label: 'pie', value: 'pie' },
                { label: 'donut', value: 'donut' }
            ]
        }
    ],
    resources: [
        {
            label: "OxygencylinderByDepartment",
            defaultType: { label: "line", value: "line" },
            compatibleTypes: [
                { label: 'line', value: 'line' },
                { label: 'area', value: 'area' },
                { label: 'groupedBar', value: 'groupedBar' },
            ]
        },
        {
            label: "bloodUsedByDepartment",
            defaultType: { label: "line", value: "line" },
            compatibleTypes: [
                { label: 'line', value: 'line' },
                { label: 'area', value: 'area' },
                { label: 'groupedBar', value: 'groupedBar' },
            ]
        },
        {
            label: "operationTheaterOccupancyByDepartment",
            defaultType: { label: "bar", value: "bar" },
            compatibleTypes: [
                { label: 'line', value: 'line' },
                { label: 'groupedBar', value: 'groupedBar' },
                { label: 'area', value: 'area' }
            ]
        },
        {
            label: "operationTheaterContributionByDepartment",
            defaultType: { label: "pie", value: "pie" },
            compatibleTypes: [
                { label: 'pie', value: 'pie' },
                { label: 'donut', value: 'donut' }
            ]
        },
        {
            label: "bloodPacketsUsedByBloodGroup",
            defaultType: { label: "pie", value: "pie" },
            compatibleTypes: [
                { label: 'pie', value: 'pie' },
                { label: 'donut', value: 'donut' }
            ]
        }
    ]
};


export { options_disease, option_groups, colourStyles, options_fordate, dataConfig, options_tests };