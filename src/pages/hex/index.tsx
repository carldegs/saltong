import { Icon, QuestionOutlineIcon } from '@chakra-ui/icons';
import {
  Alert,
  Box,
  CloseButton,
  Container,
  Flex,
  Grid,
  Heading,
  HStack,
  IconButton,
  Link,
  Skeleton,
  Spinner,
  Text,
  Tooltip,
  useColorMode,
} from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { SkipBack } from 'phosphor-react';
import { ReactElement, useEffect, useState } from 'react';

import { MISSING_WORD_FORM } from '../../constants';
import { useDisclosures } from '../../context/DisclosuresContext';
import { HexGameProvider, useHexGame } from '../../context/HexGameContext';
import HexAnswerList from '../../molecules/HexAnswerList';
import HexInput from '../../molecules/HexInput';
import Hexboard from '../../molecules/Hexboard';
import RankStatusBar from '../../molecules/RankStatusBar';
import GameMenu from '../../organism/GameMenu';
import GameMode from '../../types/GameMode';

const HexRulesModal = dynamic(() => import('../../organism/HexRulesModal'));
const BugReportModal = dynamic(() => import('../../organism/BugReportModal'));
const HexShareModal = dynamic(() => import('../../organism/HexShareModal'));
const PrevAnswersModal = dynamic(
  () => import('../../organism/PrevAnswersModal')
);

const HexPage: React.FC = () => {
  const {
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
    isLoading,
    isError,
    fetchError,
  } = useHexGame();
  const { hexRulesModal, hexShareModal, bugReportModal, hexPrevAnsModal } =
    useDisclosures();
  const [showAlert, setShowAlert] = useState(true);
  const { colorMode } = useColorMode();

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

      {!(isLoading || isError) && (
        <>
          {hexRulesModal.isOpen && (
            <HexRulesModal
              isOpen={hexRulesModal.isOpen}
              onClose={hexRulesModal.onClose}
            />
          )}
          {hexShareModal.isOpen && (
            <HexShareModal
              isOpen={hexShareModal.isOpen}
              onClose={hexShareModal.onClose}
              rank={rank}
              score={score}
              gameId={gameId}
              numWords={guessedWords.length}
            />
          )}
          {bugReportModal.isOpen && (
            <BugReportModal
              isOpen={bugReportModal.isOpen}
              onClose={bugReportModal.onClose}
              resetLocalStorage={resetLocalStorage}
            />
          )}
          {hexPrevAnsModal.isOpen && (
            <PrevAnswersModal
              isOpen={hexPrevAnsModal.isOpen}
              onClose={hexPrevAnsModal.onClose}
            />
          )}
        </>
      )}

      {showAlert ? (
        <Alert status="success">
          <Text width="96%">
            Found a missing word? Report it at the{' '}
            <Link
              isExternal
              href={MISSING_WORD_FORM}
              fontWeight="bold"
              color={colorMode === 'dark' ? 'green.200' : 'green.600'}
            >
              Saltong Dictionary Reklamo Corner
            </Link>{' '}
            and help improve the word list before we get bought out by a
            newspaper company. (jk)
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
      <Container centerContent maxW="container.xl" h="calc(100vh - 50px)">
        <HStack my={4} w="full">
          <Box>
            <Heading size="lg" textTransform="capitalize">
              {`Saltong Hex`}
            </Heading>
            <Skeleton isLoaded={!isLoading}>
              <Text cursor="default" fontSize={['md', 'lg']}>
                Game #{gameId}
              </Text>
            </Skeleton>
          </Box>
          <HStack flex={1} justifyContent="flex-end" spacing={[2, 3]}>
            <Tooltip label="How to Play" openDelay={300}>
              <IconButton
                aria-label="help"
                icon={<QuestionOutlineIcon />}
                onClick={hexRulesModal.onOpen}
              />
            </Tooltip>

            <Tooltip label="Previous Answers" openDelay={300}>
              <IconButton
                aria-label="previous answers"
                icon={<Icon as={SkipBack} weight="bold" />}
                onClick={hexPrevAnsModal.onOpen}
              />
            </Tooltip>

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
          <Flex
            w="full"
            h="full"
            alignItems="flex-start"
            justifyContent="center"
          >
            <Box
              display={['none', 'none', 'none', 'inherit']}
              w="full"
              maxW="300px"
            />
            <Flex
              flexDir="column"
              h="full"
              W="full"
              flexGrow={1}
              alignItems="center"
            >
              <RankStatusBar rank={rank} score={score} />
              <Grid
                w="full"
                gridTemplateRows={['auto 1fr auto', '1fr auto']}
                h="full"
                mt={3}
              >
                <Box display={['inherit', 'none']}>
                  <HexAnswerList answers={guessedWords} />
                </Box>
                <Flex maxH="500px" h="full" w="full" alignItems="center" mt={3}>
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
                  mb={6}
                />
              </Grid>
            </Flex>
            <Flex
              display={['none', 'inherit']}
              ml={6}
              maxW="350px"
              w="full"
              my={12}
              alignItems="flex-start"
            >
              <HexAnswerList answers={guessedWords} listMode />
            </Flex>
          </Flex>
        )}
      </Container>
    </>
  );
};

(HexPage as any).getLayout = function getLayout(page: ReactElement) {
  return <HexGameProvider>{page}</HexGameProvider>;
};

export default HexPage;
