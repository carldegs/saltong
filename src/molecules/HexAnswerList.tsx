/* eslint-disable jsx-a11y/no-autofocus */
import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Popover,
  PopoverTrigger,
  HStack,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  SimpleGrid,
  useBreakpointValue,
  useDisclosure,
  Text,
  useColorModeValue,
  Box,
  IconButton,
  Icon,
  Flex,
  MenuButton,
  Menu,
  MenuOptionGroup,
  MenuItemOption,
  MenuList,
} from '@chakra-ui/react';
import orderBy from 'lodash/orderBy';
import { SortAscending } from 'phosphor-react';
import { useMemo, useState } from 'react';

interface HexAnswerListProps {
  answers: {
    word: string;
    isPangram: boolean;
  }[];
  title?: string;
}

enum WordListSortBy {
  guessOrder = 'Guess Order',
  alphabetical = 'Alphabetical',
  numberOfLetters = 'Word length',
}

enum SortDirection {
  asc = 'Ascending',
  desc = 'Descending',
}

const HexAnswerList: React.FC<HexAnswerListProps> = ({ answers = [] }) => {
  const numWordsShown = useBreakpointValue([4, 8]);
  const answeredPopoverDisc = useDisclosure();
  const textColor = useColorModeValue('gray.400', 'gray.600');
  const borderColor = useColorModeValue('gray.600', 'gray.300');
  const [wordListSortBy, setWordListSortBy] = useState(
    WordListSortBy.guessOrder
  );
  const [sortDir, setSortDir] = useState(SortDirection.desc);
  const sortedAnswers = useMemo(() => {
    const ans = answers.map((obj) => ({ ...obj, length: obj.word.length }));
    const order = sortDir === SortDirection.asc ? 'asc' : 'desc';

    switch (wordListSortBy) {
      case WordListSortBy.guessOrder:
        return sortDir === SortDirection.asc
          ? answers
          : answers.slice().reverse();
      case WordListSortBy.numberOfLetters:
        return orderBy(ans, ['length', 'word'], [order, order]);
      case WordListSortBy.alphabetical:
        return orderBy(answers, ['word'], [order]);
    }
  }, [answers, wordListSortBy, sortDir]);

  return (
    <Popover
      autoFocus={false}
      isOpen={answeredPopoverDisc.isOpen}
      onClose={answeredPopoverDisc.onClose}
      closeOnBlur={false}
    >
      <PopoverTrigger>
        <HStack
          w="full"
          border="1px solid"
          borderColor={borderColor}
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
            {!answers.length && <Text color={textColor}>No answers yet.</Text>}
          </HStack>
          <ChevronDownIcon
            fontSize="xl"
            transform={answeredPopoverDisc.isOpen && 'rotate(180deg)'}
          />
        </HStack>
      </PopoverTrigger>
      <PopoverContent w={['sm', 'lg']}>
        <PopoverHeader>
          <Flex w="full" justifyContent="space-between" alignItems="center">
            <Box w="40px" />
            <Text fontWeight="bold">
              {answers.length} word{answers.length > 1 ? 's' : ''} found
            </Text>
            <Menu closeOnSelect={false}>
              <MenuButton
                as={IconButton}
                icon={<Icon as={SortAscending} weight="bold" />}
                aria-label="sort-words"
              />
              <MenuList>
                <MenuOptionGroup
                  title="Sort by"
                  value={wordListSortBy}
                  onChange={(str) => setWordListSortBy(str as WordListSortBy)}
                >
                  {Object.values(WordListSortBy).map((value) => (
                    <MenuItemOption value={value} key={value}>
                      {value}
                    </MenuItemOption>
                  ))}
                </MenuOptionGroup>
                <MenuOptionGroup
                  title="Order"
                  value={sortDir}
                  onChange={(str) => setSortDir(str as SortDirection)}
                >
                  {Object.values(SortDirection).map((value) => (
                    <MenuItemOption value={value} key={value}>
                      {value}
                    </MenuItemOption>
                  ))}
                </MenuOptionGroup>
              </MenuList>
            </Menu>
          </Flex>
        </PopoverHeader>
        <PopoverBody>
          {sortedAnswers?.length ? (
            <SimpleGrid columns={[3, 4]} spacing={2}>
              {sortedAnswers.map(({ word, isPangram }) => (
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
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default HexAnswerList;
