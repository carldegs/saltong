import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Button,
  Divider,
  Flex,
  Heading,
  Link,
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
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  useClipboard,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';

import { DICTIONARY_LINK } from '../constants';
import TurnStatPieChart from '../molecules/TurnStatPieChart';
import GameMode from '../types/GameMode';
import GameStatus from '../types/GameStatus';
import { GTAG_EVENTS, sendEvent } from '../utils/gtag';

interface EndGameModalProps extends Omit<ModalProps, 'children'> {
  gameStatus: GameStatus;
  numWins: number;
  numPlayed: number;
  winStreak: number;
  longestWinStreak: number;
  lastWinDate: string;
  turnStats: number[];
  gameMode: GameMode;
  correctAnswer?: string;
  onShare: () => string;
}
// TODO: Create list of emotes for header

const EndGameModal: React.FC<EndGameModalProps> = ({
  isOpen,
  onClose,
  gameStatus,
  onShare,
  numPlayed,
  numWins,
  winStreak,
  longestWinStreak,
  lastWinDate,
  turnStats,
  gameMode,
  correctAnswer,
}) => {
  const router = useRouter();
  const { hasCopied, onCopy } = useClipboard(onShare());
  const showShareButton = typeof window !== 'undefined';
  const showGraph = useMemo(
    () => !!turnStats.find((stat) => !!stat),
    [turnStats]
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {gameStatus === GameStatus.lose ? 'YOU LOSE' : 'SOLVED!'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody mb={4}>
          <Stack spacing={4}>
            <StatGroup>
              <Stat>
                <StatLabel>Number of Wins</StatLabel>
                <StatNumber>{numWins}</StatNumber>
                <StatHelpText>out of {numPlayed}</StatHelpText>
              </Stat>

              <Stat flexGrow={1}>
                <StatLabel>Win Rate</StatLabel>
                <StatNumber>
                  {numPlayed > 0 ? ((numWins / numPlayed) * 100).toFixed(0) : 0}
                  %
                </StatNumber>
                <StatHelpText>
                  Last won{' '}
                  <Text whiteSpace="nowrap">{lastWinDate.split('T')[0]}</Text>
                </StatHelpText>
              </Stat>

              <Stat>
                <StatLabel>Win Streak</StatLabel>
                <StatNumber>{winStreak}</StatNumber>
                <StatHelpText>Longest: {longestWinStreak}</StatHelpText>
              </Stat>
            </StatGroup>
            {showGraph && (
              <>
                <Heading textAlign="center" size="md" mt={6} mb={4}>
                  Games won by turn
                </Heading>
                <Flex w="full" h="200px" alignItems="center" mb={4}>
                  <TurnStatPieChart turnStats={turnStats} diameter={200} />
                </Flex>
              </>
            )}
            <Divider />
            {/* TODO: Add socials */}
            <Flex alignItems="center" justifyContent="space-between">
              <Stack
                spacing={2}
                alignItems="center"
                justifyContent="center"
                flexGrow={1}
                px={2}
              >
                {showShareButton && (
                  <Button
                    onClick={() => {
                      sendEvent(GTAG_EVENTS.sharedResult);
                      window?.navigator?.share({
                        title: 'Saltong',
                        text: onShare(),
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
                >
                  {hasCopied ? 'COPIED' : 'Copy Result'}
                </Button>
              </Stack>
              <Divider orientation="vertical" h="120px" mx={6} />
              <Stack spacing={4} flexGrow={1} textAlign="center">
                <Heading fontSize="sm" mt={2}>
                  Try the other game modes
                </Heading>
                <Stack spacing={2}>
                  {gameMode !== GameMode.mini && (
                    <Button
                      onClick={() => {
                        router.push(`/${GameMode.mini}`);
                        onClose();
                      }}
                      colorScheme="green"
                    >
                      Saltong Mini
                    </Button>
                  )}
                  {gameMode !== GameMode.main && (
                    <Button
                      onClick={() => {
                        router.push(`/`);
                        onClose();
                      }}
                      colorScheme="orange"
                    >
                      Saltong
                    </Button>
                  )}
                  {gameMode !== GameMode.max && (
                    <Button
                      onClick={() => {
                        router.push(`/${GameMode.max}`);
                        onClose();
                      }}
                      colorScheme="red"
                    >
                      Saltong Max
                    </Button>
                  )}
                </Stack>
              </Stack>
            </Flex>
            {!!(correctAnswer && gameStatus !== GameStatus.playing) && (
              <>
                <Divider />
                <Stack spacing={3} alignItems="center">
                  <Heading
                    fontSize={['3xl', '4xl']}
                    textAlign="center"
                    mr="-10px"
                    letterSpacing="10px"
                  >
                    {correctAnswer.toUpperCase()}
                  </Heading>
                  <Link
                    isExternal
                    href={`${DICTIONARY_LINK}/word/${correctAnswer}`}
                  >
                    <Button
                      colorScheme="blue"
                      size="sm"
                      onClick={() => {
                        sendEvent(GTAG_EVENTS.openDictionary);
                      }}
                    >
                      View Definition <ExternalLinkIcon ml={2} />
                    </Button>
                  </Link>
                </Stack>
              </>
            )}
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EndGameModal;
