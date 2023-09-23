import React from 'react'
import { useContractRead } from 'wagmi'
import abi from '../contract/abi.json';


export const SegurosList = () => {

    const { data: getSeguros } = useContractRead({
        address: '0x338C05A5Cf07D1A705ab61f4181491a9FB08E48a',
        abi: abi.abi,
        functionName: 'getSeguros',
      })

      console.log(getSeguros);
    return (
        <div>
            <h1>SegurosList</h1>
            {getSeguros && getSeguros.map((data) => (
                <div style={{border: '1px solid'}}>{data.propietario} -- {data.inquilino} -- deposito: {Number(data.deposito)}</div>
            ))}
        </div>
    )
}
