const uniquePatientCounts = [
  {
    x: ["2023-01-01", "2023-02-01", "2023-03-01"],
    y: [150, 160, 155],
    name: "Cardiology",
  },
  {
    x: ["2023-01-01", "2023-02-01", "2023-03-01"],
    y: [120, 130, 125],
    name: "Neurology",
  },
  {
    x: ["2023-01-01", "2023-02-01", "2023-03-01"],
    y: [180, 190, 185],
    name: "Oncology",
  },
  {
    x: ["2023-01-01", "2023-02-01", "2023-03-01"],
    y: [160, 170, 165],
    name: "Orthopedics",
  },
];


const survivalDeathCounts = [
  {
    x: ["2023-04", "2023-03", "2023-02", "2023-01"],
    y: [25, 30, 20, 35],
    name: 'Deaths',
  },
  {
    x: ["2023-04", "2023-03", "2023-02", "2023-01"],
    y: [75, 70, 80, 65],
    name: 'Survivals',
  },
 ];

const durationOfStay = [{
      x: ['Cardiology', 'Neurology', 'Oncology', 'Orthopedics'],
      y: [5, 7, 12, 9],
      name: '1-3 days',
    },
    {
      x: ['Cardiology', 'Neurology', 'Oncology', 'Orthopedics'],
      y: [10, 8, 18, 15],
      name: '4-7 days',
    },
    {
      x: ['Cardiology', 'Neurology', 'Oncology', 'Orthopedics'],
      y: [8, 6, 22, 12],
      name: '8-14 days',
    },
    {
      x: ['Cardiology', 'Neurology', 'Oncology', 'Orthopedics'],
      y: [3, 4, 10, 7],
      name: '15+ days',
    }
  ];
const genderDistribution = [
  {
    values: [300, 250, 50],
    labels: ["Male", "Female", "Others"],
    name: "Cardiology",
  },
  {
    values: [230, 190, 30],
    labels: ["Male", "Female", "Others"],
    name: "Neurology",
  },
  {
    values: [270, 220, 50],
    labels: ["Male", "Female", "Others"],
    name: "Oncology",
  },
  {
    values: [280, 230, 40],
    labels: ["Male", "Female", "Others"],
    name: "Orthopedics",
  },
];

const totalPatientCount = [
  {
    values: [700, 540, 720, 610],
    labels: ["Cardiology", "Neurology", "Oncology", "Orthopedics"],
    name: "Total Patient Count",
  },
];

export { uniquePatientCounts, survivalDeathCounts, durationOfStay, genderDistribution, totalPatientCount };