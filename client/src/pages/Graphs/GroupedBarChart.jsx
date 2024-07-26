import React from 'react';
import Plot from 'react-plotly.js';

const GroupedBarChart = ({ data, chartTitle, xAxisTitle, yAxisTitle }) => {
  const layout = {
    title: {
      text: chartTitle,
      font: {
        weight: 'bold',
        style: 'italic'
      },
    },
    xaxis: {
      title: xAxisTitle, // Use the xAxisTitle prop
      gridcolor: 'rgba(51, 51, 51, 1)',
      automargin: true,
    },
    yaxis: {
      title: yAxisTitle, // Use the yAxisTitle prop
      gridcolor: 'rgba(51, 51, 51, 1)',
      automargin: true,
    },
    barmode: 'group',
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

  return <Plot data={data}
    layout={layout}
    useResizeHandler={true}
    style={{ width: '100%', height: '100%' }}
  />;
};

export default GroupedBarChart;