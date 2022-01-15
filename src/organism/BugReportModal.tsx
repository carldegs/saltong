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
import { getUserData } from '../utils';

type BugReportModalInterface = Omit<ModalProps, 'children'>;

const BugReportModal: React.FC<BugReportModalInterface> = ({
  onClose,
  isOpen,
}) => {
  const data = Buffer.from(JSON.stringify(getUserData() || {})).toString(
    'base64'
  );
  const { hasCopied, onCopy } = useClipboard(data);
  const resetDialogDisc = useDisclosure();

  return (
    <>
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
