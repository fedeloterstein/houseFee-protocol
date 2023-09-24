import React from 'react'
import { useContractWrite } from 'wagmi'
import abi from '../contract/abi.json';
import { parseEther } from 'ethers';
import { Button, Tag } from '@ensdomains/thorin';

export const FirmarContrato = ({ singAddress, index, contractAddress }) => {

    const { data, isLoading, isSuccess, write } = useContractWrite({
        address: contractAddress,
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
