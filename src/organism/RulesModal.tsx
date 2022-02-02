import {
  Box,
  BoxProps,
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
  const [isFilipino, setFilipino] = useState(true);
  const finalRef = useRef();
  // TODO: Temp only.
  const TranslatedText: React.FC<
    { text: string; translation: string } & BoxProps
  > = ({ text, translation, ...boxProps }) => (
    <Box {...boxProps}>
      <Text>{isFilipino ? translation : text}</Text>
    </Box>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      initialFocusRef={finalRef}
      size="lg"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <TranslatedText text="How to Play" translation="Paano Laruin" />
        </ModalHeader>

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
            icon={<EmojiWrapper value={isFilipino ? '🇵🇭' : '🇺🇸'} />}
            onClick={() => {
              setFilipino((curr) => !curr);
            }}
            pos="absolute"
            right="50px"
            top="20px"
          />
        </Tooltip>
        <ModalCloseButton ref={finalRef} />
        <ModalBody mb={4}>
          <Stack spacing={3}>
            <TranslatedText
              text={`Guess the SALTONG in ${numTries} tries.`}
              translation={`Hulaan ang SALTONG sa loob ng ${numTries} na tira.`}
            />

            <TranslatedText
              text={`Each guess must be a valid ${wordLength} letter word. Hit the enter button to submit.`}
              translation={`Ang bawat hulang salita ay dapat ${wordLength} letra ang haba. Pindutin ang Enter button para i-submit`}
            />

            <TranslatedText
              text="After each guess, the color of the tiles will change to show how close your guess was to the word."
              translation="Pagkatapos ng bawat tira, mag-iiba ang kulay ng mga tiles na nagpapakita kung gaano kalapit ang hula mo sa tamang sagot"
            />
            <Divider />
            <b>
              <TranslatedText text="Examples" translation="Mga Halimbawa" />
            </b>
            <LetterBoxRow
              word={EXAMPLE_1[wordLength]}
              wordLength={wordLength}
            />
            <TranslatedText
              pb={4}
              text={`The letter ${EXAMPLE_1_LETTER[wordLength]} is in the word and in the correct spot.`}
              translation={`Ang letrang ${EXAMPLE_1_LETTER[wordLength]} ay nasa salita at nasa tamang pwesto`}
            />
            <LetterBoxRow
              word={EXAMPLE_2[wordLength]}
              wordLength={wordLength}
            />

            <TranslatedText
              pb={4}
              text={`The letter ${EXAMPLE_2_LETTER[wordLength]} is in the word but in
              the wrong spot.`}
              translation={`Ang letrang ${EXAMPLE_2_LETTER[wordLength]} ay nasa salita ngunit nasa maling pwesto`}
            />

            <LetterBoxRow
              word={EXAMPLE_3[wordLength]}
              wordLength={wordLength}
            />
            <TranslatedText
              pb={4}
              text="The letters are not in the word in any spot."
              translation="Walang letra ang nasa salita"
            />
            <Divider />
            <TranslatedText
              text="A new word will be avaiable each day."
              translation="May bagong salitang lalabas araw-araw."
            />
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default RulesModal;
