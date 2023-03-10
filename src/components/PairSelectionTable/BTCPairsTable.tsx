import { Star, StarBorder } from '@mui/icons-material';
import { Box, Table, TableBody, TableCell, TableHead, TableRow, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import { useEffect, useState } from 'react';
import { ethLogo, linkLogo, xmrLogo } from '../../config/images';
import { getNetwork } from '../../../src/constants/networks';
import { oracleSocket1, oracleData, priceChangeData, priceChangeSocket } from '../../../src/context/socket';

function createData(pair: React.ReactElement, pairIndex: number) {
  return {
    pair,
    pairIndex
  };
}

interface PairFieldProps {
  favor: boolean;
  handleFavoriteToggle: any;
  icon: string;
  name: string;
}
const PairField = ({ favor, handleFavoriteToggle, icon, name }: PairFieldProps) => {
  const handleStarClick = (event: React.MouseEvent, setFav: boolean) => {
    handleFavoriteToggle(name, setFav);
    event.stopPropagation();
  };

  return (
    <PairFieldContainer>
      {favor ? (
        <IconButton
          onClick={(e) => {
            handleStarClick(e, false);
          }}
          sx={{ padding: '0px' }}
        >
          <Star sx={{ color: '#FABE3C', width: '20px', height: '20px' }} />
        </IconButton>
      ) : (
        <IconButton
          onClick={(e) => {
            handleStarClick(e, true);
          }}
          sx={{ padding: '0px' }}
        >
          <StarBorder sx={{ width: '20px', height: '20px' }} />
        </IconButton>
      )}
      <img src={icon} style={{ maxHeight: '24px' }} />
      <CoinName>{name}</CoinName>
    </PairFieldContainer>
  );
};

interface BenefitProps {
  percent: string;
  value: string;
}

const Benefit = ({ percent, value }: BenefitProps) => {
  return (
    <BenefitContainer sx={{ color: Number(value) > 0 ? '#26A69A' : Number(value) < 0 ? '#EF534F' : "#B1B5C3" }}>
      {Number(percent) > 0 ? `+${percent}%` : `${percent}%`.replace("NaN", "0")}<p>{(Number(value) > 0 ? "+" : "") + value.replace("NaN", "0")}</p>
    </BenefitContainer>
  );
};

interface Props {
  setPairIndex: any;
  searchQuery: any;
  onClose: any;
}

interface PriceCellProps {
  setPairIndex: any;
  pairIndex: any;
}

export const PriceCell = ({ setPairIndex, pairIndex }: PriceCellProps) => {
  const { assets } = getNetwork(0);
  useEffect(() => {
    oracleSocket1.on('data', (data: any) => {
      if (data[pairIndex] && data[pairIndex].price !== oraclePrice) {
        setOraclePrice(data[pairIndex].price);
      }
    });
  }, []);

  const [oraclePrice, setOraclePrice] = useState(
    oracleData === 'Loading...'
      ? 'Loading...'
      : !oracleData[pairIndex]
      ? 'Loading...'
      : (oracleData[pairIndex] as any).price
  );

  return (
    <>
      <TableCell align="center" sx={{ width: '125px' }} onClick={() => setPairIndex(pairIndex)}>
        {oraclePrice === 'Loading...'
          ? 'Loading...'
          : (oraclePrice / 1e18).toFixed(assets[pairIndex].decimals)}
      </TableCell>
    </>
  );
};

export const ChangeCell = ({ setPairIndex, pairIndex }: PriceCellProps) => {
  useEffect(() => {
    priceChangeSocket.on('data', (data: any) => {
      if (data.priceChange) {
        setPriceChange({priceChange: data.priceChange[pairIndex], priceChangePercent: data.priceChangePercent[pairIndex]});
      }
    });
  }, []);

  const [priceChange, setPriceChange] = useState(
    priceChangeData === 'Loading...'
      ? "Loading..."
      : {priceChange: (priceChangeData as any).priceChange[pairIndex] as number, priceChangePercent: (priceChangeData as any).priceChangePercent[pairIndex] as number}
  );

  return (
    <>
      <TableCell align="center" sx={{ width: '100px' }} onClick={() => setPairIndex(pairIndex)}>
        <Benefit value={priceChange === "Loading..." ? "Loading..." : (priceChange as any).priceChange.toPrecision(4)} percent={priceChange === "Loading..." ? "Loading..." : (priceChange as any).priceChangePercent.toFixed(2)}/>
      </TableCell>
    </>
  );
};

export const BTCPairsTable = ({ setPairIndex, searchQuery, onClose }: Props) => {
  const [FavPairs, setFavPairs] = useState<string[]>(
    JSON.parse(
      localStorage.getItem('FavPairs') === null
        ? '["BTC/USD", "ETH/USD"]'
        : (localStorage.getItem('FavPairs') as string)
    ) as string[]
  );

  function handleFavoriteToggle(name: string, setFav: boolean) {
    const favPairs: any = JSON.parse(localStorage.getItem('FavPairs') as string);
    if (setFav) {
      favPairs.push(name);
    } else {
      favPairs.splice(FavPairs.indexOf(name), 1);
    }
    localStorage.setItem('FavPairs', JSON.stringify(favPairs));
    setFavPairs(favPairs);
  }

  const rows = [
    createData(
      <PairField
        favor={FavPairs.includes('ETH/BTC')}
        handleFavoriteToggle={handleFavoriteToggle}
        icon={ethLogo}
        name={'ETH/BTC'}
      />,
      11
    ),
    createData(
      <PairField
        favor={FavPairs.includes('LINK/BTC')}
        handleFavoriteToggle={handleFavoriteToggle}
        icon={linkLogo}
        name={'LINK/BTC'}
      />,
      33
    ),
    createData(
      <PairField
        favor={FavPairs.includes('XMR/BTC')}
        handleFavoriteToggle={handleFavoriteToggle}
        icon={xmrLogo}
        name={'XMR/BTC'}
      />,
      34
    )
  ].filter((pair) => pair.pair.props.name.includes(searchQuery));

  return (
    <>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: '#777E90', width: '150px' }}>Pair</TableCell>
            <TableCell sx={{ color: '#777E90', width: '125px' }}>Current Price</TableCell>
            <TableCell align="center" sx={{ color: '#777E90' }}>
              24h
            </TableCell>
          </TableRow>
        </TableHead>
      </Table>
      <TbodyContainer>
        <Table sx={{ tableLayout: 'fixed' }}>
          <TableBody>
            {rows.map((row, index) => (
              <CustomTableRow key={index} onClick={() => {setPairIndex(row.pairIndex); onClose();}}>
                <TableCell sx={{ width: '150px' }}>{row.pair}</TableCell>
                <PriceCell setPairIndex={setPairIndex} pairIndex={row.pairIndex} />
                <ChangeCell setPairIndex={setPairIndex} pairIndex={row.pairIndex} />
              </CustomTableRow>
            ))}
          </TableBody>
        </Table>
      </TbodyContainer>
    </>
  );
};

const PairFieldContainer = styled(Box)({
  display: 'flex',
  gap: '10px',
  alignItems: 'center'
});

const CoinName = styled(Box)({
  fontWeight: 700,
  fontSize: '12px',
  letterSpacing: '1.25px',
  border: '10px solid rgba(0, 0, 0, 0)',
  marginLeft: '-10px'
});

const BenefitContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '3px',
  fontSize: '12px',
  fontWeight: 400
});

const CustomTableRow = styled(TableRow)({
  '&:hover': { backgroundColor: '#1E1F25', cursor: 'pointer' }
});

const TbodyContainer = styled(Box)(({ theme }) => ({
  height: '400px',
  overflowY: 'auto',
  [theme.breakpoints.down('desktop')]: {
    height: '500px'
  }
}));
