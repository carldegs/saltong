import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Stack,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
  useClipboard,
} from '@chakra-ui/react';
import React, { useMemo } from 'react';

import { DOMAIN, HEX_RANK } from '../constants';
import { GTAG_EVENTS, sendEvent } from '../utils/gtag';

interface HexShareModalProps extends Omit<ModalProps, 'children'> {
  rank: {
    name: string;
    icon: string;
    index: number;
  };
  score: number;
  gameId: number;
  numWords: number;
}

const getShareStatus = (
  rank: { name: string; icon: string; index: number },
  score: number,
  gameId: number,
  numWords: number
) => `Saltong Hex ${gameId}

${rank.icon}${rank.name.toUpperCase()}
🏅${rank.index + 1}/${HEX_RANK.length}  🔢${score}  📖${numWords}

${DOMAIN}/hex`;

const HexShareModal: React.FC<HexShareModalProps> = ({
  isOpen,
  onClose,
  rank,
  score,
  gameId,
  numWords,
}) => {
  const shareMessage = useMemo(
    () => getShareStatus(rank, score, gameId, numWords),
    [rank, score, gameId, numWords]
  );
  const { hasCopied, onCopy } = useClipboard(shareMessage);
  const showShareButton =
    typeof window !== 'undefined' && !!window?.navigator?.share;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>
            {rank.name === HEX_RANK[HEX_RANK.length - 1].name
              ? 'Isa kang Bathala!'
              : 'Share'}
          </ModalHeader>
          <ModalBody my={8}>
            <StatGroup textAlign="center">
              <Stat>
                <StatNumber textTransform="capitalize">
                  {`${rank.name}${rank.icon}`}
                </StatNumber>
                <StatLabel>Rank</StatLabel>
              </Stat>

              <Stat>
                <StatNumber textTransform="uppercase">{score}</StatNumber>
                <StatLabel>Score</StatLabel>
              </Stat>

              <Stat>
                <StatNumber textTransform="uppercase">{numWords}</StatNumber>
                <StatLabel>Number of Words</StatLabel>
              </Stat>
            </StatGroup>

            <Stack
              spacing={2}
              alignItems="center"
              justifyContent="center"
              flexGrow={1}
              mt={6}
            >
              {showShareButton && (
                <Button
                  onClick={() => {
                    sendEvent(GTAG_EVENTS.sharedResult);
                    window?.navigator?.share({
                      title: 'Saltong Hex',
                      text: shareMessage,
                    });
                  }}
                  colorScheme="green"
                  size="lg"
                  isFullWidth
                >
                  Share
                </Button>
              )}
              <Button
                onClick={() => {
                  onCopy();
                  sendEvent(GTAG_EVENTS.sharedResult);
                }}
                variant={showShareButton ? 'ghost' : 'solid'}
                isFullWidth
                size={showShareButton ? 'sm' : 'md'}
              >
                {hasCopied ? 'COPIED' : 'Copy Result'}
              </Button>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default HexShareModal;
