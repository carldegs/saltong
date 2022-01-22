import {
  Button,
  Divider,
  HStack,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Stack,
  Text,
  useClipboard,
  useDisclosure,
} from '@chakra-ui/react';

import { TWITTER_LINK } from '../constants';
import { useHexGame } from '../context/HexGameContext';
import { getUserData } from '../utils';
import ResetDataAlert from './ResetDataAlert';

interface BugReportModalInterface extends Omit<ModalProps, 'children'> {
  resetLocalStorage: () => void;
}

const BugReportModal: React.FC<BugReportModalInterface> = ({
  onClose,
  isOpen,
  resetLocalStorage,
}) => {
  const { list, ...hexData } = useHexGame();
  const data = Buffer.from(
    JSON.stringify({
      orig: getUserData() || {},
      hex: hexData || {},
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
