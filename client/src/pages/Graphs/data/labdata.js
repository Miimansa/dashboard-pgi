const LabOrderCount = [
  {
    x: ["Cardiology", "Neurology", "Oncology", "Orthopedics"],
    y: [500, 300, 700, 400],
    name: 'Lab Order Count'
  },
];

const labOrdersByDepartment = [
  {
    values: [500, 300, 700, 400],
    labels: ["Cardiology", "Neurology", "Oncology", "Orthopedics"],
    name: 'Lab Orders by Department',
  },
];

const monthlyLabTestCounts = [
  {
    x: ["2023-05", "2023-04", "2023-03", "2023-02", "2023-01"],
    y: [750, 680, 770, 710, 790],
    name: 'Blood Test',
  },
  {
    x: ["2023-05", "2023-04", "2023-03", "2023-02", "2023-01"],
    y: [430, 390, 440, 400, 450],
    name: 'Urine Test',
  },
  {
    x: ["2023-05", "2023-04", "2023-03", "2023-02", "2023-01"],
    y: [208, 205, 209, 191, 197],
    name: 'Other Tests',
  },
];

const patientCountByDepartment = [
  {
    type: 'scatterpolar',
    r: [20, 25, 30], // Cardiology data
    theta: ['Inpatient', 'Outpatient', 'Emergency'],
    fill: 'toself',
    name: 'Cardiology',
    hovertemplate: 'Department: %{theta}<br>Patients: %{r}<extra></extra>'
  },
  {
    type: 'scatterpolar',
    r: [15, 20, 10], // Neurology data
    theta: ['Inpatient', 'Outpatient', 'Emergency'],
    fill: 'toself',
    name: 'Neurology',
    hovertemplate: 'Department: %{theta}<br>Patients: %{r}<extra></extra>'
  },
  {
    type: 'scatterpolar',
    r: [30, 10, 20], // Orthopedics data
    theta: ['Inpatient', 'Outpatient', 'Emergency'],
    fill: 'toself',
    name: 'Orthopedics',
    hovertemplate: 'Department: %{theta}<br>Patients: %{r}<extra></extra>'
  },
];
export {
  LabOrderCount,
  labOrdersByDepartment,
  monthlyLabTestCounts,
  patientCountByDepartment,
};