import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Button,
  Divider,
  Heading,
  HStack,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  ModalProps,
  Stack,
  Text,
} from '@chakra-ui/react';
import React from 'react';

import { VERSION } from '../constants';
import { GTAG_EVENTS, sendEvent } from '../utils/gtag';

const AboutModal: React.FC<Omit<ModalProps, 'children'>> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody my={8}>
          <Stack alignItems="center" spacing={2}>
            <HStack alignItems="end">
              <Heading size="lg">Saltong</Heading>
              <Text>{VERSION}</Text>
            </HStack>
            <Text>
              Based on the word game{' '}
              <Link isExternal href="https://www.powerlanguage.co.uk/wordle/">
                Wordle <ExternalLinkIcon />
              </Link>
            </Text>
            <Text textAlign="center" pb={4}>
              Word list parsed from{' '}
              <Link isExternal href="https://tagalog.pinoydictionary.com/">
                tagalog.pinoydictionary.com
              </Link>
              <ExternalLinkIcon />
            </Text>
            <Divider />
            <Text fontWeight="bold" pt={4}>
              A project by Carl de Guia
            </Text>
            <Stack spacing={2} alignItems="center">
              <HStack spacing={4}>
                <Link
                  isExternal
                  href="https://github.com/carldegs/saltong"
                  onClick={() => {
                    sendEvent(GTAG_EVENTS.openLinkedin);
                  }}
                >
                  <Button colorScheme="gray">GitHub</Button>
                </Link>
                <Link
                  isExternal
                  href="https://www.linkedin.com/in/carl-justin-de-guia-b40a1b97/"
                  onClick={() => {
                    sendEvent(GTAG_EVENTS.openLinkedin);
                  }}
                >
                  <Button colorScheme="linkedin">LinkedIn</Button>
                </Link>
              </HStack>
              <Link
                isExternal
                href="https://ko-fi.com/carldegs"
                onClick={() => {
                  sendEvent(GTAG_EVENTS.openDonate);
                }}
              >
                <Button size="sm" variant="ghost">
                  Donate
                </Button>
              </Link>
            </Stack>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AboutModal;
