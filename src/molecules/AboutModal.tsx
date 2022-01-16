import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
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
          <Stack alignItems="center" spacing={3}>
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
            <Link isExternal href="https://github.com/carldegs/saltong">
              Github Repo <ExternalLinkIcon />
            </Link>
            <Text textAlign="center">
              Word list parsed from{' '}
              <Link isExternal href="https://tagalog.pinoydictionary.com/">
                tagalog.pinoydictionary.com
              </Link>
              <ExternalLinkIcon />
            </Text>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AboutModal;
