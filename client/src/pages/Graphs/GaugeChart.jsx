import React from 'react';
import GaugeChart from 'react-gauge-chart'
import Styles from './Graphs.module.css'
const Gaugechart = ({ Rate }) => {
  return (<>
    <div style={{ width: '50%', textAlign: 'center', margin: 'auto' }}>
      <h2 className={Styles.h2_heading}>Survival Rate</h2>
      <GaugeChart
        id="gauge-chart5"
        nrOfLevels={420}
        arcsLength={[0.3, 0.5, 0.2]}
        colors={['#EA4228', '#F5CD19', '#5BE12C']}
        percent={Rate}
        arcPadding={0.02}
        textColor="#345243"
        needleColor="#FFA500"
        needleBaseColor="#FFDBBB"
        style={{ height: '140px', width: '300px' }}
      />
    </div>
  </>
  );
};

export default Gaugechart;