import {
  Box,
  Button,
  Flex,
  Image as ChakraImage,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Text,
  useColorMode,
} from '@chakra-ui/react';
import Image from 'next/image';
import { Download } from 'phosphor-react';

import QRCodeImg from '../../public/qr.png';
import { DONATE_LINK } from '../constants';
import { sendEvent, GTAG_EVENTS } from '../utils';

const ContributeModal: React.FC<Omit<ModalProps, 'children'>> = ({
  onClose,
  isOpen,
}) => {
  const { colorMode } = useColorMode();
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent pb={4}>
        <ModalCloseButton />
        <ModalHeader>Contribute</ModalHeader>
        <ModalBody>
          <Box
            bg={colorMode === 'light' ? 'gray.200' : 'gray.800'}
            py={4}
            px={6}
            borderRadius={8}
          >
            <Text>
              Saltong started as a fun weekend project that I did while in
              quarantine, but as of March 6 there are now more than 350,000
              people that played the game.
            </Text>

            <br />

            <Text>
              I am overwhelmed by the reach the site had these past few months,
              and the server is overwhelmed as well. 😆 If you enjoyed the game,
              help contribute to the server costs to keep the game ad-free and
              open for everyone!
            </Text>

            <br />
            <Text>- Carl</Text>
          </Box>

          <Stack direction={{ base: 'column', lg: 'row' }} mt={8} spacing={2}>
            <Link
              isExternal
              href={DONATE_LINK}
              w="full"
              onClick={() => sendEvent(`${GTAG_EVENTS.openDonate}_kofi`)}
            >
              <Button colorScheme="linkedin" bg="#29abe0" size="lg" isFullWidth>
                <ChakraImage
                  src="https://uploads-ssl.webflow.com/5c14e387dab576fe667689cf/61e111774d3a2f67c827cd25_Frame%205.png"
                  w="40px"
                  h="40px"
                  mr={1}
                />
                Ko-fi
              </Button>
            </Link>

            <Popover>
              <PopoverTrigger>
                <Button
                  colorScheme="facebook"
                  bg="#015add"
                  size="lg"
                  isFullWidth
                  onClick={() => sendEvent(`${GTAG_EVENTS.openDonate}_gcash`)}
                >
                  GCash
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverCloseButton />
                <PopoverBody alignItems="center" as={Flex} flexDir="column">
                  <Image src={QRCodeImg} />
                  <Button
                    colorScheme="green"
                    leftIcon={<Download fontWeight="bold" />}
                    as="a"
                    href="/qr.png"
                    download="saltong-qr.png"
                    mt={4}
                  >
                    Download QR Code
                  </Button>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ContributeModal;
