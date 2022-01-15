import { ExternalLinkIcon, HamburgerIcon } from '@chakra-ui/icons';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  CloseButton,
  Container,
  Flex,
  Heading,
  HStack,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
  Text,
  useColorMode,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useMemo } from 'react';

import EmojiWrapper from '../atoms/EmojiWrapper';
import { DICTIONARY_LINK } from '../constants';
import { useKeyboard } from '../context/KeyboardContext';
import useWord from '../hooks/useWord';
import AboutModal from '../molecules/AboutModal';
import GameStatusPanel from '../molecules/GameStatusPanel';
import Keyboard from '../molecules/Keyboard';
import BugReportModal from '../organism/BugReportModal';
import EndGameModal from '../organism/EndGameModal';
import LetterGrid from '../organism/LetterGrid';
import GameMode from '../types/GameMode';
import GameStatus from '../types/GameStatus';
import { getUserData } from '../utils';

const Home: React.FC = () => {
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
  } = useWord(GameMode.main);
  const tries = useMemo(() => history.map(({ word }) => word), [history]);
  const endGameModalDisc = useDisclosure();
  const bugModalDisc = useDisclosure();
  const aboutModalDisc = useDisclosure();
  const { onOpen: onAlertOpen, ...alertDisc } = useDisclosure();
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();
  const keyboardRef = useKeyboard();

  const onSolve = useCallback(
    async (answer: string) => {
      try {
        const { gameStatus } = await solve(answer);
        if (gameStatus !== GameStatus.playing) {
          endGameModalDisc.onOpen();
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
    [endGameModalDisc, solve, toast]
  );

  useEffect(() => {
    onAlertOpen();
  }, [onAlertOpen]);

  return (
    <Container centerContent maxW="container.xl">
      <HStack my={4} textAlign="center" w="full">
        <Flex flex={1} flexDir="row">
          <GameStatusPanel gameId={gameId} />
        </Flex>
        <Box>
          <Heading size="lg">Saltong</Heading>
          <Text>
            A Filipino clone of{' '}
            <Link isExternal href="https://www.powerlanguage.co.uk/wordle/">
              Wordle <ExternalLinkIcon />
            </Link>
            .
          </Text>
        </Box>
        <HStack flex={1} flexDir="row-reverse">
          <Menu
            onClose={() => {
              keyboardRef.current?.focus();
            }}
          >
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<HamburgerIcon />}
              variant="outline"
            />
            <MenuList>
              <MenuItem
                onClick={toggleColorMode}
                icon={
                  <EmojiWrapper value={colorMode === 'light' ? '🌑' : '☀️'} />
                }
              >
                {`Toggle ${colorMode === 'light' ? 'Dark' : 'Light'} Mode`}
              </MenuItem>
              <MenuItem
                isDisabled={gameStatus === GameStatus.playing}
                onClick={endGameModalDisc.onOpen}
                title={
                  gameStatus === GameStatus.playing
                    ? 'Enabled once solved/game ended'
                    : ''
                }
                icon={<EmojiWrapper value="📈" />}
              >
                View Stats/ Share Results
              </MenuItem>
              <MenuItem
                onClick={bugModalDisc.onOpen}
                icon={<EmojiWrapper value="🐛" />}
              >
                Report Bug
              </MenuItem>
              <MenuItem
                onClick={aboutModalDisc.onOpen}
                icon={<EmojiWrapper value="❓" />}
              >
                About
              </MenuItem>
              {process.env.NODE_ENV === 'development' && (
                <MenuGroup title="Debug Mode">
                  <MenuItem
                    onClick={() => {
                      resetLocalStorage();
                    }}
                    icon={<EmojiWrapper value="🧼" />}
                  >
                    Clear LocalStorage
                  </MenuItem>
                  <MenuItem
                    onClick={endGameModalDisc.onOpen}
                    icon={<EmojiWrapper value="👁️‍🗨️" />}
                  >
                    Show End Game Modal
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      // eslint-disable-next-line no-console
                      console.log(getUserData());
                    }}
                    icon={<EmojiWrapper value="📃" />}
                  >
                    Log User Data
                  </MenuItem>
                </MenuGroup>
              )}
            </MenuList>
          </Menu>
        </HStack>
      </HStack>
      {alertDisc.isOpen && (
        <Alert status="warning" maxW="container.sm" mb={4}>
          <AlertIcon />
          <Box flex="1">
            <AlertDescription>
              <Text>
                This is still in alpha. Expect bugs and new features soon.{' '}
              </Text>
              <Text>
                Experienced bugs? Report it using the Bug Report Tool in the
                menu.
              </Text>
            </AlertDescription>
          </Box>
          <CloseButton
            position="absolute"
            right="8px"
            top="8px"
            onClick={alertDisc.onClose}
          />
        </Alert>
      )}
      <EndGameModal
        isOpen={endGameModalDisc.isOpen}
        onClose={endGameModalDisc.onClose}
        gameStatus={gameStatus}
        numWins={numWins}
        numPlayed={numPlayed}
        winStreak={winStreak}
        longestWinStreak={longestWinStreak}
        lastWinDate={lastWinDate}
        turnStats={turnStats}
        onShare={getShareStatus}
      />
      <BugReportModal
        isOpen={bugModalDisc.isOpen}
        onClose={bugModalDisc.onClose}
        resetLocalStorage={resetLocalStorage}
      />
      <AboutModal
        isOpen={aboutModalDisc.isOpen}
        onClose={aboutModalDisc.onClose}
      />
      {!!(gameStatus !== GameStatus.playing && correctAnswer) && (
        <Link isExternal href={`${DICTIONARY_LINK}/word/${correctAnswer}`}>
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
        mt="8"
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
  );
};

export default Home;
