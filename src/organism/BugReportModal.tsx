import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
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
import { useRef } from 'react';

import { TWITTER_LINK } from '../constants';
import { getUserData } from '../utils';

interface BugReportModalInterface extends Omit<ModalProps, 'children'> {
  resetLocalStorage: () => void;
}

const BugReportModal: React.FC<BugReportModalInterface> = ({
  onClose,
  isOpen,
  resetLocalStorage,
}) => {
  const data = Buffer.from(JSON.stringify(getUserData() || {})).toString(
    'base64'
  );
  const { hasCopied, onCopy } = useClipboard(data);
  const resetDialogDisc = useDisclosure();
  const cancelRef = useRef();

  return (
    <>
      <AlertDialog
        isOpen={resetDialogDisc.isOpen}
        leastDestructiveRef={cancelRef}
        onClose={resetDialogDisc.onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Reset Data
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? Resetting will remove all your progress. You
              can&apos;t undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={resetDialogDisc.onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={async () => {
                  await resetLocalStorage();
                  resetDialogDisc.onClose();
                  onClose();
                }}
                ml={3}
              >
                Reset Data
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
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
              <Link isExternal href={TWITTER_LINK}>
                <Button colorScheme="twitter">Send DM</Button>
              </Link>
              <Divider />
              <Text>Debug Tools</Text>
              <HStack spacing={3}>
                <Button onClick={onCopy}>{`${
                  hasCopied ? 'COPIED' : 'Copy Stats'
                }`}</Button>
                <Button colorScheme="red" onClick={resetDialogDisc.onOpen}>
                  Reset Data
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
