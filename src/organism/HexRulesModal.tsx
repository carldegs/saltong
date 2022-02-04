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
  Link,
  IconButton,
} from '@chakra-ui/react';
import { useState } from 'react';

import EmojiWrapper from '../atoms/EmojiWrapper';
import { HEX_RANK, TWITTER_LINK } from '../constants';
import { useHexGame } from '../context/HexGameContext';
import useTranslate from '../hooks/useTranslate';

type HexRulesModalProps = Omit<ModalProps, 'children'>;

const messages = {
  header: { en: 'How to Play', fil: 'Paano Laruin' },
  generalRule: {
    en: 'Make as many words as you can given seven letters.',
    fil: 'Gumawa ng mga salita gamit ang pitong letrang binigay',
  },
  rulesHeader: {
    en: 'Rules',
    fil: 'Mga Tuntunin',
  },
  rule1: {
    en: 'Words must be at least four letters long',
    fil: 'Ang mga salita ay binubuo dapat ng apat o higit pang mga letra',
  },
  rule2: {
    en: 'Words must contain the center letter',
    fil: 'Dapat kasama ang "center letter" sa bubuuing mga salita.',
  },
  rule3: {
    en: 'Letters can be used more than once',
    fil: 'Maaaring ulitin ang mga letra nang maraming beses.',
  },
  rule4: {
    en: 'The word list does not include hyphenated, obscure, or obscene words.',
    fil: 'Hindi kasama sa mga listahan ng tamang salita ang salitang may gitling, sinauna, o anumang may kinalaman sa kalaswaan.',
  },
  rule5: {
    en: 'The goal of the game is to earn enough points to get the rank of BATHALA. No need to guess all the words. Check the scoring section for the points system.',
    fil: 'Subukang makalikom ng sapat na puntos upang maabot ang ranggong BATHALA. Hindi kailangang hulaan ang lahat ng mga salita. Basahin ang bahagi ukol sa iskoring para sa pagkalkula ng mga puntos',
  },
  scoringHeader: { en: 'Scoring', fil: 'Iskoring' },
  scoring1: {
    en: '4-letter words are worth 1pt.',
    fil: 'Ang mga 4 na letrang salita ay 1pt.',
  },
  scoring2: {
    en: 'Longer words are worth 1pt per letter (e.g., MANONG = 6pts, DUWAG = 5pts).',
    fil: 'Isang puntos sa bawat letrang ginamit sa mas mahabang mga salita (Hal. MANONG = 6pts, DUWAG = 5pts).',
  },
  scoring3: {
    en: "When you've used all letters in a word (called a <b>pangram</b>) you will get 7 additional points.",
    fil: 'Kung nagamit mo ang lahat ng letra para bumuo ng salita (tinatawag na <b>pangram</b>) ikaw ay makakatanggap ng dagdag na 7 puntos.',
  },
  exampleHeader: {
    en: 'Example',
    fil: 'Halimbawa',
  },
  example1: {
    en: 'Given the letters <b>K T O R E S P</b>, with <b>O</b> being the center letter:',
    fil: 'Gamit ang mga letrang <b>K T O R E S P</b>, kung saan ang letrang <b>O</b> ang center letter:',
  },
  example2: {
    en: '<b>KESO</b> is worth 1 pt.',
    fil: '<b>KESO</b> ay nagkakahalaga ng 1 pt.',
  },
  example3: {
    en: '<b>TORPE</b> is 5 pts.',
    fil: '<b>TORPE</b> ay 5 pts.',
  },
  example4: {
    en: '<b>EKSPORT</b> is 14 pts. because it is 7 letters long and the word is a pangram.',
    fil: '<b>EKSPORT</b> ay 14 pts. dahil ito ay 7-letra ang haba at ang salita ay isang pangram.',
  },
  example5: {
    en: '<b>EKSPERTO</b> is 15 pts.',
    fil: '<b>EKSPERTO</b> ay 15 pts.',
  },
  rankingsHeader: {
    en: 'Rankings',
    fil: 'Mga Ranggo',
  },
  rank1: {
    en: 'The points needed to reach a rank will differ every Saltong Hex Round. The points needed for this round is:',
    fil: 'Iba-iba ang kinakailangang puntos upang maabot ang mga ranggo sa bawat laro ng Saltong Hex. Ang mga puntos na kinakailangan para sa larong ito ay:',
  },
  sched: {
    en: 'A new round of Saltong Hex will be released on Tuesdays and Fridays.',
    fil: 'May bagong Saltong Hex na ilalabas tuwing Martes at Biyernes.',
  },
};

const HexRulesModal: React.FC<HexRulesModalProps> = ({ isOpen, onClose }) => {
  const isDarkMode = useColorModeValue(false, true);
  const { maxScore, list: wordList } = useHexGame();

  const [locale, setLocale] = useState('fil');
  const { getMessage } = useTranslate(messages, locale, {});
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{getMessage('header')}</ModalHeader>
        <IconButton
          aria-label="language"
          icon={<EmojiWrapper value={locale === 'fil' ? '🇵🇭' : '🇺🇸'} />}
          onClick={() => {
            setLocale((curr) => (curr === 'fil' ? 'en' : 'fil'));
          }}
          pos="absolute"
          right="50px"
          top="20px"
        />
        <ModalCloseButton />
        <ModalBody mb={4}>
          <Stack spacing={6}>
            <Text>{getMessage('generalRule')}</Text>
            <Accordion defaultIndex={[0]}>
              <AccordionItem>
                <Stack spacing={2}>
                  <h2>
                    <AccordionButton>
                      <Box flex="1" textAlign="left">
                        {getMessage('rulesHeader')}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pl={4} pb={4}>
                    <UnorderedList spacing={1}>
                      <ListItem>{getMessage('rule1')}</ListItem>
                      <ListItem>{getMessage('rule2')}</ListItem>
                      <ListItem>{getMessage('rule3')}</ListItem>
                      <ListItem>{getMessage('rule4')}</ListItem>
                      <ListItem>{getMessage('rule5')}</ListItem>
                    </UnorderedList>
                  </AccordionPanel>
                </Stack>
              </AccordionItem>
              <AccordionItem>
                <Stack spacing={2}>
                  <h2>
                    <AccordionButton>
                      <Box flex="1" textAlign="left">
                        {getMessage('scoringHeader')}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pl={4} pb={4}>
                    <UnorderedList spacing={2}>
                      <ListItem>{getMessage('scoring1')}</ListItem>
                      <ListItem>{getMessage('scoring2')}</ListItem>
                      <ListItem
                        dangerouslySetInnerHTML={{
                          __html: getMessage('example1'),
                        }}
                      />
                    </UnorderedList>
                    <Box
                      bg={isDarkMode ? 'gray.600' : 'gray.200'}
                      px={3}
                      py={2}
                      borderRadius={4}
                      mt={4}
                    >
                      <Text fontWeight="bold">
                        {getMessage('exampleHeader')}
                      </Text>
                      <Text
                        mb={2}
                        dangerouslySetInnerHTML={{
                          __html: getMessage('example1'),
                        }}
                      ></Text>
                      <Box pl={2}>
                        <UnorderedList>
                          <ListItem
                            dangerouslySetInnerHTML={{
                              __html: getMessage('example2'),
                            }}
                          />
                          <ListItem
                            dangerouslySetInnerHTML={{
                              __html: getMessage('example3'),
                            }}
                          />
                          <ListItem
                            dangerouslySetInnerHTML={{
                              __html: getMessage('example4'),
                            }}
                          />
                          <ListItem
                            dangerouslySetInnerHTML={{
                              __html: getMessage('example5'),
                            }}
                          />
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
                        {getMessage('rankingsHeader')}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pl={4} pb={4}>
                    {getMessage('rank1')}

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
              <AccordionItem>
                <Stack spacing={2}>
                  <h2>
                    <AccordionButton>
                      <Box flex="1" textAlign="left">
                        Issues?
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pl={4} pb={4}>
                    <Text>
                      Missing some words?{' '}
                      <Link
                        isExternal
                        href={TWITTER_LINK}
                        fontWeight="bold"
                        color="blue.500"
                      >
                        Send a DM
                      </Link>{' '}
                      or send an e-mail at{' '}
                      <Link
                        isExternal
                        href="mailto:carl@carldegs.com"
                        fontWeight="bold"
                        color="blue.500"
                      >
                        carl@carldegs.com
                      </Link>{' '}
                    </Text>
                  </AccordionPanel>
                </Stack>
              </AccordionItem>
            </Accordion>
            <Text>{getMessage('sched')}</Text>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default HexRulesModal;
