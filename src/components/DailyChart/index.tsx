import { Box } from '@mui/material';
import { styled } from '@mui/system';
import { TokenDropMenu } from '../Dropdown/TokenDrop';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import './index.css';
import { useEffect, useState } from 'react';
import { useNetwork, useAccount } from 'wagmi';

export const DailyPerformanceChart = () => {

  const [token, setToken] = useState('ALL');
  const [data, setData] = useState<any>([]);
  const { address } = useAccount();
  const { chain } = useNetwork();

  useEffect(() => {
    const x = async () => {
      if (address && chain?.id) {
        const toFetch = "https://stats-bg6gz.ondigitalocean.app/"+chain.id.toString()+"/"+address;
        const response = await fetch(toFetch);
        const resData = await response.json();
        setData(resData);        
      }
    }
    x();
  }, []);

  const configPrice = {
    yAxis: [
      {
        offset: 20,
        labels: {
          x: -15,
          style: {
            color: '#777E90',
            position: 'absolute'
          },
          align: 'left'
        }
      }
    ],
    tooltip: {
      shared: true,
      style: {
        color: '#777E90'
      }
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
    xAxis: {
      type: 'date'
    },
    rangeSelector: {
      buttons: [
        {
          type: 'day',
          count: 1,
          text: '1d'
        },
        {
          type: 'day',
          count: 7,
          text: '7d'
        },
        {
          type: 'month',
          count: 1,
          text: '1m'
        },
        {
          type: 'month',
          count: 3,
          text: '3m'
        },
        {
          type: 'all',
          text: 'All'
        }
      ],
      selected: 4
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
      <ChartAction>
        <TokenDropMenu state={token} setState={setToken} />
        <LabelGroup>
          <LabelPnL>
            <Label title="Daily PNL:" value="65.254K" valueColor="#27A69A" />
            <Label title="Weekly PNL:" value="2.418B" valueColor="#27A69A" />
          </LabelPnL>
          <Label title="N. of settled positions (24h):" value="0" valueColor="#FFFFFF" />
          <Label title="N. of settled positions (7d):" value="0" valueColor="#FFFFFF" />
        </LabelGroup>
      </ChartAction>
      <ChartContainer>
        <HighchartsReact highcharts={Highcharts} constructorType={'stockChart'} options={configPrice} />
      </ChartContainer>
    </Container>
  );
};

const Container = styled(Box)(({ theme }) => ({
  minHeight: '560px',
  height: '100%',
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
