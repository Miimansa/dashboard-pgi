import React from 'react';
import Plot from 'react-plotly.js';

const LineChart = ({ data, chartTitle, xAxisTitle, yAxisTitle }) => {
  console.log('LineChart data:', data);
  const layout = {
    title: {
      text: chartTitle,
      font: {
        weight: 'bold',
        style: 'italic'
      },
      margin: {
        l: 0,
        r: 0,
        t: 0,
        b: 0
      }
    },
    xaxis: {

      title: xAxisTitle,
      gridcolor: 'rgba(51, 51, 51, 1)',
      standoff: 5, // Reduce the standoff value
    },
    yaxis: {
      title: yAxisTitle,
      gridcolor: 'rgba(51, 51, 51, 1)',
    },
    plot_bgcolor: 'white',
    paper_bgcolor: 'white',
    font: {
      color: 'black',
    },
    legend: {
      orientation: 'h',
      yanchor: 'bottom',
      y: 1.02,
      xanchor: 'right',
      x: 1,
      bgcolor: 'rgba(255, 255, 255, 0.5)',
      bordercolor: 'rgba(0, 0, 0, 0.1)',
    },
    margin: {
      l: 50,
      r: 50,
      t: 90,
      b: 90,
    },
    autosize: true,
    responsive: true,
  };

  return <Plot
    data={data?.department_wise_patient_count}
    layout={layout}
    useResizeHandler={true}
    style={{ width: '100%', height: '100%' }}
  />;
};

export default LineChart;