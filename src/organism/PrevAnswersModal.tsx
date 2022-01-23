import {
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useMemo } from 'react';

import LetterBox from '../atoms/LetterBox';
import { useHexGame } from '../context/HexGameContext';
import { getHexRootWord, getHexWordList } from '../utils/hex';

const PrevAnswersModal: React.FC<Omit<ModalProps, 'children'>> = ({
  onClose,
  isOpen,
}) => {
  const { gameId, prevRootWordId, prevCenterLetter } = useHexGame();
  const prevRootWord = useMemo(
    () => getHexRootWord(prevRootWordId) || '',
    [prevRootWordId]
  );
  const { list, maxScore } = useMemo(
    () =>
      prevRootWord
        ? getHexWordList(prevRootWord, prevCenterLetter)
        : { list: [], maxScore: 0 },
    [prevRootWord, prevCenterLetter]
  );
  const letters = useMemo(
    () =>
      Array.from(new Set(prevRootWord.split(''))).sort(
        () => Math.random() - 0.5
      ),
    [prevRootWord]
  );
  const textColor = useColorModeValue('gray.400', 'gray.600');
  const hasPrevRound = prevRootWordId && !!(gameId - 1);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>
          {hasPrevRound
            ? `Game #${gameId - 1} Answers`
            : 'Previous Game Answers'}
        </ModalHeader>
        <ModalBody my={8}>
          {!prevRootWord?.length ? (
            <Text>No answers found</Text>
          ) : (
            <Stack alignItems="center" spacing={4}>
              <HStack>
                {letters.map((value) => (
                  <LetterBox
                    bg={
                      prevCenterLetter === value.toLowerCase()
                        ? 'purple.500'
                        : 'purple.200'
                    }
                    color={
                      prevCenterLetter === value.toLowerCase()
                        ? 'purple.100'
                        : 'purple.900'
                    }
                    key={value}
                    value={value}
                  />
                ))}
              </HStack>
              <Text pb={4}>Max Score: {maxScore}</Text>
              {list?.length ? (
                <SimpleGrid columns={[3, 4]} spacing={2}>
                  {list.map(({ word, isPangram }) => (
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
                <Text textAlign="center" py={2} color={textColor}>
                  No answers yet
                </Text>
              )}
            </Stack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PrevAnswersModal;
