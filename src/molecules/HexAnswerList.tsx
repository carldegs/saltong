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
} from '@chakra-ui/react';

interface HexAnswerListProps {
  answers: {
    word: string;
    isPangram: boolean;
  }[];
}

const HexAnswerList: React.FC<HexAnswerListProps> = ({ answers = [] }) => {
  const numWordsShown = useBreakpointValue([5, 8]);
  const answeredPopoverDisc = useDisclosure();
  const textColor = useColorModeValue('gray.400', 'gray.600');
  const borderColor = useColorModeValue('gray.600', 'gray.300');

  return (
    <Popover
      autoFocus={false}
      isOpen={answeredPopoverDisc.isOpen}
      onClose={answeredPopoverDisc.onClose}
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
      <PopoverContent w={['xs', 'sm', 'lg']}>
        <PopoverHeader textAlign="center">
          {answers.length} words found
        </PopoverHeader>
        <PopoverBody>
          {answers.length ? (
            <SimpleGrid columns={[3, 6]} spacing={2}>
              {answers.map(({ word, isPangram }) => (
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
