import React from 'react';
import Plot from 'react-plotly.js';

const PyramidChart = ({ data, chartTitle }) => {
  const layout = {
    title: {
      text: chartTitle,
      font: {
        weight: 'bold',
        style: 'italic'
      },
    },
    barmode: 'relative',
    xaxis: {
      automargin: true,
      title: 'Population Count',
      showline: true,
      tickmode: 'array',
      tickvals: [-60, -40, -20, 0, 20, 40, 60],
      ticktext: ['60', '40', '20', '0', '20', '40', '60'],
    },
    yaxis: {
      automargin: true,
      title: 'Age Group',
    },
    font: {
      color: 'black',
      family: 'Arial, sans-serif',
    },
    plot_bgcolor: 'white',
    paper_bgcolor: 'white',
    margin: {
      l: 80, // Increased left margin
      r: 80, // Increased right margin
      t: 80, // Increased top margin
      b: 20, // Increased bottom margin
    },
    autosize: true,
    responsive: true,
  };

  return (
    <Plot
      data={data}
      layout={layout}
      useResizeHandler={true}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default PyramidChart;