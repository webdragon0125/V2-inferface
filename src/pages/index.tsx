import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PRIVATE_ROUTES } from 'src/config/routes';
import { TabPanel } from '../../src/components/TabPanel';
import { useStore } from '../../src/context/StoreContext';
import { Governance } from './Governance';
import { Referral } from './Referral';
import { Trade } from './Trade';
import { Vault } from './Vault';
import Cookies from 'universal-cookie';

export const Home = () => {
  const { page } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const cookies = new Cookies();
  useEffect(() => {
    const currentUrl = location.search;
    const params = new URLSearchParams(currentUrl);
    const _refCode = params.get('ref');
    const refCode = _refCode?.split('?')[0];
    if (refCode != null && refCode !== undefined) {
      fetch(`${PRIVATE_ROUTES.serverUrl}/ref/${refCode}`).then((response) => {
        response.json().then((data) => {
          const sender = data.toString();
          cookies.set('sender', sender);
          navigate('/');
        });
      });
    }
  }, []);
  return (
    <>
      <TabPanel value={page} index={0}>
        <Trade />
      </TabPanel>
      <TabPanel value={page} index={1}>
        <Vault />
      </TabPanel>
      <TabPanel value={page} index={2}>
        <Governance />
      </TabPanel>
      <TabPanel value={page} index={3}>
        <Referral />
      </TabPanel>
    </>
  );
};
