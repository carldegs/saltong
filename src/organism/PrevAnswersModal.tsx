import {
  Box,
  Flex,
  HStack,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Spacer,
  Spinner,
  Stack,
  Tag,
  TagLabel,
  TagRightIcon,
  Text,
  useColorModeValue,
  Wrap,
} from '@chakra-ui/react';
import { useMemo } from 'react';

import LetterBox from '../atoms/LetterBox';
import { DICTIONARY_LINK } from '../constants';
import useQueryRoundData from '../queries/useQueryRoundData';
import GameMode from '../types/GameMode';
import { HexGameData } from '../types/HexGameData';
import {
  getCurrGameDate,
  getDateString,
  getPrevGameDate,
  getWordScore,
  isPangram,
} from '../utils';

const PrevAnswersModal: React.FC<Omit<ModalProps, 'children'>> = ({
  onClose,
  isOpen,
}) => {
  const { data, isLoading } = useQueryRoundData(
    GameMode.hex,
    getDateString(getPrevGameDate(getCurrGameDate())),
    true
  );
  const { words, rootWord, centerLetter, maxScore, gameId } = (data ||
    {}) as HexGameData;

  const letters = useMemo(
    () =>
      isLoading
        ? []
        : Array.from(new Set(rootWord.split(''))).sort(
            () => Math.random() - 0.5
          ),
    [isLoading, rootWord]
  );
  const textColor = useColorModeValue('gray.400', 'gray.600');
  const hasPrevRound = rootWord && !!gameId;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>
          {hasPrevRound ? `Game #${gameId} Answers` : 'Previous Game Answers'}
        </ModalHeader>
        {isLoading ? (
          <ModalBody my={8}>
            <Spinner />
          </ModalBody>
        ) : (
          <ModalBody my={8}>
            {!rootWord?.length ? (
              <Text>No answers found</Text>
            ) : (
              <Stack alignItems="center" spacing={4}>
                <HStack>
                  {letters.map((value) => (
                    <LetterBox
                      bg={
                        centerLetter === value.toLowerCase()
                          ? 'purple.500'
                          : 'purple.200'
                      }
                      color={
                        centerLetter === value.toLowerCase()
                          ? 'purple.100'
                          : 'purple.900'
                      }
                      key={value}
                      value={value}
                    />
                  ))}
                </HStack>
                <Flex>
                  <Text>Max Score: {maxScore}</Text>
                  <Spacer minW={8} />
                  <Text>Number of Words: {words.length}</Text>
                </Flex>

                <Text opacity={0.4}>
                  Click the word to see its definition (opens a new tab)
                </Text>
                {words?.length ? (
                  <Wrap shouldWrapChildren>
                    {words.map((word) => {
                      const pangram = isPangram(word);
                      return (
                        <Link
                          key={`answer-list-${word}`}
                          isExternal
                          href={`${DICTIONARY_LINK}/search?q=${word}`}
                        >
                          <Tag
                            colorScheme={pangram ? 'purple' : 'gray'}
                            minW="92px"
                          >
                            <TagLabel>{word}</TagLabel>
                            <Spacer />
                            <TagRightIcon
                              as={() => (
                                <Box
                                  py={0}
                                  px={1}
                                  bg={pangram ? 'purple.300' : 'gray.300'}
                                  borderRadius={12}
                                  ml={2}
                                >
                                  <Text color="gray.900" fontWeight="bold">
                                    {getWordScore(word)}
                                  </Text>
                                </Box>
                              )}
                            />
                          </Tag>
                        </Link>
                      );
                    })}
                  </Wrap>
                ) : (
                  <Text textAlign="center" py={2} color={textColor}>
                    No answers yet
                  </Text>
                )}
              </Stack>
            )}
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
};

export default PrevAnswersModal;
