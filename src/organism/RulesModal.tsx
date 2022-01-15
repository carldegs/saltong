import {
  Divider,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Stack,
  Text,
} from '@chakra-ui/react';

import LetterBoxRow from '../molecules/LetterBoxRow';
import LetterStatus from '../types/LetterStatus';

interface RulesModalProps extends Omit<ModalProps, 'children'> {
  wordLength: number;
  numTries: number;
}

const EXAMPLE_1 = {
  5: [
    ['S', LetterStatus.wrong],
    ['A', LetterStatus.wrong],
    ['M', LetterStatus.wrong],
    ['P', LetterStatus.correct],
    ['U', LetterStatus.wrong],
  ],
  4: [
    ['A', LetterStatus.wrong],
    ['N', LetterStatus.correct],
    ['I', LetterStatus.wrong],
    ['M', LetterStatus.wrong],
  ],
  7: [
    ['L', LetterStatus.wrong],
    ['A', LetterStatus.wrong],
    ['B', LetterStatus.wrong],
    ['A', LetterStatus.correct],
    ['N', LetterStatus.wrong],
    ['A', LetterStatus.wrong],
    ['N', LetterStatus.wrong],
  ],
};

const EXAMPLE_1_LETTER = { 5: 'P', 4: 'N', 7: 'A' };

const EXAMPLE_2 = {
  5: [
    ['L', LetterStatus.wrong],
    ['U', LetterStatus.wrongSpot],
    ['P', LetterStatus.wrong],
    ['I', LetterStatus.wrong],
    ['T', LetterStatus.wrong],
  ],
  4: [
    ['A', LetterStatus.wrong],
    ['R', LetterStatus.wrongSpot],
    ['A', LetterStatus.wrong],
    ['W', LetterStatus.wrong],
  ],
  7: [
    ['A', LetterStatus.wrong],
    ['B', LetterStatus.wrongSpot],
    ['A', LetterStatus.wrong],
    ['N', LetterStatus.wrong],
    ['G', LetterStatus.wrong],
    ['A', LetterStatus.wrong],
    ['N', LetterStatus.wrong],
  ],
};

const EXAMPLE_2_LETTER = { 5: 'U', 4: 'R', 7: 'B' };

const EXAMPLE_3 = {
  5: [
    ['P', LetterStatus.wrong],
    ['U', LetterStatus.wrong],
    ['N', LetterStatus.wrong],
    ['T', LetterStatus.wrong],
    ['A', LetterStatus.wrong],
  ],
  4: [
    ['M', LetterStatus.wrong],
    ['U', LetterStatus.wrong],
    ['N', LetterStatus.wrong],
    ['A', LetterStatus.wrong],
  ],
  7: [
    ['K', LetterStatus.wrong],
    ['U', LetterStatus.wrong],
    ['T', LetterStatus.wrong],
    ['S', LetterStatus.wrong],
    ['A', LetterStatus.wrong],
    ['R', LetterStatus.wrong],
    ['A', LetterStatus.wrong],
  ],
};

const RulesModal: React.FC<RulesModalProps> = ({
  wordLength,
  numTries,
  isOpen,
  onClose,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>How to Play</ModalHeader>
        <ModalCloseButton />
        <ModalBody mb={4}>
          <Stack spacing={3}>
            <Text>Guess the SALTONG in {numTries} tries.</Text>
            <Text>
              Each guess must be a valid {wordLength} letter word. Hit the enter
              button to submit.
            </Text>
            <Text>
              After each guess, the color of the tiles will change to show how
              close your guess was to the word.
            </Text>
            <Divider />
            <Text fontWeight="bold">Examples</Text>
            <LetterBoxRow
              word={EXAMPLE_1[wordLength]}
              wordLength={wordLength}
            />
            <Text pb={4}>
              The letter {EXAMPLE_1_LETTER[wordLength]} is in the word and in
              the correct spot.
            </Text>
            <LetterBoxRow
              word={EXAMPLE_2[wordLength]}
              wordLength={wordLength}
            />
            <Text pb={4}>
              The letter {EXAMPLE_2_LETTER[wordLength]} is in the word but in
              the wrong spot.
            </Text>
            <LetterBoxRow
              word={EXAMPLE_3[wordLength]}
              wordLength={wordLength}
            />
            <Text pb={4}>The letters are not in the word in any spot.</Text>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default RulesModal;
