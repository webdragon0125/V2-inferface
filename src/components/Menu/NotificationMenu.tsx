import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/system';
import { Box } from '@mui/material';
import { useAccount } from 'wagmi';
import axios from 'axios';

interface NotificationMenuProps {
  state: null | HTMLElement;
  setState: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  data: string[];
}

export default function NotificationMenu(props: NotificationMenuProps) {
  const { state, setState, data } = props;
  const isOpen = Boolean(state);
  console.log({ data });
  const handleClose = () => {
    setState(null);
  };

  const { address } = useAccount();

  React.useEffect(() => {
    if (address !== undefined) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      axios.delete(`http://localhost:5000/notification/clear/${address}`).then((data) => {
        console.log(data);
      });
    }
  }, []);

  return (
    <React.Fragment>
      <Menu
        anchorEl={state}
        id="account-menu"
        open={isOpen}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiList-root': {
              backgroundColor: '#2F3136'
            },
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              backgroundColor: '#2F3136',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: -1
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {data?.length === 0 ? (
          <MenuItem onClick={handleClose}>There is no notification for now.</MenuItem>
        ) : (
          data.map((item) => (
            <div key={item}>
              <MenuItem onClick={handleClose}>
                <ItemContainer>
                  <Item>TradeID: {item[0]}</Item>
                  <Item>EventType: {item[1]}</Item>
                  <Item>Date: {item[2]}</Item>
                </ItemContainer>
              </MenuItem>
              <Divider />
            </div>
          ))
        )}
      </Menu>
    </React.Fragment>
  );
}

const ItemContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: '5px'
}));

const Item = styled(Box)(({ theme }) => ({
  fontSize: '14px'
}));