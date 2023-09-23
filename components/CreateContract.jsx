import React from 'react'
import { useContractWrite } from 'wagmi'
import abi from '../contract/abi.json';
import { parseEther } from 'ethers';


export const CreateContract = () => {
    const { data, isLoading, isSuccess, write } = useContractWrite({
        address: '0x338C05A5Cf07D1A705ab61f4181491a9FB08E48a',
        abi: abi.abi,
        functionName: 'crearSeguro',
        args: [parseEther('0.0000001')]
      })
     
      return (
        <div>
            <h1>Create Seguro</h1>
          <button onClick={() => write()}>Crear Seguro</button>
          {isLoading && <div>Check Wallet</div>}
          {isSuccess && <div>Transaction: {JSON.stringify(data)}</div>}
        </div>
      )

}
