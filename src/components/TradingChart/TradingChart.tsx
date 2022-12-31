/* eslint-disable */
// import React, { useContext, useCallback, useState, useEffect} from 'react';
// import {createChart, CrosshairMode} from 'lightweight-charts';
// import { SocketContext} from '../../context/socket';
import { TVChartContainer } from './TradingView/index';

interface Props {
  asset: any;
  positionData: any;
}

const TradingChart = ({ asset, positionData }: Props) => {
  return (
    <div style={{
      width: '100%',
      height: '640px',
      userSelect: 'none',
      MozUserSelect: 'none',
      KhtmlUserSelect: 'none',
      WebkitUserSelect: 'none'
    }}>
      <TVChartContainer asset={asset} positionData={positionData} />
    </div>
  );
};

export default TradingChart;
