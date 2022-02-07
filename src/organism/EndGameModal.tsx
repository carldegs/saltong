import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
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
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { formatDuration } from 'date-fns';
import { useRouter } from 'next/router';
import {
  ShareNetwork,
  DotsThreeVertical,
  ArrowSquareOut,
  Question,
} from 'phosphor-react';
import React, { useEffect, useMemo, useState } from 'react';

import { DICTIONARY_LINK } from '../constants';
import { useGame } from '../context/GameContext';
import TurnStatPieChart from '../molecules/TurnStatPieChart';
import GameMode from '../types/GameMode';
import GameStatus from '../types/GameStatus';
import { getCountdownToNextDay } from '../utils';
import { GTAG_EVENTS, sendEvent } from '../utils/gtag';

type EndGameModalProps = Omit<ModalProps, 'children'>;
// TODO: Create list of emotes for header

const EndGameModal: React.FC<EndGameModalProps> = ({ isOpen, onClose }) => {
  const {
    gameStatus,
    getShareStatus,
    numPlayed,
    numWins,
    winStreak,
    turnStats,
    gameMode,
    correctAnswer,
    timeSolved,
  } = useGame();
  const [showTimeSolved, setShowTimeSolved] = useState(true);
  const [showLink, setShowLink] = useState(true);
  const router = useRouter();
  const shareMessage = useMemo(
    () => getShareStatus({ showTimeSolved, showLink }),
    [showTimeSolved, getShareStatus, showLink]
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
                        <Icon as={Question} weight="bold" />
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
                      <Icon as={ShareNetwork} weight="bold" mr={2} />
                      Share
                    </Button>
                    <Popover>
                      <PopoverTrigger>
                        <IconButton
                          icon={
                            <Icon
                              as={DotsThreeVertical}
                              weight="bold"
                              fontSize="20px"
                            />
                          }
                          aria-label="chevron-down"
                          size="lg"
                          colorScheme="green"
                          ml="1px"
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
                          <FormControl
                            display="flex"
                            alignItems="center"
                            px={3}
                            py={3}
                            borderRadius={4}
                          >
                            <FormLabel htmlFor="email-alerts" mb="0">
                              Include link
                            </FormLabel>
                            <Spacer />
                            <Switch
                              id="include-link"
                              onChange={(e) => {
                                setShowLink(e.target.checked);
                              }}
                              isChecked={showLink}
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
                <Wrap spacing={2} justify="center">
                  {gameMode !== GameMode.main && (
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
                  )}
                  {gameMode !== GameMode.mini && (
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
                  )}
                  {gameMode !== GameMode.max && (
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
                  )}
                  {gameMode !== GameMode.hex && (
                    <WrapItem>
                      <Button
                        onClick={() => {
                          router.push(`/${GameMode.hex}`);
                          onClose();
                        }}
                        colorScheme="purple"
                      >
                        Hex
                      </Button>
                    </WrapItem>
                  )}
                </Wrap>
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
                      View Definition{' '}
                      <Icon as={ArrowSquareOut} weight="bold" ml={2} />
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
