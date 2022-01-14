import { ExternalLinkIcon, HamburgerIcon } from '@chakra-ui/icons';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  CloseButton,
  Container,
  Flex,
  Heading,
  HStack,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Text,
  useColorMode,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import React, { useEffect, useMemo } from 'react';

import { VERSION } from '../constants';
import useWord from '../hooks/useWord';
import EndGameModal from '../organism/EndGameModal';
import LetterGrid from '../organism/LetterGrid';
import GameMode from '../types/GameMode';
import GameStatus from '../types/GameStatus';

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
    countdownText,
  } = useWord(GameMode.main);
  const tries = useMemo(() => history.map(({ word }) => word), [history]);
  const endGameModalDisc = useDisclosure();
  const { onOpen: onAlertOpen, ...alertDisc } = useDisclosure();
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();

  // TODO: Keyboard + Letter Tracker
  // TODO: Dark mode

  useEffect(() => {
    onAlertOpen();
  }, [onAlertOpen]);

  return (
    <Container centerContent maxW="container.xl">
      <HStack my={4} textAlign="center" w="full">
        <Flex flex={1} flexDir="row">
          <Popover trigger="hover">
            <PopoverTrigger>
              <Text
                cursor="default"
                _hover={{
                  textDecoration: 'underline',
                }}
                fontSize="lg"
              >
                Game #{gameId}
              </Text>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <Flex alignItems="center" flexDir="column" p={5}>
                <Text>Game ends in</Text>
                <Heading size="md">{countdownText}</Heading>
              </Flex>
            </PopoverContent>
          </Popover>
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
          {/* {gameStatus === GameStatus.win && (
            <Button onClick={endGameModalDisc.onOpen}>Share</Button>
          )} */}
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<HamburgerIcon />}
              variant="outline"
            />
            <MenuList>
              <MenuItem onClick={toggleColorMode}>
                Toggle {colorMode === 'light' ? 'Dark' : 'Light'} Mode
              </MenuItem>
              <MenuItem
                isDisabled={gameStatus === GameStatus.playing}
                onClick={endGameModalDisc.onOpen}
                title={
                  gameStatus === GameStatus.playing
                    ? 'Enabled once solved/game ended'
                    : ''
                }
              >
                View Stats/ Share Results
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </HStack>
      {alertDisc.isOpen && (
        <Alert status="warning" maxW="container.sm" mb={4}>
          <AlertIcon />
          <Box flex="1">
            <AlertDescription>
              This is still in alpha. Expect bugs and new features soon. Game
              data from 1/14 is reset due to changes. Sorry{' '}
              <span role="img" aria-labelledby="label">
                🤷
              </span>
              .
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
      <LetterGrid
        numTries={numTries}
        wordLength={wordLength}
        tries={tries}
        onSolve={async (answer) => {
          try {
            const { gameStatus } = await solve(answer);
            if (gameStatus !== GameStatus.playing) {
              endGameModalDisc.onOpen();
            }
          } catch (err) {
            toast({
              description: 'Not in word list',
              status: 'error',
              duration: 5000,
              isClosable: true,
            });
          }
        }}
        gameStatus={gameStatus}
        mt="8"
      />
      {process.env.NODE_ENV === 'development' && (
        <Stack
          border="1px solid gray"
          borderRadius={12}
          my={4}
          p={6}
          textAlign="center"
        >
          <Heading size="md">Dev Box</Heading>
          <Button
            onClick={() => {
              resetLocalStorage();
            }}
            size="sm"
          >
            Clear LocalStorage
          </Button>
          <Button size="sm" onClick={endGameModalDisc.onOpen}>
            Show End Game Modal
          </Button>
        </Stack>
      )}
      <Stack
        pos="fixed"
        direction={['column', 'row']}
        bottom={4}
        justifyContent="space-between"
        alignItems="center"
        w="full"
        maxW="container.xl"
        transform={['scale(0.8)', 'scale(1)']}
      >
        <HStack>
          <Text>{VERSION}</Text>
          <Link isExternal href="https://github.com/carldegs/saltong">
            Github Repo <ExternalLinkIcon />
          </Link>
        </HStack>
        <HStack>
          <Text>
            Word list parsed from{' '}
            <Link isExternal href="https://tagalog.pinoydictionary.com/">
              tagalog.pinoydictionary.com
            </Link>
            <ExternalLinkIcon />
          </Text>
        </HStack>
      </Stack>
    </Container>
  );
};

export default Home;
