import { Box } from '@mui/material';
import { styled } from '@mui/system';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import { ResponsiveContainer, XAxis, YAxis } from 'recharts';
import './index.css';
import { useEffect, useState, useRef } from 'react';
import { useNetwork, useAccount } from 'wagmi';
import socketio from "socket.io-client";

export const DailyPerformanceChart = () => {
  const [data, setData] = useState([]);
  const [zoomIndex, setZoomIndex] = useState(4);
  const { address } = useAccount();
  const { chain } = useNetwork();

  const fetchData = async () => {
    const chainId = chain?.id;
    if (address && chainId) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      const toFetch = `https://trader-stats-tr8mu.ondigitalocean.app/performance/${chainId}/${address}`;
      const response = await fetch(toFetch);
      const resData = await response.json();
      if (resData.length !== data.length) {
        setData(resData);
      }
    }
  };

  useEffect(() => {
    if (address) {
      fetchData();
    }

    const socket = socketio(new Date().getTimezoneOffset() < -120 ? 'https://us1events.tigristrade.info' : 'https://eu1events.tigristrade.info', { transports: ['websocket'] });

    socket.on('error', (error: any) => {
      console.log('Events Socket Error:', error);
    });

    socket.on('AddressEvent', (data) => {
      if (chain?.id === data.chainId && data.trader === address) {
        isSetting.current = true;
        setTimeout(() => {
          fetchData();
        }, 0);
      }
    });

    return () => {
      socket.disconnect();
    }
  }, [chain, address]);

  const isSetting = useRef(false)
  useEffect(() => {
    if (isSetting.current) {
      const _data = [...data];
      isSetting.current = false;
      setData(_data);
    }
  }, [data]);

  const configPrice = {
    yAxis: {
      offset: 40,
      tickLength: 40,
      tickPosition: 'outside'
    },
    tooltip: {
      split: false,
      shared: true,
      x: XAxis,
      y: YAxis,
      formatter: function () {
        let tooltip = '<div style="color:#00DBE3;">' + '$' + Number(this.y).toFixed(2) + '</div><br/>';
        const temp = Highcharts.dateFormat('%b %e %Y, %H:%M', Number(this.x));
        tooltip += `<div style = "color : #C4C4F6; padding-top : 10px;">${temp}</div>`;
        return tooltip;
      },
      style: { opacity: 0.9 },
      padding: 10,
      backgroundColor: '#040218'
    },
    plotOptions: {
      spline: {
        lineWidth: 4,
        states: {
          hover: {
            lineWidth: 5
          }
        },
        marker: {
          enabled: true
        },
        pointInterval: 3600000, // one hour
        pointStart: Date.UTC(2022, 5, 13, 0, 0, 0)
      },
      series: {
        animation: false
      }
    },
    chart: {
      height: 600,
      animation: false
    },

    credits: {
      enabled: false
    },

    legend: {
      enabled: false,
      style: {
        backgroundColor: 'red'
      }
    },
    rangeSelector: {
      inputEnabled: true,
      inputLabel: true,
      labelStyle: {
        display: 'none'
      },
      allButtonsEnabled: true,
      xAxis: {
        minRange: 3600000
      },
      selected: zoomIndex,
      buttons: [
        {
          type: 'hour',
          count: 24,
          text: '1d',
          events: {
            click() {
              setZoomIndex(0);
              fetchData();
            }
          }
        },
        {
          type: 'day',
          count: 7,
          text: '7d',
          events: {
            click() {
              setZoomIndex(1);
              fetchData();
            }
          }
        },
        {
          type: 'month',
          count: 1,
          text: '1m',
          events: {
            click() {
              setZoomIndex(2);
              fetchData();
            }
          }
        },
        {
          type: 'month',
          count: 3,
          text: '3m',
          events: {
            click() {
              setZoomIndex(3);
              fetchData();
            }
          }
        },
        {
          type: 'all',
          text: 'All',
          events: {
            click() {
              setZoomIndex(4);
              fetchData();
            }
          }
        }
      ]
    },
    series: [
      {
        name: 'PnL',
        lineWidth: 4,
        marker: {
          radius: 4
        },
        data: data,
        tooltip: {
          valueDecimals: 2
        }
      }
    ]
  };
  return (
    <Container>
      <ChartContainer>
        {/* <HighchartsReact highcharts={Highcharts} constructorType={'stockChart'} options={configPrice} /> */}

        <ResponsiveContainer>
          {data.length > 0 ? (
            <HighchartsReact highcharts={Highcharts} constructorType={'stockChart'} options={configPrice} />
          ) : (
            <NoData>
              <p>Start trading to see your performance</p>
            </NoData>
          )}
        </ResponsiveContainer>
      </ChartContainer>
    </Container>
  );
};

const Container = styled(Box)(({ theme }) => ({
  minHeight: '560px',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#18191D',
  order: 4,
  [theme.breakpoints.down('desktop')]: {
    gridColumn: '1 / 3'
  }
}));

const ChartAction = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  padding: '19px',
  alignItems: 'center',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center'
  }
}));

const LabelGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  gap: '5px',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column'
  }
}));

interface LabelProps {
  title: string;
  value: string;
  valueColor?: string;
}

const Label = (props: LabelProps) => {
  const { title, value, valueColor } = props;
  return (
    <LabelContainer>
      <LabelTitle>{title}</LabelTitle>
      <Box sx={{ color: valueColor }}>{value}</Box>
    </LabelContainer>
  );
};

const LabelContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '5px',
  fontSize: '12px',
  lineHeight: '16px'
}));

const LabelTitle = styled(Box)(({ theme }) => ({
  color: '#777E91'
}));

const ChartContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%'
}));

const LabelPnL = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '5px'
}));

const NoData = styled(Box)(({ theme }) => ({
  fontSize: '20px',
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  paddingTop: '4rem'
}));
