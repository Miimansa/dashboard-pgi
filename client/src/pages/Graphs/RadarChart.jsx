import React from 'react';
import Plot from 'react-plotly.js';

const RadarChart = ({ data, chartTitle }) => {
  const layout = {
    title: {
      text: chartTitle,
      font: {
        weight: 'bold',
        style: 'italic'
      },
    },
    polar: {
      radialaxis: {
        visible: true,
        autorange: true,
        rangemode: 'tozero', // Include zero in the range
        rangefactor: 1.2, // Add 20% padding to the range
      },
    },
    font: {
      color: 'black',
    },
    plot_bgcolor: 'white',
    paper_bgcolor: 'white',
    margin: {
      l: 50,
      r: 50,
      t: 60,
      b: 10,
    },
    autosize: true,
    responsive: true,
    config: {
      displayModeBar: 'True', scrollZoom: 'True', showTips: 'True',
    },
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

export default RadarChart;