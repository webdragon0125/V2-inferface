import { useState, useEffect, useRef } from 'react';
import { Box, Button } from '@mui/material';
import { styled } from '@mui/system';
import { Container } from 'src/components/Container';
import { Notification } from 'src/components/Notification';
import { useAccount, useNetwork } from 'wagmi';
import { getShellAddress, sendGasBack, checkShellWallet } from 'src/shell_wallet';
import { ethers } from 'ethers';
import { getNetwork } from 'src/constants/networks';
import { toast } from 'react-toastify';
import { VaultInput } from 'src/components/Input';
import { PolygonSvg, ethLogo } from 'src/config/images';
import { useGasBalance } from 'src/hook/useGasBalance';
import { getSigner } from 'src/contracts';

export const Proxy = () => {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { proxyGas } = getNetwork(chain?.id);

  const [shellAddress, setShellAddress] = useState('Loading...');
  const [gasBalanceData, setGasBalanceData] = useState<any>({ formatted: '0', symbol: 'ETH' });
  const liveGasBalance = useGasBalance(getShellAddress());
  useEffect(() => {
    checkShellWallet(address as string);
    setShellAddress(getShellAddress());
    setGasBalanceData(liveGasBalance);
    getProxy();
  }, [liveGasBalance, address, chain]);

  const shellExpire = useRef(0);

  const [editState, setEditState] = useState({
    extendValue: '1',
    fundValue: proxyGas
  });
  const handleEditState = (prop: string, value: any) => {
    setEditState({
      ...editState,
      [prop]: value
        .replace(/[^0-9.]/g, '')
        .replace(/(\..*?)\..*/g, '$1')
        .replace(/^0[^.]/, '0')
    });
  };

  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  function getApprovalHours() {
    if (shellExpire.current === 0) return '0';
    const now = Math.floor(Date.now() / 1000);
    const h = Math.floor((shellExpire.current - now) / 3600);
    setHours(h > 0 ? h : 0);
  }
  function getApprovalMinutes() {
    if (shellExpire.current === 0) return '0';
    const now = Math.floor(Date.now() / 1000);
    const m = Math.floor(((shellExpire.current - now) % 3600) / 60);
    setMinutes(m > 0 ? m : 0);
  }
  function getApprovalSeconds() {
    if (shellExpire.current === 0) return '0';
    const now = Math.floor(Date.now() / 1000);
    const s = Math.floor((shellExpire.current - now) % 60);
    setSeconds(s > 0 ? s : 0);
  }

  useEffect(() => {
    setInterval(() => {
      getApprovalHours();
      getApprovalMinutes();
      getApprovalSeconds();
    }, 1000);
  }, []);

  async function getTradingContract() {
    const currentNetwork = getNetwork(chain?.id);
    return new ethers.Contract(currentNetwork.addresses.trading, currentNetwork.abis.trading, getSigner());
  }

  async function getProxy() {
    const tradingContract = await getTradingContract();
    const proxy = await tradingContract.proxyApprovals(address);
    const exp = parseInt(proxy[1]);
    shellExpire.current = exp;
  }

  function handleSendGasBack() {
    sendGasBackToWallet();
  }
  async function sendGasBackToWallet() {
    const tx = sendGasBack(address);
    await toast.promise(tx, {
      pending: 'Sending gas back...',
      success: 'Successfully sent gas back!',
      error: 'Failed to send gas back!'
    });
  }

  function handleExtendShell() {
    extendShell();
  }
  async function extendShell() {
    const tradingContract = await getTradingContract();
    if (!tradingContract) return;
    const gasPriceEstimate = Math.round((await tradingContract.provider.getGasPrice()).toNumber() * 1.5);
    const now = Math.floor(Date.now() / 1000);
    const tx = tradingContract?.approveProxy(shellAddress, now + 86400 * parseFloat(editState.extendValue), {
      gasPrice: gasPriceEstimate,
      value: 0
    });
    await toast.promise(tx, {
      pending: 'Setting approval period...',
      success: 'Successfully set approval period!',
      error: 'Failed to set approval period!'
    });
    shellExpire.current = now + 86400 * parseFloat(editState.extendValue);
  }

  function handleFundShell() {
    fundShell();
  }
  async function fundShell() {
    const tradingContract = await getTradingContract();
    if (!tradingContract) return;
    const gasPriceEstimate = Math.round((await tradingContract.provider.getGasPrice()).toNumber() * 1.5);
    const tx = tradingContract?.approveProxy(shellAddress, shellExpire.current, {
      gasPrice: gasPriceEstimate,
      value: ethers.utils.parseEther(editState.fundValue)
    });
    await toast.promise(tx, {
      pending: 'Funding proxy wallet...',
      success: 'Successfully funded proxy wallet!',
      error: 'Failed to fund proxy wallet!'
    });
  }

  function copy() {
    navigator.clipboard.writeText(shellAddress);
  }

  const handleAddressClick = () => {
    let newLink = '';
    if (shellAddress !== undefined && isConnected) {
      if (chain?.id === 137) {
        newLink = 'https://polygonscan.com/address/';
      } else if (chain?.id === 42161) {
        newLink = 'https://arbiscan.io/address/';
      } else if (chain?.id === 421613) {
        newLink = 'https://goerli.arbiscan.io/address/';
      } else {
        newLink = 'https://etherscan.io/';
      }
      window.open(`${newLink}${shellAddress}`, '_blank');
    } else {
      window.open('https://etherscan.io/', '_blank');
    }
  };

  return (
    <Container>
      <ProxyContainer>
        <ShellWalletMedia>
          <MediaBar>Proxy Wallet</MediaBar>
          <MediaContent>
            <Notification
              content="Proxy wallet is a frontend wallet that enables instant one-click trades. You need to fund the wallet
                with MATIC on Polygon or ETH on Arbitrum to start trading."
            />
            <AddressSection>
              <p>Address</p>
              <DesktopAddress
                onClick={() => handleAddressClick()}
                style={{ color: '#3772FF', fontSize: '14px', textTransform: 'capitalize' }}
              >
                {isConnected ? shellAddress : 'Wallet is not connected'}
              </DesktopAddress>
              <MobileAddress onClick={() => handleAddressClick()}>
                {isConnected ? shellAddress : 'Wallet is not connected'}
              </MobileAddress>
            </AddressSection>
            <CopyAddressButton onClick={() => copy()}>Copy proxy wallet address</CopyAddressButton>
          </MediaContent>
        </ShellWalletMedia>
        <ShellWalletAction>
          <GasBalanceContainer>
            <GasBalance>
              {gasBalanceData ? gasBalanceData?.formatted.slice(0, 6) : '0'} {chain?.nativeCurrency.symbol}
            </GasBalance>
            <p style={{ color: '#B1B5C3', fontSize: '15px', lineHeight: '20px' }}>Proxy wallet gas balance</p>
          </GasBalanceContainer>
          <ApproveContainer>
            <ApprovePeriod>
              <TimeBox>
                <TimeValue>{hours}</TimeValue>
                <TimeType>Hours</TimeType>
              </TimeBox>
              :
              <TimeBox>
                <TimeValue>{minutes}</TimeValue>
                <TimeType>Minutes</TimeType>
              </TimeBox>
              :
              <TimeBox>
                <TimeValue>{seconds}</TimeValue>
                <TimeType>Seconds</TimeType>
              </TimeBox>
            </ApprovePeriod>
          </ApproveContainer>
          <ApproveLabel>Proxy wallet approval period</ApproveLabel>
          <ButtonGroup>
            <InputFieldContainer>
              <VaultInput
                name="extendValue"
                type="text"
                value={editState.extendValue}
                setValue={handleEditState}
                placeholder={'0'}
                component={<InputLabel content="Days" />}
              />
              <ExtendApproveButton onClick={() => handleExtendShell()}>Set approval period</ExtendApproveButton>
            </InputFieldContainer>
            <InputFieldContainer>
              <VaultInput
                name="fundValue"
                type="text"
                value={editState.fundValue}
                setValue={handleEditState}
                placeholder={'0'}
                component={<TokenUnit symbol={chain?.nativeCurrency.symbol} />}
              />
              <SendGasButton onClick={() => handleFundShell()}>Fund proxy wallet</SendGasButton>
            </InputFieldContainer>
            <WithdrawButton onClick={() => handleSendGasBack()}>Withdraw balance</WithdrawButton>
          </ButtonGroup>
        </ShellWalletAction>
      </ProxyContainer>
    </Container>
  );
};

const ProxyContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '13px',
  padding: '70px',
  justifyContent: 'center',
  [theme.breakpoints.down('lg')]: {
    flexDirection: 'column',
    alignItems: 'center'
  },
  [theme.breakpoints.down(768)]: {
    paddingLeft: '20px',
    paddingRight: '20px'
  },
  [theme.breakpoints.down('xs')]: {
    paddingLeft: '0',
    paddingRight: '0'
  }
}));

const ShellWalletMedia = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '7px',
  width: '550px',
  [theme.breakpoints.down('lg')]: {
    width: '100%'
  }
}));

const MediaBar = styled(Box)(({ theme }) => ({
  padding: '15px 23px',
  fontSize: '12px',
  lineHeight: '20px',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  backgroundColor: '#18191D'
}));

const MediaContent = styled(Box)(({ theme }) => ({
  padding: '23px',
  display: 'flex',
  flexDirection: 'column',
  gap: '23px',
  backgroundColor: '#18191D'
}));

const AddressSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  fontSize: '12px',
  lineHeight: '24px',
  color: '#B1B5C3',
  padding: '0 4px',
  [theme.breakpoints.down(520)]: {
    flexDirection: 'column'
  }
}));

const CopyAddressButton = styled(Button)(({ theme }) => ({
  borderRadius: '0px',
  backgroundColor: '#3772FF',
  '&:hover': {
    backgroundColor: '#3772FF'
  },
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '40px',
  width: '100%',
  textTransform: 'none',
  fontSize: '14px',
  lineHeight: '24px'
}));

const ShellWalletAction = styled(Box)(({ theme }) => ({
  //   width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alingItems: 'center',
  backgroundColor: '#18191D',
  width: '400px',
  [theme.breakpoints.down('lg')]: {
    width: '100%'
  }
}));

const GasBalanceContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  flexDirection: 'column',
  gap: '10px',
  padding: '28px',
  borderBottom: '1px solid #1F2332'
}));

const GasBalance = styled(Box)(({ theme }) => ({
  fontSize: '25px',
  lineHeight: '33px',
  fontWeight: '500'
}));

const ApproveContainer = styled(Box)(({ theme }) => ({
  padding: '28px',
  width: '100%'
}));

const ApprovePeriod = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  gap: '11px',
  justifyContent: 'center',
  fontWeight: 700,
  fontSize: '20px',
  lineHeight: '20px',
  alignItems: 'center'
}));

const TimeBox = styled(Box)(({ theme }) => ({
  width: '95px',
  height: '84px',
  backgroundColor: '#222630',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '11px'
}));

const TimeValue = styled(Box)(({ theme }) => ({
  fontSize: '28px',
  fontWeight: '700',
  lineHeight: '20px'
}));

const TimeType = styled(Box)(({ theme }) => ({
  fontSize: '12px',
  lineHeight: '20px',
  fontWeight: '700',
  color: '#B1B5C3'
}));

const ApproveLabel = styled(Box)(({ theme }) => ({
  color: '#B1B5C3',
  fontSize: '15px',
  lineHeight: '20px',
  fontWeight: '500',
  textAlign: 'center',
  marginTop: '-14px'
}));

const ButtonGroup = styled(Box)(({ theme }) => ({
  padding: '28px',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '15px'
}));

const ExtendApproveButton = styled(Button)(({ theme }) => ({
  background: 'none',
  borderRadius: '0px',
  width: '100%',
  height: '40px',
  textTransform: 'none',
  border: '1px solid #3772FF',
  fontSize: '12px',
  lineHeight: '24px',
  fontWeight: '700',
  [theme.breakpoints.down(1024)]: {
    fontSize: '14px'
  },
  [theme.breakpoints.down(490)]: {
    fontSize: '12px'
  },
  [theme.breakpoints.down(400)]: {
    fontSize: '10px'
  },
  [theme.breakpoints.down(360)]: {
    fontSize: '14px'
  }
}));

const SendGasButton = styled(Button)(({ theme }) => ({
  marginT: '10px',
  backgroundColor: '#3772FF',
  borderRadius: '0px',
  width: '100%',
  height: '40px',
  textTransform: 'none',
  border: '1px solid #3772FF',
  fontSize: '12px',
  lineHeight: '24px',
  fontWeight: '700',
  '&:hover': {
    backgroundColor: '#3772FF'
  },
  [theme.breakpoints.down(1024)]: {
    fontSize: '14px'
  },
  [theme.breakpoints.down(490)]: {
    fontSize: '12px'
  },
  [theme.breakpoints.down(400)]: {
    fontSize: '10px'
  },
  [theme.breakpoints.down(360)]: {
    fontSize: '14px'
  }
}));

const WithdrawButton = styled(Button)(({ theme }) => ({
  marginT: '10px',
  backgroundColor: 'none',
  borderRadius: '0px',
  width: '100%',
  height: '40px',
  textTransform: 'none',
  border: '1px solid #ffffff',
  fontSize: '14px',
  lineHeight: '24px',
  fontWeight: '700'
}));

const DesktopAddress = styled(Box)(({ theme }) => ({
  color: '#3772FF',
  fontSize: '14px',
  textTransform: 'capitalize',
  cursor: 'pointer',
  [theme.breakpoints.down('sm')]: {
    display: 'none'
  }
}));

const MobileAddress = styled(Box)(({ theme }) => ({
  color: '#3772FF',
  fontSize: '14px',
  textTransform: 'capitalize',
  display: 'none',
  cursor: 'pointer',
  [theme.breakpoints.down('sm')]: {
    display: 'block'
  }
}));

const InputFieldContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  gap: '20px',
  alignItems: 'center',
  [theme.breakpoints.down(360)]: {
    flexDirection: 'column'
  }
}));

interface LabelProps {
  content: string | undefined;
}

const InputLabel = ({ content }: LabelProps) => {
  return <InputLabelContainer>{content}</InputLabelContainer>;
};

const InputLabelContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '12px',
  [theme.breakpoints.down(1024)]: {
    fontSize: '14px'
  },
  [theme.breakpoints.down(490)]: {
    fontSize: '12px'
  },
  [theme.breakpoints.down(400)]: {
    fontSize: '10px'
  },
  [theme.breakpoints.down(360)]: {
    fontSize: '14px'
  }
}));

interface TokenUnitProps {
  symbol?: string;
}

const TokenUnit = ({ symbol }: TokenUnitProps) => {
  let icon = ethLogo;
  if (symbol === 'ETH') {
    icon = ethLogo;
  } else if (symbol === 'MATIC') {
    icon = PolygonSvg;
  }
  return (
    <TokenUnitContainer>
      <TokenIcon src={icon} alt="token-icon" />
      <TokenName>{symbol}</TokenName>
    </TokenUnitContainer>
  );
};

const TokenIcon = styled('img')(({ theme }) => ({
  width: '20px',
  height: '20px'
}));

const TokenUnitContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '10px'
}));

const TokenName = styled(Box)(({ theme }) => ({
  fontSize: '12px',
  [theme.breakpoints.down(1024)]: {
    fontSize: '14px'
  },
  [theme.breakpoints.down(490)]: {
    fontSize: '12px'
  },
  [theme.breakpoints.down(400)]: {
    fontSize: '10px'
  },
  [theme.breakpoints.down(360)]: {
    fontSize: '14px'
  }
}));
