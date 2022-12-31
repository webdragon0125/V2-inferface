import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/system';
import { Container } from '../../src/components/Container';
import { TokenDetails } from '../../src/components/TokenDetails';
import TradingChart from '../../src/components/TradingChart/TradingChart';
import { TradingOrderForm } from '../../src/components/TradingOrderForm';
import { TradingPositionTable } from '../../src/components/TradingPositionTable';
import { DailyPerformanceChart } from '../../src/components/DailyChart';
import { Chatbox } from '../../src/components/Chatbox';
import { useStore } from '../../src/context/StoreContext';
import { Cumulative } from './MiniPage/Cumulative';
import { PositionData } from 'src/components/Table/PositionData';

export const Trade = () => {

  const positionData = PositionData().positionData;

  const [pairIndex, setPairIndex] = useState(
    localStorage.getItem('LastPairSelected') !== null ? parseInt(localStorage.getItem('LastPairSelected') as string) : 0
  );
  const { miniPage } = useStore();

  useEffect(() => {
    if (localStorage.getItem('FavPairs') === null) localStorage.setItem('FavPairs', '["BTC/USD", "ETH/USD"]');
  }, []);

  return (
    <TradeContainer>

      {miniPage === 0 && (
        <>
          <Chatbox/>
          <TokenDetails pairIndex={pairIndex} setPairIndex={setPairIndex} />
          <Container>
            <TradingForm>
              <TradingSection>
                <TradingChart asset={pairIndex} positionData={positionData} />
              </TradingSection>
              <OrderFormContainer>
                <TradingOrderForm pairIndex={pairIndex} />
              </OrderFormContainer>
            </TradingForm>
            <TradingPositionTable setPairIndex={setPairIndex} positionData={positionData} />
            <DailyPerformanceChart />
          </Container>
        </>
      )}
      {miniPage === 1 && <Cumulative />}
    </TradeContainer>
  );
};

const TradeContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  overflowX: 'hidden'
});

const TradingForm = styled(Box)(({ theme }) => ({
  width: '100%',
  marginTop: '5px',
  display: 'grid',
  gridTemplateColumns: '3fr 1fr',
  gap: '5px',
  marginBottom: '5px',
  [theme.breakpoints.down('desktop')]: {
    gridTemplateColumns: '1fr 3fr'
  }
}));

const TradingSection = styled(Box)(({ theme }) => ({
  // backgroundColor: 'gray',
  width: '100%',
  [theme.breakpoints.down('desktop')]: {
    gridColumn: '1 / 3',
    order: 1
  }
}));

const OrderFormContainer = styled(Box)(({ theme }) => ({
  width: '400px',
  maxWidth: '400px',
  height: '100%',
  backgroundColor: '#18191D',
  [theme.breakpoints.down('desktop')]: {
    order: 2
  },
  [theme.breakpoints.down('md')]: {
    order: 2
  }
}));
