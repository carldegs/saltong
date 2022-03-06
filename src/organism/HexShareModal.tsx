import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
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
  Text,
  useClipboard,
  useColorMode,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import router from 'next/router';
import React, { useMemo } from 'react';

import EmojiWrapper from '../atoms/EmojiWrapper';
import { DOMAIN, HEX_RANK } from '../constants';
import GameMode from '../types/GameMode';
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
  const { colorMode } = useColorMode();

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>
            {rank.name === HEX_RANK[HEX_RANK.length - 1].name
              ? 'Isa kang Bathala!'
              : 'Saltong Hex Results'}
          </ModalHeader>
          <ModalBody my={8}>
            <Flex alignItems="center" flexDir="column">
              <Box
                px={3}
                py={2}
                bg={colorMode === 'light' ? 'gray.100' : 'gray.600'}
                w="min-content"
                borderRadius={12}
              >
                <Text fontSize="6xl">{rank.icon}</Text>
              </Box>
              <Heading textTransform="capitalize" mt={4}>
                {rank.name}
              </Heading>
            </Flex>
            <Divider my={6} />
            <StatGroup textAlign="center">
              <Stat>
                <StatNumber textTransform="uppercase">{score}</StatNumber>
                <StatLabel>Score</StatLabel>
              </Stat>

              <Stat>
                <StatNumber textTransform="uppercase">{numWords}</StatNumber>
                <StatLabel>Guessed words</StatLabel>
              </Stat>
            </StatGroup>
            <Divider my={6} />
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
            <Divider display={{ base: 'inherit', md: 'none' }} my={3} />
            <Stack spacing={4} flexGrow={1} textAlign="center">
              <Heading fontSize="sm" mt={2}>
                Try the other game modes
              </Heading>
              <Wrap spacing={2} justify="center">
                <WrapItem>
                  <Button
                    onClick={() => {
                      router.push(`/`);
                      onClose();
                    }}
                    colorScheme="blue"
                  >
                    Saltong
                  </Button>
                </WrapItem>
                <WrapItem>
                  <Button
                    onClick={() => {
                      router.push(`/${GameMode.mini}`);
                      onClose();
                    }}
                    colorScheme="teal"
                  >
                    Mini
                  </Button>
                </WrapItem>
                <WrapItem>
                  <Button
                    onClick={() => {
                      router.push(`/${GameMode.max}`);
                      onClose();
                    }}
                    colorScheme="red"
                  >
                    Max
                  </Button>
                </WrapItem>
                <WrapItem>
                  <Button
                    onClick={() => {
                      router.push(`/${GameMode.kal}`);
                      onClose();
                    }}
                    colorScheme="pink"
                    leftIcon={<EmojiWrapper value="💖" />}
                    isFullWidth
                  >
                    Kal
                  </Button>
                </WrapItem>
              </Wrap>
            </Stack>{' '}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default HexShareModal;
