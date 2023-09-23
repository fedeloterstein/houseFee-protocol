import { HStack, Stack } from '@chakra-ui/react'
import { Heading } from '@ensdomains/thorin'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import React from 'react'

export const Navbar = () => {
  return (
    <HStack justify={'space-between'} m={4}>
       <Heading>HouseFee 🏘️</Heading>
       <ConnectButton />
    </HStack>
  )
}
