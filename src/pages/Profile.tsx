import { useState } from 'react';
import { Box, Button, FormControlLabel, FormGroup } from '@mui/material';
import { styled } from '@mui/system';
import { Container } from 'src/components/Container';
import { ArbiScanSvg, LOGO, PolygonSvg } from 'src/config/images';
import { TigrisCheckBox } from 'src/components/CheckBox';
import './css/profile.css';
import { TraderProfile } from 'src/context/profile';

export const Profile = () => {
  return (
    <Container>
      <GovernanceContainer>
        <Wrapper>
          <GovernanceAction>
            <NFTSaleSection>
              <SectionHeader>
                Trader Profile
              </SectionHeader>
              <SectionContent>
                <div style={{ display: 'flex', marginBottom: 20, marginTop: 5 }}>
                  <div>
                    <div className="profileBorder" style={{position: 'relative'}}/>
                    <img src={TraderProfile().profilePicture} style={{borderRadius: '9999px', width: '100px', height: '100px', position: 'absolute', marginTop: -100}} />
                  </div>
                  <div style={{ marginLeft: 50}}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <h4 style={{ margin: 0, fontWeight: 'normal', fontSize: '50px' }}>{TraderProfile().username}</h4>
                    </div>
                    <p style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: '13px' }}>{TraderProfile().description}</p>
                  </div>
                </div>
                <NFTDetails>
                  <NFTDetailItem>
                    <ItemTitle>Max Supply</ItemTitle>
                    <ItemValue>10.000</ItemValue>
                  </NFTDetailItem>
                  <NFTDetailItem>
                    <ItemTitle>Network</ItemTitle>
                    <ItemValue>
                      <img src={ArbiScanSvg} alt="arbitrum-icon" width={18} height={18} />
                      <span style={{ color: '#808183' }}>Arbitrum</span>
                    </ItemValue>
                  </NFTDetailItem>
                  <NFTDetailItem>
                    <ItemTitle>NFT Price</ItemTitle>
                    <ItemValue>
                      650 <span style={{ color: '#808183' }}>USDT</span>
                    </ItemValue>
                  </NFTDetailItem>
                  <NFTDetailItem>
                    <ItemTitle>Available NFTs</ItemTitle>
                    <ItemValue>
                      0 <span style={{ color: '#808183' }}>/ 200</span>
                    </ItemValue>
                  </NFTDetailItem>
                  <NumberController>
                    <ItemTitle>Number</ItemTitle>
                  </NumberController>
                  <NFTDetailItem>
                    <ItemTitle>Total price</ItemTitle>
                    <ItemValue>
                      650 <span style={{ color: '#808183' }}>USDT</span>
                    </ItemValue>
                  </NFTDetailItem>
                  <PrimaryButton>Approve</PrimaryButton>
                </NFTDetails>
              </SectionContent>
            </NFTSaleSection>
            <ClaimBridgeSection>
              <FeeCard>
                <FeeCardTitle>Fee distribution</FeeCardTitle>
                <FeeCardContent>
                  <img src={LOGO} alt="logo" width={30} height={30} />
                  $0.00 tigUSD
                </FeeCardContent>
                <PrimaryButton>Claim</PrimaryButton>
              </FeeCard>
              <BridgeLabel>Bridge</BridgeLabel>
              <BridgeAction>
                <BridgeActionLabel>From</BridgeActionLabel>
                <BridgeActionLabel>To</BridgeActionLabel>
                <NftIDCheckContainer>
                  <FormGroup>
                    <FormControlLabel
                      control={<TigrisCheckBox defaultChecked />}
                      label={<CheckBoxLabel primary="NFT ID" secondary="# 47832040" />}
                    />
                    <FormControlLabel
                      control={<TigrisCheckBox />}
                      label={<CheckBoxLabel primary="NFT ID" secondary="# 47832040" />}
                    />
                    <FormControlLabel
                      control={<TigrisCheckBox />}
                      label={<CheckBoxLabel primary="NFT ID" secondary="# 47832040" />}
                    />
                    <FormControlLabel
                      control={<TigrisCheckBox defaultChecked />}
                      label={<CheckBoxLabel primary="NFT ID" secondary="# 47832040" />}
                    />
                  </FormGroup>
                </NftIDCheckContainer>
                <PrimaryButton>Bridge</PrimaryButton>
              </BridgeAction>
            </ClaimBridgeSection>
          </GovernanceAction>
        </Wrapper>
      </GovernanceContainer>
    </Container>
  );
};

interface CheckBoxLabelProps {
  primary: string;
  secondary: string;
}

const CheckBoxLabel = (props: CheckBoxLabelProps) => {
  const { primary, secondary } = props;
  return (
    <LabelContainer>
      {primary}
      <span style={{ color: '#585c64' }}> {secondary}</span>
    </LabelContainer>
  );
};

const LabelContainer = styled(Box)(({ theme }) => ({
  fontSize: '14px',
  fontWeight: '400',
  lineHeight: '24px'
}));

const GovernanceContainer = styled(Box)(({ theme }) => ({
  padding: '70px 0',
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center'
}));

const Wrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  alignItems: 'center',
  maxWidth: '960px'
}));

const CardGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '12px',
  width: '100%',
  [theme.breakpoints.down(768)]: {
    flexDirection: 'column'
  }
}));

const Card = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '120px',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  background: '#18191D'
}));

const CardValue = styled(Box)(({ theme }) => ({
  fontSize: '25px',
  lineHeight: '33px',
  fontWeight: '500'
}));

const CardMedia = styled(Box)(({ theme }) => ({
  fontSize: '15px',
  lineHeight: '20px',
  fontWeight: '500',
  color: '#777E90',
  display: 'flex',
  alignItems: 'center',
  gap: '10px'
}));

const GovernanceAction = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  gap: '12px',
  [theme.breakpoints.down(768)]: {
    flexDirection: 'column-reverse'
  }
}));

const NFTSaleSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '7px',
  minWidth: '636px',
  [theme.breakpoints.down('lg')]: {
    minWidth: '343px'
  },
  [theme.breakpoints.down(768)]: {
    minWidth: '320px'
  }
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: '9px 27px',
  display: 'flex',
  gap: '17px',
  alignItems: 'center',
  fontSize: '12px',
  lineHeight: '20px',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  fontWeight: '700',
  backgroundColor: '#18191D'
}));

const SectionContent = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: '22px 27px',
  backgroundColor: '#18191D'
}));

const NFTDetails = styled(Box)(({ theme }) => ({
  paddingTop: '27px',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px'
}));

const NFTDetailItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between'
}));

const ItemTitle = styled(Box)(({ theme }) => ({
  color: '#B1B5C3',
  fontSize: '12px',
  lineHeight: '20px',
  fontWeight: '400'
}));

const ItemValue = styled(Box)(({ theme }) => ({
  fontSize: '14px',
  lineHeight: '24px',
  fontWeight: '400',
  display: 'flex',
  gap: '5px',
  alignItems: 'center'
}));

const NumberController = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  gap: '24px',
  alignItems: 'center',
  padding: '20px 0'
}));

const InputAction = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  gap: '13px'
}));

const NumberPlusButton = styled(Button)(({ theme }) => ({
  minWidth: '36px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#3772FF',
  borderRadius: '5px',
  '&:hover': {
    backgroundColor: '#3772FF'
  }
}));

const NumberMinusButton = styled(Button)(({ theme }) => ({
  minWidth: '36px',
  maxHeight: '36px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'none',
  borderRadius: '5px',
  color: '#3772FF',
  border: '2px solid #3772FF',
  '&:hover': {
    backgroundColor: 'none'
  }
}));

const PrimaryButton = styled(Button)(({ theme }) => ({
  width: '100%',
  backgroundColor: '#3772FF',
  borderRadius: '4px',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#3772FF'
  }
}));

const ClaimBridgeSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%'
}));

const FeeCard = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '172px',
  padding: '27px 12px 18px 12px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  backgroundColor: '#18191D',
  justifyContent: 'space-between'
}));

const FeeCardTitle = styled(Box)(({ theme }) => ({
  fontWeight: '500',
  fontSize: '15px',
  lineHeight: '20px',
  color: '#777E90',
  paddingLeft: '45px'
}));

const FeeCardContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '15px',
  fontSize: '25px',
  lineHeight: '33px',
  paddingLeft: '45px'
}));

const BridgeLabel = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '50px',
  padding: '15px 12px',
  fontSize: '12px',
  fontWeight: '700',
  lineHeight: '20px',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  backgroundColor: '#18191D',
  marginTop: '12px'
}));

const BridgeAction = styled(Box)(({ theme }) => ({
  padding: '0 12px 15px 12px',
  width: '100%',
  backgroundColor: '#18191D',
  marginTop: '7px'
}));

const BridgeActionLabel = styled(Box)(({ theme }) => ({
  fontSize: '12px',
  fontWeight: 400,
  lineHeight: '20px',
  color: '#B1B5C3',
  padding: '15px 0'
}));

const NftIDCheckContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#141416',
  borderRadius: '5px',
  padding: '16px',
  margin: '18px 0'
}));