import { HStack } from '@chakra-ui/react'
import { Typography } from '@ensdomains/thorin'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import React from 'react'

export const Navbar = () => {
  return (
    <HStack justify={'space-between'} m={4}>
       <Typography fontVariant="extraLargeBold">HouseFee 🏘️</Typography>
       <ConnectButton />
    </HStack>
  )
}
