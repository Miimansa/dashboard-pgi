const diseaseCounts = [
  {
    x: ["2023-01", "2023-02", "2023-03"],
    y: [100, 110, 105],
    name: "Heart Disease",
  },
  {
    x: ["2023-01", "2023-02", "2023-03"],
    y: [80, 85, 90],
    name: "Stroke",
  },
  {
    x: ["2023-01", "2023-02", "2023-03"],
    y: [120, 125, 130],
    name: "Cancer",
  },
  {
    x: ["2023-01", "2023-02", "2023-03"],
    y: [90, 95, 100],
    name: "Diabetes",
  },
];

const deathTally = [
  {
    x: ["2023-01", "2023-02", "2023-03"],
    y: [20, 22, 18],
    name: "Heart Disease",
  },
  {
    x: ["2023-01", "2023-02", "2023-03"],
    y: [15, 16, 14],
    name: "Stroke",
  },
  {
    x: ["2023-01", "2023-02", "2023-03"],
    y: [25, 27, 23],
    name: "Cancer",
  },
  {
    x: ["2023-01", "2023-02", "2023-03"],
    y: [18, 20, 17],
    name: "Diabetes",
  },
];

const patientCountByDisease = [
  {
    x: ["Heart Disease", "Stroke", "Cancer", "Diabetes"],
    y: [310, 255, 375, 290],
    name: "Patient Count",
  },
];

// Example data to be passed to the PyramidChart component
const genderAgeDistribution = [
  {
    x: [-5, -15, -20, -25, -20, -15, -10],
    y: ["71+", "61-70", "51-60", "41-50", "31-40", "21-30", "11-20", "0-10"],
    name: "Females",
    orientation: "h",
    marker: {
      color: 'rgba(255, 153, 153, 0.6)',
      line: {
        color: 'rgba(255, 153, 153, 1)',
        width: 1,
      },
    },
    type: 'bar',
    hovertemplate: '<b>%{y}</b><br>Females: %{x:.0f}<extra></extra>', // Custom hover template
  },
  {
    x: [10, 20, 25, 30, 25, 20, 15],
    y: ["71+", "61-70", "51-60", "41-50", "31-40", "21-30", "11-20", "0-10"],
    name: "Males",
    orientation: "h",
    marker: {
      color: 'rgba(153, 204, 255, 0.6)',
      line: {
        color: 'rgba(153, 204, 255, 1)',
        width: 1,
      },
    },
    type: 'bar',
    hovertemplate: '<b>%{y}</b><br>Males: %{x}<extra></extra>', // Custom hover template
  },
];
const totalSurvivalRate = [
  {
    domain: { x: [0, 1], y: [0, 1] },
    value: 82, // Total survival rate
    type: "indicator",
    mode: "gauge+number",
    gauge: {
      axis: { visible: true, range: [0, 100], tickcolor: 'black' },
      bar: { color: 82 <= 70 ? "red" : "green" },
    },
  },
];




export { diseaseCounts, deathTally, patientCountByDisease, genderAgeDistribution, totalSurvivalRate }