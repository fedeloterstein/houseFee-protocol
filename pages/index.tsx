import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useContractRead } from 'wagmi';
import abi from '../contract/abi.json';
import { CreateContract } from '../components/CreateContract'
import { SegurosList } from '../components/SegurosList';
import { FirmarContrato } from '../components/FirmarContrato';
import { Navbar } from '../components/Navbar';

const Home: NextPage = () => {


  const { data: contadorSeguros, isError, isLoading } = useContractRead({
    address: '0x338C05A5Cf07D1A705ab61f4181491a9FB08E48a',
    abi: abi.abi,
    functionName: 'contadorSeguros',
  })

  const { data: seguros } = useContractRead({
    address: '0x338C05A5Cf07D1A705ab61f4181491a9FB08E48a',
    abi: abi.abi,
    functionName: 'seguros',
    args: ['0'],
  })



  const numberValue = Number(contadorSeguros);
  console.log('contadorSeguros', numberValue);


  return (
    <>
      <Navbar />

      <CreateContract />
      <SegurosList />
      <FirmarContrato />
    </>
  );
};

export default Home;
