import {
  ChevronDownIcon,
  ExternalLinkIcon,
  QuestionOutlineIcon,
} from '@chakra-ui/icons';
import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Spacer,
  Stack,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
  Switch,
  Text,
  useClipboard,
} from '@chakra-ui/react';
import { formatDuration } from 'date-fns';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';

import { DICTIONARY_LINK } from '../constants';
import { OnShareOptions } from '../hooks/useWord';
import TurnStatPieChart from '../molecules/TurnStatPieChart';
import GameMode from '../types/GameMode';
import GameStatus from '../types/GameStatus';
import { getCountdownToNextDay } from '../utils';
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
  onShare: (options?: Partial<OnShareOptions>) => string;
  timeSolved?: string;
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
  turnStats,
  gameMode,
  correctAnswer,
  timeSolved,
}) => {
  const [showTimeSolved, setShowTimeSolved] = useState(true);
  const router = useRouter();
  const shareMessage = useMemo(
    () => onShare({ showTimeSolved }),
    [showTimeSolved, onShare]
  );
  const { hasCopied, onCopy } = useClipboard(shareMessage);
  const showShareButton =
    typeof window !== 'undefined' && !!window?.navigator?.share;
  const showGraph = useMemo(
    () => !!turnStats.find((stat) => !!stat),
    [turnStats]
  );
  const [timer, setTimer] = useState(undefined);
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    if (isOpen) {
      const newTimer = setInterval(() => {
        setCountdown(formatDuration(getCountdownToNextDay()));
      }, 1000);
      setTimer(newTimer);
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        clearInterval(timer);
        setTimer(undefined);
        onClose();
      }}
      size="lg"
    >
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
                <StatLabel>Wins</StatLabel>
                <StatNumber>{numWins}</StatNumber>
              </Stat>

              <Stat>
                <StatLabel>Win Rate</StatLabel>
                <StatNumber>
                  {numPlayed > 0 ? ((numWins / numPlayed) * 100).toFixed(0) : 0}
                  %
                </StatNumber>
              </Stat>

              <Stat>
                <StatLabel>Win Streak</StatLabel>
                <StatNumber>{winStreak}</StatNumber>
              </Stat>
              {gameStatus === GameStatus.win && (
                <Stat>
                  <StatLabel>
                    Time{' '}
                    <Popover>
                      <PopoverTrigger>
                        <QuestionOutlineIcon mb="3px" />
                      </PopoverTrigger>
                      <PopoverContent>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverBody>
                          From time of first guess to time solved
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
                  </StatLabel>
                  <StatNumber>{timeSolved}</StatNumber>
                </Stat>
              )}
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
              >
                {showShareButton && (
                  <ButtonGroup isAttached>
                    <Button
                      onClick={() => {
                        sendEvent(GTAG_EVENTS.sharedResult);
                        window?.navigator?.share({
                          title: 'Saltong',
                          text: shareMessage,
                        });
                      }}
                      colorScheme="green"
                      size="lg"
                      isFullWidth
                    >
                      Share
                    </Button>
                    <Popover>
                      <PopoverTrigger>
                        <IconButton
                          icon={<ChevronDownIcon />}
                          aria-label="chevron-down"
                          size="lg"
                          colorScheme="green"
                        />
                      </PopoverTrigger>
                      <PopoverContent>
                        <PopoverArrow />
                        <PopoverBody>
                          <FormControl
                            display="flex"
                            alignItems="center"
                            px={3}
                            py={3}
                            borderRadius={4}
                          >
                            <FormLabel htmlFor="email-alerts" mb="0">
                              Include time solved
                            </FormLabel>
                            <Spacer />
                            <Switch
                              id="email-alerts"
                              onChange={(e) => {
                                setShowTimeSolved(e.target.checked);
                              }}
                              isChecked={showTimeSolved}
                            />
                          </FormControl>
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
                  </ButtonGroup>
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
                  {gameMode !== GameMode.hex && (
                    <Button
                      onClick={() => {
                        router.push(`/${GameMode.hex}`);
                        onClose();
                      }}
                      colorScheme="yellow"
                    >
                      Saltong Hex
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
                  {isOpen && (
                    <Text>
                      Next word in{' '}
                      <Box as="span" fontWeight="bold">
                        {countdown}
                      </Box>
                    </Text>
                  )}
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
