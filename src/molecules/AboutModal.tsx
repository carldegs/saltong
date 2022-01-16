import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Button,
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
          <Stack alignItems="center" spacing={6}>
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
            <Text textAlign="center">
              Word list parsed from{' '}
              <Link isExternal href="https://tagalog.pinoydictionary.com/">
                tagalog.pinoydictionary.com
              </Link>
              <ExternalLinkIcon />
            </Text>
            <Text>A project by Carl de Guia</Text>
            <HStack spacing={4}>
              <Link isExternal href="https://github.com/carldegs/saltong">
                <Button colorScheme="gray">GitHub</Button>
              </Link>
              <Link
                isExternal
                href="https://www.linkedin.com/in/carl-justin-de-guia-b40a1b97/"
              >
                <Button colorScheme="linkedin">LinkedIn</Button>
              </Link>
            </HStack>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AboutModal;
