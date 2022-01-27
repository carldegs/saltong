import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  CloseButton,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Textarea,
} from '@chakra-ui/react';
import { useMemo, useState } from 'react';

import { LOCAL_GAME_DATA } from '../constants';
import UserData from '../types/UserData';
import { setPersistState } from '../utils/local';

const DebugCodeModal: React.FC<Omit<ModalProps, 'children'>> = ({
  onClose,
  isOpen,
}) => {
  const [value, setValue] = useState('');
  const [decoded, setDecoded] = useState(false);

  const decodedData = useMemo(() => {
    try {
      return JSON.parse(Buffer.from(value, 'base64').toString('ascii'));
    } catch (err) {
      return {};
    }
  }, [value]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Debug Code</ModalHeader>
        <ModalCloseButton />
        <ModalBody mb={4}>
          {decoded && (
            <Alert status="success" maxW="container.sm">
              <AlertIcon />
              <Box flex="1">
                <AlertDescription>
                  Decoded complete. Check console to get JSON.
                </AlertDescription>
              </Box>
              <CloseButton
                position="absolute"
                right="8px"
                top="8px"
                onClick={() => setDecoded(false)}
              />
            </Alert>
          )}
          <Textarea
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setDecoded(false);
            }}
          />
          <HStack spacing={3}>
            <Button
              onClick={() => {
                // eslint-disable-next-line no-console
                console.log(decodedData);
                setDecoded(true);
              }}
            >
              Decode and Log
            </Button>

            <Button
              onClick={() => {
                // TODO: handle hex
                setPersistState(LOCAL_GAME_DATA, decodedData as UserData);
              }}
            >
              Import Data
            </Button>
          </HStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default DebugCodeModal;
