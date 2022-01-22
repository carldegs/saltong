import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Stack,
  ModalProps,
  Text,
  ListItem,
  UnorderedList,
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  useColorModeValue,
  Table,
  Thead,
  Tr,
  Td,
  Th,
  Tbody,
  OrderedList,
} from '@chakra-ui/react';

import { HEX_RANK } from '../constants';
import { HexGameWordListItem } from '../types/HexGameData';

interface HexRulesModalProps extends Omit<ModalProps, 'children'> {
  maxScore: number;
  wordList: HexGameWordListItem[];
}

const HexRulesModal: React.FC<HexRulesModalProps> = ({
  isOpen,
  onClose,
  maxScore,
  wordList,
}) => {
  const isDarkMode = useColorModeValue(false, true);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>How to Play</ModalHeader>
        <ModalCloseButton />
        <ModalBody mb={4}>
          <Stack spacing={6}>
            <Text>Make as many words as you can given seven letters.</Text>
            <Accordion defaultIndex={[0]}>
              <AccordionItem>
                <Stack spacing={2}>
                  <h2>
                    <AccordionButton>
                      <Box flex="1" textAlign="left">
                        Rules
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pl={4} pb={4}>
                    <UnorderedList spacing={1}>
                      <ListItem>
                        Words must be four to eight letters long.
                      </ListItem>
                      <ListItem>Words must contain the center letter.</ListItem>
                      <ListItem>Letters can be used more than once.</ListItem>
                      <ListItem>
                        The word list does not include hyphenated, obscure, or
                        obscene words.
                      </ListItem>
                      <ListItem>
                        The goal of the game is to earn enough points to get the
                        rank of BATHALA. Check the scoring section for the
                        points system.
                      </ListItem>
                    </UnorderedList>
                  </AccordionPanel>
                </Stack>
              </AccordionItem>
              <AccordionItem>
                <Stack spacing={2}>
                  <h2>
                    <AccordionButton>
                      <Box flex="1" textAlign="left">
                        Scoring
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pl={4} pb={4}>
                    <UnorderedList spacing={2}>
                      <ListItem>4-letter words are worth 1pt.</ListItem>
                      <ListItem>
                        Longer words are worth 1pt per letter (e.g., MANONG =
                        6pts, DUWAG = 5pts).
                      </ListItem>
                      <ListItem>
                        When you&apos;ve used all letters in a word (called a{' '}
                        <b>pangram</b>), you will get 7 additional points.
                      </ListItem>
                    </UnorderedList>
                    <Box
                      bg={isDarkMode ? 'gray.600' : 'gray.200'}
                      px={3}
                      py={2}
                      borderRadius={4}
                      mt={2}
                    >
                      <Text fontWeight="bold">Example</Text>
                      <Text mb={2}>
                        Given the letters <b>K T O R E S P</b>, with <b>O</b>{' '}
                        being the center letter:
                      </Text>
                      <Box pl={2}>
                        <UnorderedList>
                          <ListItem>
                            <b>KESO</b> is worth 1 pt.
                          </ListItem>
                          <ListItem>
                            <b>TORPE</b> is 5 pts.
                          </ListItem>
                          <ListItem>
                            <b>EKSPORT</b> is 14 pts. because it is 7 letters
                            long and the word is a pangram.
                          </ListItem>
                          <ListItem>
                            <b>EKSPERTO</b> is 15 pts.
                          </ListItem>
                        </UnorderedList>
                      </Box>
                    </Box>
                  </AccordionPanel>
                </Stack>
              </AccordionItem>
              <AccordionItem>
                <Stack spacing={2}>
                  <h2>
                    <AccordionButton>
                      <Box flex="1" textAlign="left">
                        Rankings
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pl={4} pb={4}>
                    The points needed to reach a rank will differ every Saltong
                    Hex Round. The points needed for this round is:
                    <Table
                      variant="simple"
                      colorScheme={isDarkMode ? 'white' : 'gray'}
                      size="sm"
                      mt={2}
                      maxW="250px"
                      mx="auto"
                    >
                      <Thead>
                        <Tr>
                          <Th>Rank</Th>
                          <Th isNumeric>Points needed</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {HEX_RANK.map(({ name, percentage }) => (
                          <Tr key={name}>
                            <Td textTransform="capitalize">{name}</Td>
                            <Td isNumeric>
                              {Math.ceil(maxScore * percentage)}
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </AccordionPanel>
                </Stack>
              </AccordionItem>

              <AccordionItem>
                <Stack spacing={2}>
                  <h2>
                    <AccordionButton>
                      <Box flex="1" textAlign="left">
                        Hints
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pl={4} pb={4}>
                    <Text>Number of words: {wordList.length}</Text>
                    <Text>Points: {maxScore}</Text>
                    <Text>
                      Number of Pangrams:{' '}
                      {wordList.filter(({ isPangram }) => isPangram).length}
                    </Text>
                    <Text fontWeight="bold" mt={4}>
                      Tips
                    </Text>
                    <Box pl={2}>
                      <OrderedList>
                        <ListItem>There can be more than one pangram.</ListItem>
                        <ListItem>The shuffle button is your friend.</ListItem>
                        <ListItem>
                          Look for words that you can make every time certain
                          common letters appear. (BA can make you BABA and
                          BABABA. BABABA BA? BABABA.)
                        </ListItem>
                        <ListItem>
                          Find words where you can add prefixes and suffixes
                          (i-, -in, -an)
                        </ListItem>
                      </OrderedList>
                    </Box>
                  </AccordionPanel>
                </Stack>
              </AccordionItem>
            </Accordion>
            <Text>
              A new round of Saltong Hex will be released on Tuesdays and
              Fridays.
            </Text>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default HexRulesModal;
