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

import { TWITTER_LINK } from '../constants';
import { getPersistState as getGamePersistState } from '../context/GameContext';
import { getPersistState as getHexGamePersistState } from '../context/HexGameContext';
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
      orig: getGamePersistState() || {},
      hex: getHexGamePersistState() || {},
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
