import {
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Text,
  useClipboard,
} from '@chakra-ui/react';
import React from 'react';

import GameStatus from '../types/GameStatus';

interface EndGameModalProps extends Omit<ModalProps, 'children'> {
  gameStatus: GameStatus;
  onShare: () => string;
}
// TODO: Create list of emotes for header

const EndGameModal: React.FC<EndGameModalProps> = ({
  isOpen,
  onClose,
  gameStatus,
  onShare,
}) => {
  const { hasCopied, onCopy } = useClipboard(onShare());

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {gameStatus === GameStatus.lose ? 'YOU LOSE' : 'YOU WON!'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>ADD STATS HERE</Text>
          <Heading size="md">Share</Heading>
          {/* TODO: Add socials */}
          <Button onClick={onCopy}>{hasCopied ? 'COPIED' : 'COPY'}</Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EndGameModal;
