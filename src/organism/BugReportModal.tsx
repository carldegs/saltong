import { Button } from '@chakra-ui/button';
import { useClipboard, useDisclosure } from '@chakra-ui/hooks';
import { Divider, HStack, Stack, Link, Text } from '@chakra-ui/layout';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps,
} from '@chakra-ui/modal';

import {
  LOCAL_GAME_DATA,
  LOCAL_HEX_DATA,
  MISSING_WORD_FORM,
  TWITTER_LINK,
} from '../constants';
import { getPersistState } from '../utils/local';
import ResetDataAlert from './ResetDataAlert';

interface BugReportModalInterface extends Omit<ModalProps, 'children'> {
  resetLocalStorage: () => void;
}

const BugReportModal: React.FC<BugReportModalInterface> = ({
  onClose,
  isOpen,
  resetLocalStorage,
}) => {
  const data = Buffer.from(
    JSON.stringify({
      orig: getPersistState(LOCAL_GAME_DATA) || {},
      hex: getPersistState(LOCAL_HEX_DATA) || {},
    })
  ).toString('base64');
  const { hasCopied, onCopy } = useClipboard(data);
  const resetDialogDisc = useDisclosure();

  return (
    <>
      <ResetDataAlert
        isOpen={resetDialogDisc.isOpen}
        onClose={resetDialogDisc.onClose}
        resetLocalStorage={resetLocalStorage}
      />
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Report Bug</ModalHeader>
          <ModalCloseButton />
          <ModalBody mb={4}>
            <Stack spacing={3} alignItems="center">
              <Text>
                Report bugs you&apos;ve encountered on Twitter (Email form will
                be added soon. Maybe. Probably.)
              </Text>

              <Button onClick={onCopy} isFullWidth>{`${
                hasCopied ? 'COPIED' : 'Copy Stats'
              }`}</Button>
              <Link isExternal href={TWITTER_LINK} w="full">
                <Button colorScheme="twitter" isFullWidth>
                  Send DM
                </Button>
              </Link>
              <Divider pt={4} />
              <Text pt={4}>
                Are there missing words from the dictionary? Report it at the
                Saltong Dictionary Reklamo Corner.
              </Text>
              <Link isExternal href={MISSING_WORD_FORM} w="full">
                <Button colorScheme="orange" isFullWidth>
                  Report Missing Word
                </Button>
              </Link>
              <Divider pt={4} />
              <Text textAlign="center" pt={4}>
                If all else fails, you could reset your game.
              </Text>
              <HStack spacing={3}>
                <Button colorScheme="red" onClick={resetDialogDisc.onOpen}>
                  Reset Game Data
                </Button>
              </HStack>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default BugReportModal;
