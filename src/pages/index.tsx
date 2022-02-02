import {
  Alert,
  Box,
  CloseButton,
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
import { useRouter } from 'next/router';
import { ChartBar, Question } from 'phosphor-react';
import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { DICTIONARY_LINK } from '../constants';
import { useDisclosures } from '../context/DisclosuresContext';
import { GameProvider, useGame } from '../context/GameContext';
import GameStatusPanel from '../molecules/GameStatusPanel';
import Keyboard from '../molecules/Keyboard';
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
  const router = useRouter();
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
      {showAlert ? (
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
      ) : null}
      <Container centerContent maxW="container.xl">
        <HStack my={4} w="full">
          <Box>
            <Heading size="lg" textAlign="left" textTransform="capitalize">
              {`Saltong ${gameMode !== GameMode.main ? gameMode : ''}`}
            </Heading>

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
