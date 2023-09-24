import React from 'react'
import { useContractWrite } from 'wagmi'
import abi from '../contract/abi.json';
import { parseEther } from 'ethers';
import { Button, Tag } from '@ensdomains/thorin';

export const FirmarContrato = ({ singAddress, index }) => {

    const { data, isLoading, isSuccess, write } = useContractWrite({
        address: '0x338C05A5Cf07D1A705ab61f4181491a9FB08E48a',
        abi: abi.abi,
        functionName: 'firmarContrato',
    })
    const sing = singAddress != '0x0000000000000000000000000000000000000000'
    console.log('Transaction:', JSON.stringify(data));
    return (
        <>

            <Button
                disabled={!write || sing}
                colorStyle="purpleSecondary"
                onClick={() =>
                    write({
                        args: [`${index}`],
                        value: parseEther('0.0000002'),
                    })
                }
            >
                {sing ? 'signed' : 'Pending signature'}
            </Button>
            {isLoading && <Tag>Check Wallet</Tag>}
        </>
    )
}
