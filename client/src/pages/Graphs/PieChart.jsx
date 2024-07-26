import React from 'react';
import Plot from 'react-plotly.js';

const PieChart = ({ data, chartTitle }) => {
  const layout = {
    title: {
      text: chartTitle,
      font: {
        weight: 'bold',
        style: 'italic'
      },
    },
    plot_bgcolor: 'white',
    paper_bgcolor: 'white',
    font: {
      color: 'black',
      size: 12,
    },
    showlegend: true,
    legend: {
      font: {
        size: 10,
      },
      itemsizing: 'constant',
      xanchor: 'right',
      yanchor: 'top',
      x: 1,
      y: 1,
      orientation: 'vertical',
      bgcolor: 'rgba(255, 255, 255, 0.5)', // Semi-transparent white background
      bordercolor: 'rgba(0, 0, 0, 0.1)',   // Light border color
      borderwidth: 1,
    },
    margin: {
      l: 20,
      r: 20,
      t: 60,
      b: 20,
    },
    autosize: true,
    responsive: true,
  };

  // Check if data is undefined, null, or an empty array
  const isDataEmpty = !data || data.length === 0;

  const chartData = isDataEmpty
    ? [{
      type: 'pie',
      labels: ['No Data'],
      values: [1],
      textinfo: 'none',
      hoverinfo: 'none',
      marker: { colors: ['#e0e0e0'] },
    }]
    : data.map(d => ({
      ...d,
      textposition: 'inside',
    }));

  return (
    <Plot
      data={chartData}
      layout={layout}
      useResizeHandler={true}
      style={{ width: '100%', height: '100%' }}
      config={{ responsive: true }}
    />
  );
};

export default PieChart;