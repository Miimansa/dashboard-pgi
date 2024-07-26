import React from 'react';
import Plot from 'react-plotly.js';

const PieChartConn = ({ data, chartTitle }) => {
  const layout = {
    title: chartTitle, // Use the chartTitle prop
    plot_bgcolor: 'white',
    paper_bgcolor: 'white',
    font: {
      color: 'black',
      size: 10, // Decrease the font size for the legend
    },
    showlegend: true,
    legend: {
      font: {
        size: 5, // Decrease the font size for the legend text
      },
      itemsizing: 'constrained', // Adjust the legend item size to fit the text
    },
    margin: {
      l: 20,
      r: 20,
      t: 60,
      b: 10,
    },
    autosize: true,
    responsive: true,
  };

  const updatedData = data.map(d => ({
    ...d,
    domain: { x: [0, 0.9], y: [0, 1] } // Use a larger value for the second x-coordinate
  }));

  return <Plot
    data={updatedData}
    layout={layout}
    useResizeHandler={true}
    style={{ width: '100%', height: '100%' }}
  />;
};

export default PieChartConn;