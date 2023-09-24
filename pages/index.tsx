import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import { CreateContract } from '../components/CreateContract'
import { SegurosList } from '../components/SegurosList';
import { Navbar } from '../components/Navbar';
import { Container, Divider } from '@chakra-ui/react';
import { useNetwork } from 'wagmi';
import {address} from '../contract/addresses'
const Home: NextPage = () => {
  const { chain } = useNetwork();
  console.log(chain?.name);
  //@ts-ignore
  const contractAddress = address[chain?.name];
  console.log(chain?.name, contractAddress);
  
  return (
    <>
      <Navbar />
      <Container maxW='container.xl' pt={10} >
        <CreateContract contractAddress={contractAddress} />
        <Divider />
        <SegurosList contractAddress={contractAddress} />
      </Container>
    </>
  );
};

export default Home;
