import {
  Container,
  HStack,
  Box,
  Flex,
  Heading,
  Skeleton,
  useColorMode,
} from '@chakra-ui/react';
import Head from 'next/head';
import { ReactElement, useMemo } from 'react';

import { BalGameProvider, useBalGame } from '../context/BalGameContext';
import LetterGrid from '../organism/LetterGrid';
import GameStatus from '../types/GameStatus';

const BalPage: React.FC = () => {
  const { isLoading, patternGrid, history, solve } = useBalGame();
  const { colorMode } = useColorMode();
  const tries = useMemo(() => history.map(({ word }) => word), [history]);

  return (
    <>
      <Head>
        <title>Saltong BAL</title>
        <meta name="theme-color" content="#D53F8C" />
        <meta name="apple-mobile-web-app-status-bar" content="#D53F8C" />
      </Head>

      <Container centerContent maxW="container.xl" h="calc(100vh - 50px)">
        <HStack my={4} w="full">
          <Box>
            <Flex>
              <Heading size="lg">Saltong</Heading>
              <Heading
                size="lg"
                color={colorMode === 'dark' ? 'purple.400' : 'purple.600'}
                ml={2}
              >
                Bal
              </Heading>
            </Flex>
            <Skeleton isLoaded={!isLoading}>
              {/* <Text cursor="d
               */}
            </Skeleton>
          </Box>
        </HStack>
        <LetterGrid
          numTries={patternGrid.length}
          wordLength={(patternGrid || [])[0]?.length}
          tries={tries}
          onSolve={solve}
          gameStatus={GameStatus.playing}
          patternGrid={patternGrid}
        />
      </Container>
    </>
  );
};

(BalPage as any).getLayout = function getLayout(page: ReactElement) {
  return <BalGameProvider>{page}</BalGameProvider>;
};

export default BalPage;
