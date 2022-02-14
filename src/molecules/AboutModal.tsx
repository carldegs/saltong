import { Button } from '@chakra-ui/button';
import { useDisclosure } from '@chakra-ui/hooks';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Box,
  Divider,
  Heading,
  HStack,
  Link,
  Stack,
  Text,
} from '@chakra-ui/layout';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  ModalProps,
} from '@chakra-ui/modal';
import React from 'react';

import { DONATE_LINK, VERSION } from '../constants';
import { GTAG_EVENTS, sendEvent } from '../utils/gtag';
import PrivacyPolicyModal from './PrivacyPolicyModal';

const AboutModal: React.FC<Omit<ModalProps, 'children'>> = ({
  isOpen,
  onClose,
}) => {
  const privacyModalDisc = useDisclosure();

  return (
    <>
      <PrivacyPolicyModal
        isOpen={privacyModalDisc.isOpen}
        onClose={privacyModalDisc.onClose}
      />
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody my={8}>
            <Stack alignItems="center" spacing={4}>
              <HStack alignItems="end">
                <Heading size="lg">Saltong</Heading>
                <Text>{VERSION}</Text>
              </HStack>
              <Text textAlign="center">
                Saltong, Saltong Mini, and Saltong Max is based on the word game{' '}
                <Link isExternal href="https://www.powerlanguage.co.uk/wordle/">
                  Wordle <ExternalLinkIcon />
                </Link>
              </Text>
              <Text textAlign="center">
                Saltong Hex is based on NYT&apos;s word game,{' '}
                <Link
                  isExternal
                  href="https://www.nytimes.com/puzzles/spelling-bee"
                >
                  Spelling Bee <ExternalLinkIcon />
                </Link>
              </Text>
              <Text textAlign="center">
                Word list parsed from{' '}
                <Link isExternal href="https://tagalog.pinoydictionary.com/">
                  tagalog.pinoydictionary.com
                </Link>
                <ExternalLinkIcon />
              </Text>
              <Text textAlign="center">
                Additional entries sourced from you!
              </Text>
              <Box pb={4}>
                <Button onClick={privacyModalDisc.onOpen}>
                  Privacy Policy
                </Button>
              </Box>
              <Divider />
              <Text fontWeight="bold" pt={4} pb={2}>
                A Project by Carl de Guia
              </Text>
              <Stack spacing={6} alignItems="center">
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
                  <Link isExternal href="mailto:carl@carldegs.com">
                    <Button colorScheme="purple">Email</Button>
                  </Link>
                </HStack>
                <Link
                  isExternal
                  href={DONATE_LINK}
                  onClick={() => {
                    sendEvent(GTAG_EVENTS.openDonate);
                  }}
                >
                  <Button size="sm" variant="ghost">
                    Contribute to keep the site running!
                  </Button>
                </Link>
              </Stack>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AboutModal;
