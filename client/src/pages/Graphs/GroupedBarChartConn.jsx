import React from 'react';
import Plot from 'react-plotly.js';

const GroupedBarChartConn = ({ data, chartTitle, xAxisTitle, yAxisTitle, onBarClick }) => {
  console.log(data)
  const layout = {
    title: {
      text: chartTitle,
      font: {
        weight: 'bold',
        style: 'italic',
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
      t: 60,
      b: 90,
    },
    autosize: true,
    responsive: true,
  };
  return <Plot data={data}
    layout={layout}
    useResizeHandler={true}
    style={{ width: '100%', height: '100%' }}
    onClick={(e) => {
      if (e.points.length) {
        const clickedValue = e.points[0].x; // Assuming the x-axis represents the bar values
        onBarClick(clickedValue);
      }
    }}
  />;
};

export default GroupedBarChartConn;