/* eslint-disable jsx-a11y/no-autofocus */
import { ChevronDownIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Box,
  Container,
  Flex,
  Grid,
  Heading,
  HStack,
  Link,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  SimpleGrid,
  Spacer,
  Text,
  useBreakpointValue,
  useDisclosure,
  useToast,
  UseToastOptions,
} from '@chakra-ui/react';
import Head from 'next/head';
import { useCallback, useMemo, useState } from 'react';

import { HEX_RANK } from '../../constants';
import { useKeyboard } from '../../context/KeyboardContext';
import HexInput from '../../molecules/HexInput';
import Hexboard from '../../molecules/Hexboard';
import { HexGameWordList } from '../../types/HexGameData';
import { getHexWordList, getRank, isPangram } from '../../utils/hex';

const rootWord = 'hatsing';
const cLetter = 'h';
const HexPage: React.FC = () => {
  const numWordsShown = useBreakpointValue([5, 8]);
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
  const answeredPopoverDisc = useDisclosure();

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

  return (
    <>
      <Head>
        <title>Saltong HEX</title>
      </Head>

      <Container centerContent maxW="container.xl" h="calc(100vh - 50px)">
        <HStack my={4} w="full">
          <Flex flex={1} flexDir="row">
            X
          </Flex>
          <Box>
            <Heading size="lg" textAlign="center" textTransform="capitalize">
              {`Saltong Hex`}
            </Heading>
            <Text fontSize={['sm', 'md']} textAlign="center">
              A Filipino clone of{' '}
              <Link
                isExternal
                href="https://www.nytimes.com/puzzles/spelling-bee"
              >
                NYT Spelling Bee <ExternalLinkIcon />
              </Link>
            </Text>
          </Box>
          <HStack flex={1} flexDir="row-reverse" spacing={4}>
            X
          </HStack>
        </HStack>
        <Box pos="relative" w="full" maxW={['350px', '500px']} mt={4}>
          <Flex w="full" alignItems="center" zIndex={1} pos="relative">
            {HEX_RANK.map(({ name }, i) => {
              const isCurrRank = name === rank.name;
              const isPastRank = i < rank.index;
              const size = isCurrRank ? 8 : 3;
              return (
                <>
                  <Flex
                    w={size}
                    h={size}
                    bg={isCurrRank || isPastRank ? 'purple.600' : 'gray.600'}
                    borderRadius={20}
                    key={name}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text
                      textAlign="center"
                      fontWeight="bold"
                      fontSize={score > 100 ? 'sm' : 'lg'}
                    >
                      {isCurrRank && score}
                    </Text>
                  </Flex>
                  {i < HEX_RANK.length - 1 && <Spacer />}
                </>
              );
            })}
          </Flex>
          <Box
            pos="absolute"
            left={`${rank.index * (100 / HEX_RANK.length)}%`}
            w="fit-content"
          >
            <Text
              textAlign="center"
              ml="-50%"
              mt={1}
              size="lg"
              fontWeight="bold"
              color="purple.300"
            >
              {rank.name.toUpperCase()}
            </Text>
          </Box>
          <Box
            pos="absolute"
            h="2px"
            bg="purple.600"
            w={`${rank.index * (100 / HEX_RANK.length + 1)}%`}
            top="48%"
            zIndex={0}
          />
          <Box
            pos="absolute"
            h="2px"
            bg="gray.600"
            w="full"
            top="48%"
            zIndex={-1}
          />
        </Box>
        <Grid w="full" gridTemplateRows="auto 1fr auto" h="full" mt={12}>
          <Popover
            autoFocus={false}
            isOpen={answeredPopoverDisc.isOpen}
            onClose={answeredPopoverDisc.onClose}
          >
            <PopoverTrigger>
              <HStack
                w="full"
                border="1px solid white"
                px={3}
                py={3}
                borderRadius={12}
                minH="50px"
                alignItems="center"
                onClick={answeredPopoverDisc.onToggle}
                maxW="550px"
                mx="auto"
                cursor="pointer"
              >
                <HStack spacing={2} flexGrow={1} maxW="500px" overflow="hidden">
                  {answers
                    .slice()
                    .reverse()
                    .slice(0, numWordsShown)
                    .map(({ word, isPangram }) => (
                      <Text
                        textAlign="center"
                        key={`answer-shown-${word}`}
                        fontWeight={isPangram && 'bold'}
                        color={isPangram && 'purple.400'}
                      >
                        {word}
                      </Text>
                    ))}
                </HStack>
                <ChevronDownIcon
                  fontSize="xl"
                  transform={answeredPopoverDisc.isOpen && 'rotate(180deg)'}
                />
              </HStack>
            </PopoverTrigger>
            <PopoverContent w={['xs', 'sm', 'lg']}>
              <PopoverHeader textAlign="center">
                {answers.length} words found
              </PopoverHeader>
              <PopoverBody>
                {answers.length ? (
                  <SimpleGrid columns={[3, 6]} spacing={2}>
                    {answers.map(({ word, isPangram }) => (
                      <Text
                        key={`answer-list-${word}`}
                        textAlign="center"
                        fontWeight={isPangram && 'bold'}
                        color={isPangram && 'purple.400'}
                      >
                        {word}
                      </Text>
                    ))}
                  </SimpleGrid>
                ) : (
                  <Text textAlign="center" py={2}>
                    No Answers Yet
                  </Text>
                )}
              </PopoverBody>
            </PopoverContent>
          </Popover>
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

      {/* <SimpleGrid columns={12} spacing={4}>
        {list.map(({ word, score, isPangram }) => (
          <Text
            key={word}
            textAlign="center"
            color={isPangram && 'purple.200'}
            fontWeight={isPangram && 'bold'}
            textDecoration={answers.indexOf(word) >= 0 && 'line-through'}
          >
            {word} ({score})
          </Text>
        ))}
      </SimpleGrid> */}
    </>
  );
};

export default HexPage;
