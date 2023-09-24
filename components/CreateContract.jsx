import React from 'react'
import { useContractWrite } from 'wagmi'
import abi from '../contract/abi.json';
import { parseEther } from 'ethers';
import { Stack } from '@chakra-ui/react';
import { Button, Input, Typography } from '@ensdomains/thorin';


export const CreateContract = () => {
    const { data, isLoading, isSuccess, write } = useContractWrite({
        address: '0x338C05A5Cf07D1A705ab61f4181491a9FB08E48a',
        abi: abi.abi,
        functionName: 'crearSeguro',
        args: [parseEther('0.0000001')]
    })

    return (
        <Stack border={'1px solid'} borderColor={'blackAlpha.300'} padding={5} margin={5} borderRadius={'2xl'}>
            <Input
                description="Here you must enter the monthly rent amount for the contract"
                label="Rent amount"
                placeholder="100"
            />
            <Button colorStyle="indigoSecondary" onClick={() => write()}>Create contract warannty</Button>
            {isLoading && <div>Check Wallet</div>}
            {isSuccess && <div>Transaction: {JSON.stringify(data)}</div>}
        </Stack>
    )

}

