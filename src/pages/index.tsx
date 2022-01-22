import { ExternalLinkIcon, QuestionOutlineIcon } from '@chakra-ui/icons';
import {
  Alert,
  Box,
  CloseButton,
  Container,
  Flex,
  Heading,
  HStack,
  IconButton,
  Link,
  Spacer,
  Text,
  useColorMode,
  useToast,
} from '@chakra-ui/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { DICTIONARY_LINK } from '../constants';
import { useDisclosures } from '../context/DisclosuresContext';
import useWord from '../hooks/useWord';
import GameStatusPanel from '../molecules/GameStatusPanel';
import Keyboard from '../molecules/Keyboard';
import BugReportModal from '../organism/BugReportModal';
import EndGameModal from '../organism/EndGameModal';
import GameMenu from '../organism/GameMenu';
import LetterGrid from '../organism/LetterGrid';
import RulesModal from '../organism/RulesModal';
import GameMode from '../types/GameMode';
import GameStatus from '../types/GameStatus';
import { delay } from '../utils';
import { GTAG_EVENTS, sendEvent } from '../utils/gtag';

const Home: React.FC = () => {
  const router = useRouter();
  const {
    wordLength,
    numTries,
    history,
    solve,
    resetLocalStorage,
    getShareStatus,
    gameStatus,
    numWins,
    numPlayed,
    winStreak,
    longestWinStreak,
    lastWinDate,
    turnStats,
    gameId,
    letterStatuses,
    correctAnswer,
    gameMode,
    firstVisit,
    setFirstVisit,
    timeSolved,
  } = useWord();
  const tries = useMemo(() => history.map(({ word }) => word), [history]);
  const disc = useDisclosures();
  const [showAlert, setShowAlert] = useState(true);
  const toast = useToast();
  const { colorMode } = useColorMode();

  const onSolve = useCallback(
    async (answer: string) => {
      try {
        const { gameStatus } = solve(answer);
        await delay(200);
        if (gameStatus !== GameStatus.playing) {
          disc.endGameModal.onOpen();
          sendEvent(
            `${GTAG_EVENTS.completedRound}${
              gameMode !== GameMode.main ? `_${gameMode}` : ''
            }`
          );
        }
      } catch (err) {
        toast({
          description: err?.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-left',
        });
      }
    },
    [disc.endGameModal, solve, toast, gameMode]
  );

  useEffect(() => {
    if (firstVisit) {
      disc.rulesModal.onOpen();
      setFirstVisit(false);
    }
  }, [firstVisit, disc.rulesModal, setFirstVisit]);

  return (
    <>
      <Head>
        <title>{`Saltong${
          gameMode !== GameMode.main ? ` ${gameMode?.toUpperCase()}` : ''
        }`}</title>
      </Head>
      {showAlert && (
        <Alert status="success">
          <Text>
            Kulang sa challenge? Try{' '}
            <Link
              onClick={() => {
                router.push(`/${GameMode.hex}`);
              }}
              fontWeight="bold"
              color={colorMode === 'dark' ? 'green.200' : 'green.600'}
            >
              Saltong Hex
            </Link>
            , with new rounds every Tuesday and Friday.
          </Text>
          <CloseButton
            position="absolute"
            right="8px"
            top="8px"
            onClick={() => {
              setShowAlert(false);
            }}
          />
        </Alert>
      )}
      <Container centerContent maxW="container.xl">
        <HStack my={4} w="full">
          <Flex flex={1} flexDir="row">
            <GameStatusPanel gameId={gameId} />
          </Flex>
          <Box>
            <Heading size="lg" textAlign="center" textTransform="capitalize">
              {`Saltong ${gameMode !== GameMode.main ? gameMode : ''}`}
            </Heading>
            <Text fontSize={['sm', 'md']} textAlign="center">
              A Filipino clone of{' '}
              <Link isExternal href="https://www.powerlanguage.co.uk/wordle/">
                Wordle <ExternalLinkIcon />
              </Link>
            </Text>
          </Box>
          <HStack flex={1} flexDir="row-reverse" spacing={4}>
            <GameMenu
              gameStatus={gameStatus}
              resetLocalStorage={resetLocalStorage}
              gameMode={gameMode}
            />
            <Spacer maxW="0" />

            <IconButton
              aria-label="help"
              icon={<QuestionOutlineIcon />}
              onClick={disc.rulesModal.onOpen}
              display={['none', 'inherit']}
            />
          </HStack>
        </HStack>
        <EndGameModal
          isOpen={disc.endGameModal.isOpen}
          onClose={disc.endGameModal.onClose}
          gameStatus={gameStatus}
          numWins={numWins}
          numPlayed={numPlayed}
          winStreak={winStreak}
          longestWinStreak={longestWinStreak}
          lastWinDate={lastWinDate}
          turnStats={turnStats}
          onShare={getShareStatus}
          gameMode={gameMode}
          correctAnswer={correctAnswer}
          timeSolved={timeSolved}
        />
        {/* TODO: Move to ModalWrapper once game data changed to context */}
        <BugReportModal
          isOpen={disc.bugReportModal.isOpen}
          onClose={disc.bugReportModal.onClose}
          resetLocalStorage={resetLocalStorage}
        />
        <RulesModal
          isOpen={disc.rulesModal.isOpen}
          onClose={disc.rulesModal.onClose}
          wordLength={wordLength}
          numTries={numTries}
        />
        {!!(gameStatus !== GameStatus.playing && correctAnswer) && (
          <Link
            isExternal
            href={`${DICTIONARY_LINK}/word/${correctAnswer}`}
            onClick={() => {
              sendEvent(GTAG_EVENTS.openDictionary);
            }}
          >
            <HStack
              bg={gameStatus === GameStatus.win ? 'green.500' : 'blue.500'}
              px={[3, 4]}
              py={[1, 2]}
              borderRadius={4}
              letterSpacing="10px"
            >
              <Heading fontSize={['2xl', '3xl']} textAlign="center" mr="-10px">
                {correctAnswer.toUpperCase()}
              </Heading>
              {/* <ExternalLinkIcon /> */}
            </HStack>
          </Link>
        )}
        <LetterGrid
          numTries={numTries}
          wordLength={wordLength}
          tries={tries}
          onSolve={onSolve}
          gameStatus={gameStatus}
          mt={['4', '8']}
        />
        <Keyboard
          letterStatuses={letterStatuses}
          mt={8}
          pos="fixed"
          bottom={['10px', '32px']}
          onEnter={onSolve}
          maxLength={wordLength}
        />
      </Container>
    </>
  );
};

export default Home;
