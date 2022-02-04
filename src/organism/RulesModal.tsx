import {
  Box,
  Divider,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Stack,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';

import EmojiWrapper from '../atoms/EmojiWrapper';
import useTranslate from '../hooks/useTranslate';
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

const messages = {
  header: {
    en: 'How to Play',
    fil: 'Paano Laruin',
  },
  ruleNumTries: {
    en: 'Guess the SALTONG in {numTries} tries.',
    fil: 'Hulaan ang SALTONG sa loob ng {numTries} na tira.',
  },
  ruleWordLength: {
    en: 'Each guess must be a valid {wordLength} letter word. Hit the enter button to submit.',
    fil: 'Ang bawat hulang salita ay dapat {wordLength} letra ang haba. Pindutin ang Enter button para i-submit',
  },
  ruleColor: {
    en: 'After each guess, the color of the tiles will change to show how close your guess was to the word.',
    fil: 'Pagkatapos ng bawat tira, mag-iiba ang kulay ng mga tiles na nagpapakita kung gaano kalapit ang hula mo sa tamang sagot',
  },
  examples: {
    en: 'Examples',
    fil: 'Mga Halimbawa',
  },
  ex1: {
    en: 'The letter {ex1Letter} is in the word and in the correct spot.',
    fil: 'Ang letrang {ex1Letter} ay nasa salita at nasa tamang pwesto',
  },
  ex2: {
    en: 'The letter {ex2Letter} is in the word but in the wrong spot.',
    fil: 'Ang letrang {ex2Letter} ay nasa salita ngunit nasa maling pwesto',
  },
  ex3: {
    en: 'The letters are not in the word in any spot.',
    fil: 'Walang letra ang nasa salita',
  },
  sched: {
    en: 'A new word will be avaiable each day.',
    fil: 'May bagong salitang lalabas araw-araw.',
  },
};

const RulesModal: React.FC<RulesModalProps> = ({
  wordLength,
  numTries,
  isOpen,
  onClose,
}) => {
  const [lang, setLang] = useState('fil');
  const { getMessage } = useTranslate(messages, lang, {
    numTries,
    wordLength,
    ex1Letter: EXAMPLE_1_LETTER[wordLength],
    ex2Letter: EXAMPLE_2_LETTER[wordLength],
  });
  const finalRef = useRef();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      initialFocusRef={finalRef}
      size="lg"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{getMessage('header')}</ModalHeader>

        <Tooltip
          label={
            <Box>
              <Text>Change Language</Text>
              <Text>
                <i>Baguhin ang Wika</i>
              </Text>
            </Box>
          }
          openDelay={500}
        >
          <IconButton
            aria-label="language"
            icon={<EmojiWrapper value={lang === 'fil' ? '🇵🇭' : '🇺🇸'} />}
            onClick={() => {
              setLang((curr) => (curr === 'fil' ? 'en' : 'fil'));
            }}
            pos="absolute"
            right="50px"
            top="20px"
          />
        </Tooltip>
        <ModalCloseButton ref={finalRef} />
        <ModalBody mb={4}>
          <Stack spacing={3}>
            <Text>{getMessage('ruleNumTries')}</Text>
            <Text>{getMessage('ruleWordLength')}</Text>
            <Text>{getMessage('ruleColor')}</Text>

            <Divider />
            <b>{getMessage('examples')} </b>
            <LetterBoxRow
              word={EXAMPLE_1[wordLength]}
              wordLength={wordLength}
            />
            <Text pb={4}>{getMessage('ex1')}</Text>
            <LetterBoxRow
              word={EXAMPLE_2[wordLength]}
              wordLength={wordLength}
            />
            <Text pb={4}>{getMessage('ex2')}</Text>
            <LetterBoxRow
              word={EXAMPLE_3[wordLength]}
              wordLength={wordLength}
            />
            <Text pb={4}>{getMessage('ex3')}</Text>
            <Divider />
            <Text>{getMessage('sched')}</Text>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default RulesModal;
