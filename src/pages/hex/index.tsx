import { ExternalLinkIcon, QuestionOutlineIcon } from '@chakra-ui/icons';
import {
  Box,
  Container,
  Flex,
  Grid,
  Heading,
  HStack,
  IconButton,
  Link,
  SimpleGrid,
  Text,
  useToast,
  UseToastOptions,
} from '@chakra-ui/react';
import Head from 'next/head';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useDisclosures } from '../../context/DisclosuresContext';
import { useKeyboard } from '../../context/KeyboardContext';
import HexAnswerList from '../../molecules/HexAnswerList';
import HexInput from '../../molecules/HexInput';
import Hexboard from '../../molecules/Hexboard';
import RankStatusBar from '../../molecules/RankStatusBar';
import GameMenu from '../../organism/GameMenu';
import HexRulesModal from '../../organism/HexRulesModal';
import HexShareModal from '../../organism/HexShareModal';
import GameMode from '../../types/GameMode';
import { HexGameWordList } from '../../types/HexGameData';
import {
  analyzeWord,
  getHexRootWordIndex,
  getHexWordList,
  getRank,
  isPangram,
} from '../../utils/hex';

const rootWord = 'balwarte';
const cLetter = 't';
const ANALYSIS_MODE = false;

const HexPage: React.FC = () => {
  const toast = useToast();
  const keyboardRef = useKeyboard();
  const [answers, setAnswers] = useState<
    { word: string; isPangram: boolean }[]
  >([]);
  const [score, setScore] = useState(0);
  const { list, centerLetter, maxScore } = useMemo(
    () =>
      !rootWord
        ? ({
            list: [],
          } as HexGameWordList)
        : getHexWordList(rootWord, cLetter),
    []
  );
  const rank = useMemo(() => getRank(score, maxScore), [score, maxScore]);
  const gameId = 0;
  const letters = useMemo(
    () =>
      Array.from(new Set(Array.from(rootWord))).filter(
        (l) => l != centerLetter
      ),
    [centerLetter]
  );

  const solve = useCallback(
    (answer?: string) => {
      if (!answer) {
        return;
      }
      answer = answer.toLowerCase();

      const match = list.find(({ word }) => word === answer);
      const hasAnswered = answers.findIndex(({ word }) => word === answer) >= 0;

      const defaultToast: UseToastOptions = {
        position: 'top',
        duration: 800,
      };

      if (!match?.word) {
        toast({
          description: answer.includes(centerLetter)
            ? 'Not in word list'
            : 'Center letter required',
          status: 'error',
          ...defaultToast,
        });
      } else if (hasAnswered) {
        toast({
          description: 'Already answered',
          status: 'warning',
          ...defaultToast,
        });
      } else if (match?.word && !hasAnswered) {
        setAnswers((curr) => [
          ...curr,
          {
            word: answer,
            isPangram: isPangram(answer),
          },
        ]);
        setScore((curr) => curr + match.score);
        toast({
          description: `+${match.score} pts ${
            match.isPangram ? '(PANGRAM!)' : ''
          }`,
          status: match.isPangram ? 'success' : 'info',
          ...defaultToast,
        });
      }

      if (keyboardRef.current?.value) {
        keyboardRef.current.value = '';
        keyboardRef.current.blur();
        keyboardRef.current.focus();
      }
    },
    [list, keyboardRef, answers, toast, centerLetter]
  );
  const { hexRulesModal, hexShareModal } = useDisclosures();

  useEffect(() => {
    if (ANALYSIS_MODE && process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log(getHexRootWordIndex(rootWord), analyzeWord(rootWord));
    }
  }, []);

  return (
    <>
      <Head>
        <title>Saltong HEX</title>
      </Head>

      <HexRulesModal
        isOpen={hexRulesModal.isOpen}
        onClose={hexRulesModal.onClose}
        maxScore={maxScore}
        wordList={list}
      />
      <HexShareModal
        isOpen={hexShareModal.isOpen}
        onClose={hexShareModal.onClose}
        rank={rank}
        score={score}
        gameId={gameId}
        numWords={answers.length}
      />

      <Container centerContent maxW="container.xl" h="calc(100vh - 50px)">
        <HStack my={4} w="full">
          <Flex flex={1} flexDir="row">
            Beta Test
          </Flex>
          <Box>
            <Heading size="lg" textAlign="center" textTransform="capitalize">
              {`Saltong Hex`}
            </Heading>
            <Text
              fontSize={['sm', 'md']}
              textAlign="center"
              maxW={['150px', '300px']}
            >
              A Filipino clone of the{' '}
              <Link
                isExternal
                href="https://www.nytimes.com/puzzles/spelling-bee"
              >
                NYT Spelling Bee <ExternalLinkIcon />
              </Link>
            </Text>
          </Box>
          <HStack flex={1} justifyContent="flex-end" spacing={4}>
            <IconButton
              aria-label="help"
              icon={<QuestionOutlineIcon />}
              onClick={hexRulesModal.onOpen}
              display={['none', 'inherit']}
            />

            <GameMenu
              gameMode={GameMode.hex}
              resetLocalStorage={() => {
                // TODO: Add reset func
                // eslint-disable-next-line no-console
                console.log('reset');
              }}
            />
          </HStack>
        </HStack>
        <RankStatusBar rank={rank} score={score} />
        <Grid w="full" gridTemplateRows="auto 1fr auto" h="full" mt={12}>
          <HexAnswerList answers={answers} />
          <Flex maxH="500px" h="full" w="full" alignItems="center">
            <HexInput
              onSolve={solve}
              centerLetter={centerLetter}
              letters={letters}
            />
          </Flex>
          <Hexboard
            letters={letters}
            onEnter={solve}
            centerLetter={centerLetter}
            mx="auto"
          />
        </Grid>
      </Container>

      {ANALYSIS_MODE && process.env.NODE_ENV === 'development' && (
        <SimpleGrid columns={[4, 12]} spacing={4}>
          {list.map(({ word, score, isPangram }) => (
            <Text
              key={word}
              textAlign="center"
              color={isPangram && 'purple.200'}
              fontWeight={isPangram && 'bold'}
              textDecoration={
                answers.findIndex((answer) => answer.word === word) >= 0 &&
                'line-through'
              }
            >
              {word} ({score})
            </Text>
          ))}
        </SimpleGrid>
      )}
    </>
  );
};

export default HexPage;
