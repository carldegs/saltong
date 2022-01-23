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
  Text,
} from '@chakra-ui/react';
import Head from 'next/head';
import { useEffect } from 'react';

import { useDisclosures } from '../../context/DisclosuresContext';
import { useHexGame } from '../../context/HexGameContext';
import HexAnswerList from '../../molecules/HexAnswerList';
import HexInput from '../../molecules/HexInput';
import Hexboard from '../../molecules/Hexboard';
import RankStatusBar from '../../molecules/RankStatusBar';
import BugReportModal from '../../organism/BugReportModal';
import GameMenu from '../../organism/GameMenu';
import HexRulesModal from '../../organism/HexRulesModal';
import HexShareModal from '../../organism/HexShareModal';
import PrevAnswersModal from '../../organism/PrevAnswersModal';
import GameMode from '../../types/GameMode';

const HexPage: React.FC = () => {
  const {
    maxScore,
    list,
    rank,
    score,
    gameId,
    guessedWords,
    solve,
    centerLetter,
    letters,
    resetLocalStorage,
    firstVisit,
    setFirstVisit,
  } = useHexGame();
  const { hexRulesModal, hexShareModal, bugReportModal, hexPrevAnsModal } =
    useDisclosures();

  useEffect(() => {
    if (firstVisit) {
      hexRulesModal.onOpen();
      setFirstVisit(false);
    }
  }, [firstVisit, hexRulesModal, setFirstVisit]);

  return (
    <>
      <Head>
        <title>Saltong HEX</title>
        <meta name="theme-color" content="#6B46C1" />
        <meta name="apple-mobile-web-app-status-bar" content="#6B46C1" />
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
        numWords={guessedWords.length}
      />
      <BugReportModal
        isOpen={bugReportModal.isOpen}
        onClose={bugReportModal.onClose}
        resetLocalStorage={resetLocalStorage}
      />
      <PrevAnswersModal
        isOpen={hexPrevAnsModal.isOpen}
        onClose={hexPrevAnsModal.onClose}
      />

      <Container centerContent maxW="container.xl" h="calc(100vh - 50px)">
        <HStack my={4} w="full">
          <Flex flex={1} flexDir="row">
            <Text cursor="default" fontSize={['md', 'lg']} textAlign="center">
              Game #{gameId}
            </Text>
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
          <HexAnswerList answers={guessedWords} />
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
    </>
  );
};

export default HexPage;
