import {
  Box,
  Container,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Link,
  Skeleton,
  Spinner,
  Text,
  Tooltip,
  useColorMode,
  useToast,
} from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { ChartBar, Question } from 'phosphor-react';
import React, { ReactElement, useCallback, useEffect, useMemo } from 'react';

import { DICTIONARY_LINK } from '../constants';
import { useDisclosures } from '../context/DisclosuresContext';
import { GameProvider, useGame } from '../context/GameContext';
import GameStatusPanel from '../molecules/GameStatusPanel';
import Keyboard from '../molecules/Keyboard';
import ContentfulAlert from '../organism/ContentfulAlert';
import GameMenu from '../organism/GameMenu';
import LetterGrid from '../organism/LetterGrid';
import GameMode from '../types/GameMode';
import GameStatus from '../types/GameStatus';
import { delay } from '../utils';
import { GTAG_EVENTS, sendEvent } from '../utils/gtag';

const EndGameModal = dynamic(() => import('../organism/EndGameModal'));
const BugReportModal = dynamic(() => import('../organism/BugReportModal'));
const RulesModal = dynamic(() => import('../organism/RulesModal'));

const Home: React.FC = () => {
  const {
    wordLength,
    numTries,
    history,
    solve,
    resetLocalStorage,
    gameStatus,
    gameId,
    letterStatuses,
    correctAnswer,
    gameMode,
    firstVisit,
    setFirstVisit,
    isLoading,
    isError,
    fetchError,
  } = useGame();
  const tries = useMemo(() => history.map(({ word }) => word), [history]);
  const disc = useDisclosures();
  const toast = useToast();
  const { colorMode } = useColorMode();
  const baseColor = useMemo(() => {
    switch (gameMode) {
      case GameMode.main:
        return 'blue';
      case GameMode.max:
        return 'pink';
      case GameMode.mini:
        return 'teal';
    }
  }, [gameMode]);

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
      <ContentfulAlert gameMode={gameMode} />
      <Container centerContent maxW="container.xl">
        <HStack my={4} w="full">
          <Box>
            <Flex>
              <Heading size="lg">Saltong</Heading>
              {gameMode !== GameMode.main && (
                <Heading
                  size="lg"
                  color={`${baseColor}.${colorMode === 'dark' ? '400' : '500'}`}
                  textTransform="capitalize"
                  ml="8px"
                >
                  {gameMode}
                </Heading>
              )}
            </Flex>

            <Skeleton isLoaded={!isLoading}>
              <GameStatusPanel gameId={gameId} />
            </Skeleton>
          </Box>
          <HStack flex={1} justifyContent="flex-end" spacing={[2, 3]}>
            <Tooltip label="How to Play" openDelay={300}>
              <IconButton
                aria-label="help"
                icon={<Icon as={Question} weight="bold" fontSize="20px" />}
                onClick={disc.rulesModal.onOpen}
              />
            </Tooltip>
            <Tooltip label="View Stats/ Share Results" openDelay={300}>
              <IconButton
                isDisabled={gameStatus === GameStatus.playing}
                aria-label="help"
                icon={<Icon as={ChartBar} weight="bold" />}
                onClick={disc.endGameModal.onOpen}
              />
            </Tooltip>
            <GameMenu
              gameStatus={gameStatus}
              resetLocalStorage={resetLocalStorage}
              gameMode={gameMode}
            />
          </HStack>
        </HStack>
        {isLoading && (
          <Flex
            w="full"
            h="calc(100vh - 150px)"
            size="lg"
            alignItems="center"
            justifyContent="center"
          >
            <Spinner colorScheme="purple" />
          </Flex>
        )}
        {isError && (
          <Flex w="full" h="full" alignItems="center" justifyContent="center">
            <Text>{fetchError.message || 'Error in fetching json'}</Text>
          </Flex>
        )}
        {!(isLoading || isError) && (
          <>
            {disc.endGameModal.isOpen && (
              <EndGameModal
                isOpen={disc.endGameModal.isOpen}
                onClose={disc.endGameModal.onClose}
              />
            )}
            {/* TODO: Move to ModalWrapper once game data changed to context */}
            {disc.bugReportModal.isOpen && (
              <BugReportModal
                isOpen={disc.bugReportModal.isOpen}
                onClose={disc.bugReportModal.onClose}
                resetLocalStorage={resetLocalStorage}
              />
            )}
            {disc.rulesModal.isOpen && (
              <RulesModal
                isOpen={disc.rulesModal.isOpen}
                onClose={disc.rulesModal.onClose}
                wordLength={wordLength}
                numTries={numTries}
              />
            )}
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
                  <Heading
                    fontSize={['2xl', '3xl']}
                    textAlign="center"
                    mr="-10px"
                  >
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
              mt={[4, 8]}
              mb={[numTries <= 6 ? 0 : '200px', 0]}
            />
            <Keyboard
              letterStatuses={letterStatuses}
              mt={8}
              pos="fixed"
              bottom={['10px', '32px']}
              onEnter={onSolve}
              maxLength={wordLength}
            />
          </>
        )}
      </Container>
    </>
  );
};

(Home as any).getLayout = function getLayout(page: ReactElement) {
  return <GameProvider>{page}</GameProvider>;
};

export default Home;
