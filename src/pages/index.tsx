import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Link,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useMemo } from 'react';

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
  } = useWord(GameMode.main);
  const tries = useMemo(() => history.map(({ word }) => word), [history]);
  const endGameModalDisc = useDisclosure();

  // TODO: Keyboard + Letter Tracker
  // TODO: Endgame Modal
  // TODO: Share Result
  // TODO: Next game timer
  // TODO: Dark mode

  return (
    <Container centerContent maxW="container.xl">
      <Box my={4} textAlign="center">
        <Heading size="lg">Saltong</Heading>
        <Text>
          A Filipino clone of{' '}
          <Link isExternal href="https://www.powerlanguage.co.uk/wordle/">
            Wordle <ExternalLinkIcon />
          </Link>
          .
        </Text>
        <Text color="red.300">
          This is still in alpha. More features and functionalities will be
          added in the future.
        </Text>
      </Box>
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
          >
            Clear LocalStorage
          </Button>
          <Button onClick={endGameModalDisc.onOpen}>Show End Game Modal</Button>
        </Stack>
      )}
      <EndGameModal
        isOpen={endGameModalDisc.isOpen}
        onClose={endGameModalDisc.onClose}
        gameStatus={gameStatus}
        onShare={getShareStatus}
      />
      <LetterGrid
        numTries={numTries}
        wordLength={wordLength}
        tries={tries}
        onSolve={async (answer) => {
          const { gameStatus } = await solve(answer);
          if (gameStatus !== GameStatus.playing) {
            endGameModalDisc.onOpen();
          }
        }}
        gameStatus={gameStatus}
      />
      <HStack pos="fixed" bottom={4}>
        <Text>{VERSION}</Text>
        <Link isExternal href="https://github.com/carldegs/saltong">
          Github Repo <ExternalLinkIcon />
        </Link>
      </HStack>
    </Container>
  );
};

export default Home;
