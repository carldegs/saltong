import {
  Button,
  Flex,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Stat,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
  useClipboard,
} from '@chakra-ui/react';
import React from 'react';

import TurnStatPieChart from '../molecules/TurnStatPieChart';
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
}) => {
  const { hasCopied, onCopy } = useClipboard(onShare());

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {gameStatus === GameStatus.lose ? 'YOU LOSE' : 'SOLVED!'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody mb={4}>
          <StatGroup>
            <Stat>
              <StatLabel>Number of Wins</StatLabel>
              <StatNumber>{numWins}</StatNumber>
              <StatHelpText>out of {numPlayed}</StatHelpText>
            </Stat>

            <Stat>
              <StatLabel>Win Rate</StatLabel>
              <StatNumber>
                {numPlayed > 0 ? ((numWins / numPlayed) * 100).toFixed(0) : 0}%
              </StatNumber>
              <StatHelpText>Last won {lastWinDate.split('T')[0]}</StatHelpText>
            </Stat>

            <Stat>
              <StatLabel>Win Streak</StatLabel>
              <StatNumber>{winStreak}</StatNumber>
              <StatHelpText>Longest: {longestWinStreak}</StatHelpText>
            </Stat>
          </StatGroup>
          <Heading textAlign="center" size="md" mt={6} mb={4}>
            Games won by turn
          </Heading>
          <Flex w="full" h="200px" alignItems="center">
            <TurnStatPieChart turnStats={turnStats} diameter={200} />
          </Flex>
          {/* TODO: Add socials */}
          <HStack
            spacing={4}
            alignItems="center"
            justifyContent="center"
            mt={8}
          >
            {typeof window !== 'undefined' && (
              <Button
                onClick={() => {
                  window?.navigator?.share({
                    title: 'Saltong',
                    text: onShare(),
                  });
                }}
                colorScheme="green"
                size="lg"
              >
                Share
              </Button>
            )}
            <Button
              onClick={() => {
                onCopy();
                sendEvent(GTAG_EVENTS.sharedResult);
              }}
            >
              {hasCopied ? 'COPIED' : 'Copy Result'}
            </Button>
          </HStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EndGameModal;
