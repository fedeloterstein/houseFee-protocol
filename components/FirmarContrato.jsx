import React from 'react'
import { useContractWrite } from 'wagmi'
import abi from '../contract/abi.json';
import { parseEther } from 'ethers';

export const FirmarContrato = () => {
 
    const { data, isLoading, isSuccess, write } = useContractWrite({
        address: '0x338C05A5Cf07D1A705ab61f4181491a9FB08E48a',
        abi: abi.abi,
        functionName: 'firmarContrato',
      })
     
      return (
        <div>
            <h1>Firmar Contrato</h1>
          <button
            disabled={!write}
            onClick={() =>
              write({
                args: ['2'],
                value: parseEther('0.0000002'),
              })
            }
          >
            Firmar
          </button>
          {isLoading && <div>Check Wallet</div>}
          {isSuccess && <div>Transaction: {JSON.stringify(data)}</div>}
        </div>
      )
}
