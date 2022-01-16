import {
  ExternalLinkIcon,
  HamburgerIcon,
  QuestionOutlineIcon,
} from '@chakra-ui/icons';
import {
  Box,
  Container,
  Flex,
  Heading,
  HStack,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuItemOption,
  MenuList,
  Spacer,
  Text,
  useColorMode,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import Head from 'next/head';
import React, { useCallback, useEffect, useMemo } from 'react';

import EmojiWrapper from '../atoms/EmojiWrapper';
import { DICTIONARY_LINK } from '../constants';
import { useKeyboard } from '../context/KeyboardContext';
import useWord from '../hooks/useWord';
import AboutModal from '../molecules/AboutModal';
import GameStatusPanel from '../molecules/GameStatusPanel';
import Keyboard from '../molecules/Keyboard';
import BugReportModal from '../organism/BugReportModal';
import DebugCodeModal from '../organism/DebugCodeModal';
import EndGameModal from '../organism/EndGameModal';
import LetterGrid from '../organism/LetterGrid';
import ResetDataAlert from '../organism/ResetDataAlert';
import RulesModal from '../organism/RulesModal';
import GameMode from '../types/GameMode';
import GameStatus from '../types/GameStatus';
import { delay, getUserData } from '../utils';
import { GTAG_EVENTS, sendEvent } from '../utils/gtag';

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
  // Move all disclosures to context
  const endGameModalDisc = useDisclosure();
  const bugModalDisc = useDisclosure();
  const aboutModalDisc = useDisclosure();
  const rulesModalDisc = useDisclosure();
  const debugModalDisc = useDisclosure();
  const resetAlertDisc = useDisclosure();
  const { onOpen: onAlertOpen } = useDisclosure();
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();
  const keyboardRef = useKeyboard();

  const onSolve = useCallback(
    async (answer: string) => {
      try {
        const { gameStatus } = solve(answer);
        await delay(200);
        if (gameStatus !== GameStatus.playing) {
          endGameModalDisc.onOpen();
          sendEvent(GTAG_EVENTS.completedRound);
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
    <>
      <Head>
        <title>Saltong</title>
      </Head>
      <Container centerContent maxW="container.xl">
        <HStack my={4} w="full">
          <Flex flex={1} flexDir="row">
            <GameStatusPanel gameId={gameId} />
          </Flex>
          <Box>
            <Heading size="lg" textAlign="center">
              Saltong
            </Heading>
            <Text fontSize={['sm', 'md']} textAlign="center">
              A Filipino clone of{' '}
              <Link isExternal href="https://www.powerlanguage.co.uk/wordle/">
                Wordle <ExternalLinkIcon />
              </Link>
            </Text>
          </Box>
          <HStack flex={1} flexDir="row-reverse" spacing={4}>
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
                  onClick={rulesModalDisc.onOpen}
                  icon={<EmojiWrapper value="❓" />}
                  display={['inherit', 'none']}
                >
                  How to Play
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
                <MenuDivider />
                <MenuGroup title="UI Settings">
                  <MenuItemOption
                    isChecked={colorMode === 'dark'}
                    onClick={toggleColorMode}
                    closeOnSelect={false}
                  >
                    Dark Mode
                  </MenuItemOption>
                  {/* <MenuItemOption
                    isChecked={colorMode === 'dark'}
                    onClick={toggleColorMode}
                    closeOnSelect={false}
                  >
                    Color Blind Mode (High Contrast)
                  </MenuItemOption> */}
                </MenuGroup>
                <MenuDivider />
                <MenuGroup title="Settings">
                  <MenuItem
                    onClick={bugModalDisc.onOpen}
                    icon={<EmojiWrapper value="🐛" />}
                  >
                    Report Bug
                  </MenuItem>
                  <MenuItem
                    onClick={bugModalDisc.onOpen}
                    icon={<EmojiWrapper value="🔃" />}
                  >
                    Reset Data
                  </MenuItem>
                  <MenuItem
                    onClick={aboutModalDisc.onOpen}
                    icon={<EmojiWrapper value="❓" />}
                  >
                    About
                  </MenuItem>
                </MenuGroup>
                {process.env.NODE_ENV === 'development' && (
                  <>
                    <MenuDivider />
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

                      <MenuItem
                        onClick={debugModalDisc.onOpen}
                        icon={<EmojiWrapper value="🔍" />}
                      >
                        Debug Code
                      </MenuItem>
                    </MenuGroup>
                  </>
                )}
              </MenuList>
            </Menu>

            <Spacer maxW="0" />

            <IconButton
              aria-label="help"
              icon={<QuestionOutlineIcon />}
              onClick={rulesModalDisc.onOpen}
              display={['none', 'inherit']}
            />
          </HStack>
        </HStack>
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
        />
        <AboutModal
          isOpen={aboutModalDisc.isOpen}
          onClose={aboutModalDisc.onClose}
        />
        <RulesModal
          isOpen={rulesModalDisc.isOpen}
          onClose={rulesModalDisc.onClose}
          wordLength={wordLength}
          numTries={numTries}
        />
        <DebugCodeModal
          isOpen={debugModalDisc.isOpen}
          onClose={debugModalDisc.onClose}
        />
        <ResetDataAlert
          isOpen={resetAlertDisc.isOpen}
          onClose={resetAlertDisc.onClose}
          resetLocalStorage={resetLocalStorage}
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
