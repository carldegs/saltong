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
  Spinner,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useMemo } from 'react';

import LetterBox from '../atoms/LetterBox';
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
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
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
                <Text pb={4}>Max Score: {maxScore}</Text>
                {words?.length ? (
                  <SimpleGrid columns={[3, 4]} spacing={2} w="full">
                    {words.map((word) => {
                      const pangram = isPangram(word);
                      return (
                        <Text
                          key={`answer-list-${word}`}
                          textAlign="center"
                          fontWeight={pangram && 'bold'}
                          color={pangram && 'purple.400'}
                        >
                          {`${word} (${getWordScore(word)})`}
                        </Text>
                      );
                    })}
                  </SimpleGrid>
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
