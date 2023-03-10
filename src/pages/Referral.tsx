import { Box, Button, Divider } from '@mui/material';
import { styled } from '@mui/system';
import { useEffect, useState } from 'react';
import { VaultInput } from 'src/components/Input';
import { BiLinkAlt } from 'react-icons/bi';
import { useAccount, useSigner } from 'wagmi';
import { toast } from 'react-toastify';
import axios from 'axios';
import { PRIVATE_ROUTES } from 'src/config/routes';
import CopyToClipboard from 'src/components/CopyToClipboard';

export const Referral = () => {
  const [editState, setEditState] = useState({
    refCode: ''
  });

  const [codeData, setCodeData] = useState([]);

  const { data: signer } = useSigner();

  const { isConnected, address } = useAccount();
  const getCreatedLink = async () => {
    if (address !== undefined) {
      await axios
        .get(`${PRIVATE_ROUTES.referral_serverUrl}/user/${address}`)
        .then((response) => {
          setCodeData(response.data);
        })
        .catch((err) => {
          const error = err.response.data;
          console.log({ error });
        });
    }
  };

  useEffect(() => {
    if (isConnected) {
      getCreatedLink();
    } else {
      setCodeData([]);
    }
  }, [isConnected]);

  const handleEditState = (prop: string, value: string | number | boolean) => {
    setEditState({ ...editState, [prop]: value });
  };

  const handleCreateLink = async () => {
    if (isConnected) {
      if (editState.refCode === '') {
        toast.error('Referral code is empty');
      } else {
        const signedMessage = await signer?.signMessage(editState.refCode);
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        await axios
          .post(`${PRIVATE_ROUTES.referral_serverUrl}/create-link`, {
            signMessage: signedMessage,
            refCode: editState.refCode
          })
          .then((res) => {
            toast.success(res.data.message);
            getCreatedLink();
          })
          .catch((err) => {
            const error = err.response.data;
            toast.error(error);
          });
      }
    } else {
      toast.error('Wallet not connected!');
    }
  };
  return (
    <ReferralContainer>
      <ReferralLinkContainer>
        <ReferralLinkLabel>Create a New Link</ReferralLinkLabel>
        <CreateLinkContainer>
          <VaultInput
            type="text"
            placeholder="Referral Code"
            value={editState.refCode}
            setValue={handleEditState}
            name="refCode"
            component=""
          />
          <CodeLink>
            {PRIVATE_ROUTES.clientUrl}/?ref={editState.refCode}
          </CodeLink>
          <CreateLinkButton
            onClick={() => {
              (async () => {
                await handleCreateLink();
              })();
            }}
          >
            Create Link
          </CreateLinkButton>
        </CreateLinkContainer>
        <ReferralLinkLabel sx={{ marginTop: '6px' }}>Your links</ReferralLinkLabel>
        <ReferralLinks>
          {codeData.length === 0 ? (
            <LinkText>You have no referral code</LinkText>
          ) : (
            codeData.map((item) => (
              <CopyToClipboard key={item}>
                {({ copy }) => (
                  <ReferralLink
                    onClick={() =>
                      copy(
                        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                        `${PRIVATE_ROUTES.clientUrl}/?ref=${item}`
                      )
                    }
                  >
                    <LinkText>
                      <BiLinkIcon />
                      {PRIVATE_ROUTES.clientUrl}/?ref={item}
                    </LinkText>
                    <Divider />
                  </ReferralLink>
                )}
              </CopyToClipboard>
            ))
          )}
        </ReferralLinks>
        <ReferralLinkLabel sx={{ marginTop: '6px' }}>Referred Addresses</ReferralLinkLabel>
        <ReferredAddresses>No adresses yet.</ReferredAddresses>
      </ReferralLinkContainer>
      <ReferralCardContainer>
        <ReferralCard value="$2.357398" name="Fees Earned" />
        <ReferralCard value="$5.48309" name="Referred All Time Volume" />
        <ReferralCard value="0" name="Referred Wallets" />
      </ReferralCardContainer>
    </ReferralContainer>
  );
};

interface ReferralCardProps {
  value: string;
  name: string;
}

const ReferralCard = (props: ReferralCardProps) => {
  const { value, name } = props;
  return (
    <ReferralCardWrapper>
      <ReferralCardValue>{value}</ReferralCardValue>
      <ReferralCardName>{name}</ReferralCardName>
    </ReferralCardWrapper>
  );
};

const ReferralCardWrapper = styled(Box)(({ theme }) => ({
  padding: '27px 0 27px 49px',
  width: '268px',
  backgroundColor: '#18191D',
  [theme.breakpoints.down('lg')]: {
    width: '100%',
    padding: '27px 0 27px 30px'
  }
}));

const ReferralCardValue = styled(Box)(({ theme }) => ({
  fontSize: '25px',
  lineHeight: '33px',
  fontWeight: '500',
  [theme.breakpoints.down('lg')]: {
    fontSize: '20px',
    lineHeight: '26px'
  }
}));

const ReferralCardName = styled(Box)(({ theme }) => ({
  fontSize: '15px',
  lineHeight: '20px',
  fontWeight: '500',
  color: '#777E90',
  marginTop: '10px',
  [theme.breakpoints.down('lg')]: {
    fontSize: '13px',
    lineHeight: '17px'
  }
}));

const ReferralContainer = styled(Box)(({ theme }) => ({
  padding: '70px',
  display: 'flex',
  justifyContent: 'center',
  gap: '13px',
  [theme.breakpoints.down('lg')]: {
    display: 'flex',
    flexDirection: 'column-reverse'
  },
  [theme.breakpoints.down(768)]: {
    padding: '70px 17px'
  }
}));

const ReferralLinkContainer = styled(Box)(({ theme }) => ({
  width: '590px',
  display: 'flex',
  flexDirection: 'column',
  gap: '7px',
  [theme.breakpoints.down('lg')]: {
    width: '100%'
  }
}));

const ReferralLinkLabel = styled(Box)(({ theme }) => ({
  padding: '15px 27px',
  width: '100%',
  height: '50px',
  backgroundColor: '#18191D',
  fontSize: '12px',
  lineHeight: '20px',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  fontWeight: '700'
}));

const CreateLinkContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: '20px 27px',
  backgroundColor: '#18191D',
  fontSize: '12px',
  lineHeight: '20px',
  fontWeight: '400'
}));

const CodeLink = styled(Box)(({ theme }) => ({
  padding: '12px',
  color: '#777E90'
}));

const CreateLinkButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#3772FF',
  width: '100%',
  height: '40px',
  textTransform: 'none',
  borderRadius: '4px',
  fontSize: '14px',
  lineHeight: '24px',
  fontWeight: '600',
  marginTop: '15px',
  '&: hover': {
    backgroundColor: '#3772FF'
  }
}));

const ReferralLinks = styled(Box)(({ theme }) => ({
  padding: '16px',
  backgroundColor: '#18191D',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: '13px'
}));

const LinkText = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '7px',
  fontSize: '12px',
  lineHeight: '20px',
  fontWeight: '400',
  color: '#777E90'
}));

const ReferredAddresses = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '90px',
  fontSize: '12px',
  lineHeight: '20px',
  fontWeight: '400',
  color: '#777E90',
  backgroundColor: '#18191D'
}));

const ReferralCardContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '13px',
  [theme.breakpoints.down('lg')]: {
    flexDirection: 'row',
    width: '100%'
  },
  [theme.breakpoints.down(768)]: {
    display: 'grid',
    '&>*:nth-child(3)': {
      gridColumn: '1 / 3'
    }
  },
  [theme.breakpoints.down(390)]: {
    display: 'flex',
    flexDirection: 'column'
  }
}));

const BiLinkIcon = styled(BiLinkAlt)(({ theme }) => ({
  width: '20px',
  height: '20px',
  minWidth: '20px',
  minHeight: '20px',
  color: '#3772FF'
}));

const ReferralLink = styled(Box)(({ theme }) => ({
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px'
}));
