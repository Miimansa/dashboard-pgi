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
  
  if (!data || !(Array.isArray(data))) data = [];
  const backgroundColor = 'rgba(0,0,0,0)'
  const textColor = getCssVariable('--plotly-text-color');
  const legendBackgroundColor = getCssVariable('--plotly-legend-background-color');
  const legendBorderColor = getCssVariable('--plotly-legend-border-color');

  const isDataEmpty = !data || data.length === 0 || (data[0] && Object.keys(data[0]).length === 0);

  const getChartData = () => {
    if (isDataEmpty) {
      return [{
        type: 'scatter',
        x: [0],
        y: [0],
        mode: 'text',
        text: ['No data available'],
        textposition: 'middle center',
        hoverinfo: 'none'
      }];
    }

    switch (chartType) {
      case 'line':
      case 'scatter':
        return data.map(series => ({
          x: series.x,
          y: series.y,
          name: series.name,
          type: chartType,
          mode: 'lines+markers',
          marker: { color: GENDER_COLORS[series.name] }
        }));
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
        return [{
          labels: data[0].labels,
          values: data[0].values,
          type: 'pie',
          textposition: 'inside',
          hole: chartType === 'donut' ? 0.4 : 0,
          marker: {
            colors: data[0].labels.map(label => GENDER_COLORS[label])
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
    plot_bgcolor: backgroundColor,
    paper_bgcolor: backgroundColor,
    font: { color: textColor, size: font },
    autosize: true,
    responsive: true,
    showlegend: false,
    margin: { l: 20, r: 20, t: 60, b: 20 },
  };

  if (isDataEmpty) {
    layout.xaxis = { visible: false, showgrid: false, zeroline: false };
    layout.yaxis = { visible: false, showgrid: false, zeroline: false };
  } else {
    layout.xaxis = {
      title: xAxisTitle,
      gridcolor: 'rgba(51, 51, 51, 1)',
      automargin: true,
      tickmode: 'array',
      tickvals: 'data',
      type: 'category',
    };
    layout.yaxis = {
      title: yAxisTitle,
      gridcolor: 'rgba(51, 51, 51, 1)',
      automargin: true,
    };
    layout.legend = {
      orientation: 'h',
      yanchor: 'bottom',
      y: 1.02,
      xanchor: 'right',
      x: 1,
      font: { size: 10 },
      bgcolor: legendBackgroundColor,
      bordercolor: legendBorderColor,
      borderwidth: 1,
    };
    layout.margin = { l: 50, r: 50, t: 90, b: 90 };
    layout.showlegend = true;

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
  }

  const chartData = getChartData();

  const handlePlotClick = (event) => {
    if (isDataEmpty) return;

    const point = event.points[0];
    if (point && onBarClick && (chartType === 'bar' || chartType === 'groupedBar' || chartType === 'line' || chartType === 'area')) {
      const clickedX = point.x.toString();
      const seriesName = point.data.name;
      const clickedIndex = data.find(series => series.name === seriesName).x.indexOf(clickedX);
      const filteredData = data.map(series => ({
        name: series.name,
        x: series.x[clickedIndex],
        y: series.y[clickedIndex]
      }));
      onBarClick(filteredData);
    }
  };

  return (
    <Plot
      data={chartData}
      layout={layout}
      useResizeHandler={true}
      style={{ width: '100%', height: '100%' }}
      config={{ responsive: true, displayModeBar: !isDataEmpty }}
      onClick={!isDataEmpty ? handlePlotClick : undefined}
    />
  );
};

export default FlexiblePlotlyChart;