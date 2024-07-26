import React from 'react';
import Plot from 'react-plotly.js';

const FlexiblePlotlyChart = ({
  data,
  chartType,
  chartTitle,
  xAxisTitle,
  yAxisTitle,
  onBarClick,
  issmallfont
}) => {
  
  const GENDER_COLORS = {
    'M': '#1f77b4',  // Blue
    'F': '#e377c2',  // Pink
    'O': '#2ca02c',
    'Male': '#1f77b4',  // Blue
    'Female': '#e377c2',  // Pink
    'Others': '#2ca02c'  // Green
  };
  const getCssVariable = (variable) => getComputedStyle(document.documentElement).getPropertyValue(variable);
  // Accessing the CSS variables
  // console.log(chartTitle, chartType)
  // console.log(Array.isArray(data))
  // console.log(data)
  if (!data || !(Array.isArray(data))) data = [];
  const backgroundColor = 'rgba(0,0,0,0)'
  const textColor = getCssVariable('--plotly-text-color');
  const legendBackgroundColor = getCssVariable('--plotly-legend-background-color');
  const legendBorderColor = getCssVariable('--plotly-legend-border-color');
  console.log(issmallfont)
  const getChartData = () => {
    if (!data) {
      return []
    }
    switch (chartType) {
      case 'line':
      case 'scatter':
        // console.log('line data')
        // console.log(data)
        return data.map(series => {
          // console.log('Series name:', series.name);
          // console.log('Assigned color:', GENDER_COLORS[series.name]);
          return {
            x: series.x,
            y: series.y,
            name: series.name,
            type: chartType,
            mode: 'lines+markers',
            marker: { color: GENDER_COLORS[series.name] }
          };
        });
      case 'bar':
      case 'groupedBar':
        return data.map(series => ({
          x: series.x,
          y: series.y,
          name: series.name,
          type: 'bar',
          marker: { color: GENDER_COLORS[series.name] || undefined }

        }));
      case 'stackedBar':
        return data.map(series => ({
          x: series.x,
          y: series.y,
          name: series.name,
          type: 'bar',
          stackgroup: 'one',
          marker: { color: GENDER_COLORS[series.name] || undefined }
        }));
      case 'area':
        return data.map(series => ({
          x: series.x,
          y: series.y,
          name: series.name,
          type: 'scatter',
          mode: 'lines',
          fill: 'tozeroy'
        }));
      case 'pie':
      case 'donut':
        // console.log('pie data')
        // console.log(data)
        return [{
          labels: data[0].labels,
          values: data[0].values,
          type: 'pie',
          textposition: 'inside',
          hole: chartType === 'donut' ? 0.4 : 0,
          marker: {
            colors: data[0].labels.map(label => {
              // console.log('Pie segment label:', label);
              // console.log('Assigned color:', GENDER_COLORS[label]);
              return GENDER_COLORS[label];
            })
          },
          sort: false
        }];
      case 'heatmap':
        if (data && data[0] && data[0].z) {
          return [{
            z: data[0].z,
            x: data[0].x || [],
            y: data[0].y || [],
            type: 'heatmap'
          }];
        } else {
          console.error('Invalid data structure for heatmap');
          return [{
            z: [[0]],
            x: ['No Data'],
            y: ['No Data'],
            type: 'heatmap'
          }];
        }
      case 'radar':
        return [{
          r: data[0].r,
          theta: data[0].theta,
          type: 'scatterpolar',
          fill: 'toself'
        }];
      case 'treemap':
        return [{
          type: 'treemap',
          labels: data[0].labels,
          parents: data[0].parents,
          values: data[0].values
        }];
      case 'sunburst':
        return [{
          type: 'sunburst',
          labels: data[0].labels,
          parents: data[0].parents,
          values: data[0].values
        }];
      case 'gauge':
        return [{
          type: 'indicator',
          mode: 'gauge+number',
          value: data[0].value,
          gauge: {
            axis: { range: [null, 100] },
            bar: { color: "darkblue" },
          }
        }];
      case 'pyramid':
        return [{
          y: data[0].y,
          x: data[0].x,
          type: 'funnel',
          orientation: 'h'
        }];
      case 'box':
        return data.map(series => ({
          y: series.y,
          name: series.name,
          type: 'box'
        }));
      case 'violin':
        return data.map(series => ({
          y: series.y,
          name: series.name,
          type: 'violin'
        }));
      default:
        return [];
    }
  };
  const font = issmallfont ? 10 : 12;
  const layout = {
    title: {
      text: chartTitle,
      font: { weight: 'bold' }
    },
    xaxis: {
      title: xAxisTitle,
      gridcolor: 'rgba(51, 51, 51, 1)',
      automargin: true,
      tickmode: 'array',
      tickvals: 'data',  // This tells Plotly to use all unique values from the data
      type: 'category',  // This treats the x values as discrete categories
    },
    yaxis: {
      title: yAxisTitle,
      gridcolor: 'rgba(51, 51, 51, 1)',
      automargin: true,
    },
    barmode: chartType === 'groupedBar' ? 'group' : undefined,
    plot_bgcolor: backgroundColor,
    paper_bgcolor: backgroundColor,
    font: { color: textColor, size: font },
    legend: {
      orientation: 'h',
      yanchor: 'bottom',
      y: 1.02,
      xanchor: 'right',
      x: 1,
      font: { size: 10 },
      bgcolor: legendBackgroundColor,
      bordercolor: legendBorderColor,
      borderwidth: 1,
    },
    margin: { l: 50, r: 50, t: 90, b: 90 },
    autosize: true,
    responsive: true
  };

  // Specific layout adjustments for certain chart types
  if (chartType === 'radar') {
    layout.polar = {
      radialaxis: { visible: true, range: [0, 100] }
    };
  } else if (chartType === 'pyramid') {
    layout.yaxis = { ...layout.yaxis, autorange: 'reversed' };
  } else if (['gauge', 'treemap', 'sunburst'].includes(chartType)) {
    layout.xaxis = undefined;
    layout.yaxis = undefined;
  } else if (['pie', 'donut'].includes(chartType)) {
    layout.showlegend = true;
    layout.legend = {
      ...layout.legend,
      orientation: 'vertical',
      yanchor: 'top',
      itemsizing: 'constant',
    };
    layout.margin = { l: 20, r: 20, t: 60, b: 20 };
  }

  // Check if data is empty
  const isDataEmpty = !data || data.length === 0;

  const chartData = isDataEmpty && ['pie', 'donut'].includes(chartType)
    ? [{
      type: 'pie',
      labels: ['No Data'],
      values: [1],
      textinfo: 'none',
      hoverinfo: 'none',
      marker: { colors: ['#e0e0e0'] },
      hole: chartType === 'donut' ? 0.4 : 0
    }]
    : getChartData();
  const handlePlotClick = (event) => {
    const point = event.points[0];
    console.log(point)
    if (point && onBarClick && (chartType === 'bar' || chartType === 'groupedBar'||chartType==='line'||chartType==='area')) {
      const clickedX = point.x.toString();
      const seriesName = point.data.name;
      console.log(seriesName)
      console.log(clickedX)
      // Find the index of the clicked x value in the original data
      const clickedIndex = data.find(series => series.name === seriesName).x.indexOf(clickedX);
      console.log("clicked index",clickedIndex)
      // Filter the data for all series at this index
      const filteredData = data.map(series => ({
        name: series.name,
        x: series.x[clickedIndex],
        y: series.y[clickedIndex]
      }));

      console.log('About to call onBarClick with filteredData:', filteredData);
      onBarClick(filteredData);
    }
  };
  return (
    <Plot
      data={chartData}
      layout={layout}
      useResizeHandler={true}
      style={{ width: '100%', height: '100%' }}
      config={{ responsive: true }}
      onClick={handlePlotClick}
    />
  );
};

export default FlexiblePlotlyChart;