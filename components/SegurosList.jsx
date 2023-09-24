import React from 'react'
import { useContractRead } from 'wagmi'
import abi from '../contract/abi.json';
import { HStack, SimpleGrid, Stack } from '@chakra-ui/react';
import { Button, Tag, Typography } from '@ensdomains/thorin';

import {FirmarContrato} from './FirmarContrato'
export const SegurosList = ({contractAddress}) => {

    const { data: getSeguros } = useContractRead({
        address: contractAddress,
        abi: abi.abi,
        functionName: 'getSeguros',
    })

    console.log(getSeguros);
    return (
        <SimpleGrid columns={[1, 1, 1, 2]} spacing={10}>
            {getSeguros && getSeguros.map((data, index) => (
                <Stack key={index} margin={5} padding={5} border={'1px solid'} borderColor={'blackAlpha.300'}  borderRadius={'2xl'}>
                    <Typography>🙋‍♂️ Owner {data.propietario}</Typography>
                    <Typography>💁‍♂️Tenant {data.inquilino}</Typography>
            
                    <HStack>
                    <Typography>📆 Payment Date month 1: {data.fechaLimitePago1}</Typography>
                    <Tag>Status {data.estadoPago1}</Tag>
                    </HStack>
                    <HStack>
                    <Typography>📆 Payment Date month  2: {data.fechaLimitePago2}</Typography>
                    <Tag>Status {data.estadoPago2}</Tag>
                    </HStack>
                    <HStack>
                    <Typography>📆 Payment Date month  3: {data.fechaLimitePago2}</Typography>
                    <Tag>Status {data.estadoPago3}</Tag>
                    </HStack>
                    <Typography> 💵 Monthly amount {Number(data.montoAlquilerMensual)}</Typography>
                    <Typography>💰 Security Deposit {Number(data.deposito)}</Typography>
                    <HStack>
                        <FirmarContrato index={index} singAddress={data.inquilino} contractAddress={contractAddress}/>
                        <Button colorStyle="pinkSecondary">Pay fee</Button>
                    </HStack>
                </Stack>
            ))}

        </SimpleGrid>
    )
}
