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
import { useCallback, useState } from 'react';

import EmojiWrapper from '../atoms/EmojiWrapper';
import { HEX_RANK, TWITTER_LINK } from '../constants';
import { useHexGame } from '../context/HexGameContext';

type HexRulesModalProps = Omit<ModalProps, 'children'>;

const HexRulesModal: React.FC<HexRulesModalProps> = ({ isOpen, onClose }) => {
  const isDarkMode = useColorModeValue(false, true);
  const { maxScore, list: wordList } = useHexGame();

  const [locale, setLocale] = useState('fil');
  // TODO: Create site-wide translation system. Use libraries instead.
  const tr = useCallback(
    (obj: { en: string; fil: string }) => obj[locale],
    [locale]
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {tr({ en: 'How to Play', fil: 'Paano Laruin' })}
        </ModalHeader>
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
            <Text>
              {tr({
                en: 'Make as many words as you can given seven letters.',
                fil: 'Gumawa ng mga salita gamit ang pitong letrang binigay',
              })}
            </Text>
            <Accordion defaultIndex={[0]}>
              <AccordionItem>
                <Stack spacing={2}>
                  <h2>
                    <AccordionButton>
                      <Box flex="1" textAlign="left">
                        {tr({
                          en: 'Rules',
                          fil: 'Mga Tuntunin',
                        })}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pl={4} pb={4}>
                    <UnorderedList spacing={1}>
                      <ListItem>
                        {tr({
                          en: 'Words must be at least four letters long',
                          fil: 'Ang mga salita ay dapat apat na letra ang haba, pataas',
                        })}
                      </ListItem>
                      <ListItem>
                        {tr({
                          en: 'Words must contain the center letter',
                          fil: 'Kasama dapat ang "center letter" sa mga salita',
                        })}
                      </ListItem>
                      <ListItem>
                        {tr({
                          en: 'Letters can be used more than once',
                          fil: 'Maaring gamit ang mga letra ng maraming beses',
                        })}
                      </ListItem>
                      <ListItem>
                        {tr({
                          en: 'The word list does not include hyphenated, obscure, or obscene words.',
                          fil: 'Ang listahan ng mga salita ay hindi naglalaman ng salitang may gitling, sinauna o malaswa.',
                        })}
                      </ListItem>
                      <ListItem>
                        {tr({
                          en: 'The goal of the game is to earn enough points to get the rank of BATHALA. No need to guess all the words. Check the scoring section for the points system.',
                          fil: 'Subukang makalikom ng sapat na puntos upang maabot ang ranggong BATHALA. Hindi kailangang hulaan ang lahat ng mga salita. Basahin ang bahagi ukol sa iskoring para sa pagkalkula ng mga puntos',
                        })}
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
                        {tr({ en: 'Scoring', fil: 'Iskoring' })}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pl={4} pb={4}>
                    <UnorderedList spacing={2}>
                      <ListItem>
                        {tr({
                          en: '4-letter words are worth 1pt.',
                          fil: 'Ang mga 4 na letrang salita ay 1pt.',
                        })}
                      </ListItem>
                      <ListItem>
                        {tr({
                          en: 'Longer words are worth 1pt per letter (e.g., MANONG = 6pts, DUWAG = 5pts).',
                          fil: 'Isang puntos sa bawat letrang ginamit sa mas mahabang mga salita (Hal. MANONG = 6pts, DUWAG = 5pts).',
                        })}
                      </ListItem>
                      <ListItem>
                        {tr({
                          en: "When you've used all letters in a word (called a",
                          fil: 'Kung nagamit mo ang lahat ng letra para bumuo ng salita (tinatawag na',
                        })}{' '}
                        <b>pangram</b>
                        {tr({
                          en: ') you will get 7 additional points.',
                          fil: ') ikaw ay makakatanggap ng dagdag na 7 puntos.',
                        })}
                      </ListItem>
                    </UnorderedList>
                    <Box
                      bg={isDarkMode ? 'gray.600' : 'gray.200'}
                      px={3}
                      py={2}
                      borderRadius={4}
                      mt={2}
                    >
                      <Text fontWeight="bold">
                        {tr({
                          en: 'Example',
                          fil: 'Halimbawa',
                        })}
                      </Text>
                      <Text mb={2}>
                        {tr({
                          en: 'Given the letters',
                          fil: 'Gamit ang mga letrang',
                        })}{' '}
                        <b>K T O R E S P</b>,{' '}
                        {tr({
                          en: 'with',
                          fil: 'kung saan ang letrang',
                        })}{' '}
                        <b>O</b>{' '}
                        {tr({
                          en: 'being the center letter',
                          fil: 'ang center letter',
                        })}
                        :
                      </Text>
                      <Box pl={2}>
                        <UnorderedList>
                          <ListItem>
                            <b>KESO</b>{' '}
                            {tr({
                              en: 'is worth',
                              fil: 'ay nagkakahalaga ng',
                            })}{' '}
                            1 pt.
                          </ListItem>
                          <ListItem>
                            <b>TORPE</b>{' '}
                            {tr({
                              en: 'is',
                              fil: 'ay',
                            })}{' '}
                            5 pts.
                          </ListItem>
                          <ListItem>
                            <b>EKSPORT</b>{' '}
                            {tr({
                              en: 'is',
                              fil: 'ay',
                            })}{' '}
                            14 pts.{' '}
                            {tr({
                              en: 'because it is 7 letters long and the word is a pangram.',
                              fil: 'dahil ito ay 7-letra ang haba at ang salita ay isang pangram.',
                            })}
                          </ListItem>
                          <ListItem>
                            <b>EKSPERTO</b>{' '}
                            {tr({
                              en: 'is',
                              fil: 'ay',
                            })}{' '}
                            15 pts.
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
                        {tr({
                          en: 'Rankings',
                          fil: 'Mga Ranggo',
                        })}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pl={4} pb={4}>
                    {tr({
                      en: 'The points needed to reach a rank will differ every Saltong Hex Round. The points needed for this round is:',
                      fil: 'Iba-iba ang kinakailangang puntos upang maabot ang mga ranggo sa bawat laro ng Saltong Hex. Ang mga puntos na kinakailangan para sa larong ito ay:',
                    })}

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
            <Text>
              {tr({
                en: 'A new round of Saltong Hex will be released on Tuesdays and Fridays.',
                fil: 'May bagong Saltong Hex na ilalabas tuwing Martes at Biyernes.',
              })}
            </Text>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default HexRulesModal;
