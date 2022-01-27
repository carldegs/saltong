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
  Skeleton,
  Spacer,
  Spinner,
  Text,
  useColorMode,
  useToast,
} from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
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
        gameMode === GameMode.max ? (
          <Alert status="info">
            <CloseButton
              position="absolute"
              right="8px"
              top="8px"
              onClick={() => {
                setShowAlert(false);
              }}
            />
            <Text fontSize={['sm', 'md']}>
              Hello. Upon extensive research (aka Googling), Saltong Max #12 is
              an antiquated Tagalog word. Rest assured, outdated words will not
              be used again.{' '}
              <span role="img" aria-label="kissy-face">
                😽
              </span>{' '}
              Sources:{' '}
              <Link
                isExternal
                href="https://www.google.co.uk/books/edition/Ancient_Beliefs_and_Customs_of_the_Tagal/Ca5XDwAAQBAJ?hl=en&gbpv=1&dq=%22duungan%22&pg=PA276&printsec=frontcover"
                fontWeight="bold"
                color={colorMode === 'dark' ? 'blue.200' : 'blue.600'}
              >
                [1]
              </Link>
              <Link
                isExternal
                href="https://www.google.co.uk/books/edition/Elihu_Root_Collection_of_United_States_D/r4RQAAAAYAAJ?hl=en&gbpv=1&dq=%22duungan%22&pg=RA1-PA102&printsec=frontcover"
                fontWeight="bold"
                color={colorMode === 'dark' ? 'blue.200' : 'blue.600'}
              >
                [2]
              </Link>
              <Link
                isExternal
                href="https://www.google.co.uk/books/edition/Studies_on_Philippine_Foreign_Relations/nysOAQAAIAAJ?hl=en&gbpv=1&bsq=%22duungan%22&dq=%22duungan%22&printsec=frontcover"
                fontWeight="bold"
                color={colorMode === 'dark' ? 'blue.200' : 'blue.600'}
              >
                [3]
              </Link>
            </Text>
          </Alert>
        ) : (
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
        )
      ) : null}
      <Container centerContent maxW="container.xl">
        <HStack my={4} w="full">
          <Flex flex={1} flexDir="row">
            <Skeleton isLoaded={!isLoading}>
              <GameStatusPanel gameId={gameId} />
            </Skeleton>
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
            <EndGameModal
              isOpen={disc.endGameModal.isOpen}
              onClose={disc.endGameModal.onClose}
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
