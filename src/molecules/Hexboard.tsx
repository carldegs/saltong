import { Box, Button, Flex, Stack, StackProps } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';

import HexboardKey, { HexboardKeyData } from '../atoms/HexboardKey';
import { HEX_HEIGHT, HEX_OUTER_WIDTH } from '../constants';
import { useKeyboard } from '../context/KeyboardContext';

interface HexboardProps extends StackProps {
  onEnter: (string) => void;
  letters: string[];
  centerLetter: string;
}

const getWidth = (inc: number) =>
  HEX_OUTER_WIDTH.map((w) => `${Number(w.replace('px', '')) * inc}px`);
const getHeight = (inc: number) =>
  HEX_HEIGHT.map((h) => `${Number(h.replace('px', '')) * inc}px`);

const getLeft = (pos: number) =>
  pos === 0
    ? [0, 0]
    : HEX_OUTER_WIDTH.map((w) => `calc(${pos * 100}% - (${w} / 2))`);
const getTop = (pos: number) =>
  pos === 0
    ? [0, 0]
    : HEX_HEIGHT.map((h) => `calc(${pos * 100}% - (${h} / 2))`);

const EDGE_LETTERS_TOP = [0.13, 0.31, 0.68, 0.86, 0.68, 0.31].map((pos) =>
  getTop(pos)
);

const EDGE_LETTERS_LEFT = [0.5, 0.77, 0.77, 0.5, 0.23, 0.23].map((pos) =>
  getLeft(pos)
);

const Hexboard: React.FC<HexboardProps> = ({
  onEnter,
  letters,
  centerLetter,
  ...stackProps
}) => {
  const eventRef = useKeyboard();
  const [edgeKeysInfo, setEdgeKeysInfo] = useState<HexboardKeyData[]>(
    letters
      .map(
        (char) =>
          ({
            value: char,
            label: char.toUpperCase(),
          } as HexboardKeyData)
      )
      .sort(() => Math.random() - 0.5)
  );
  const centerKeyInfo = useMemo(
    () =>
      ({
        value: centerLetter,
        label: centerLetter.toUpperCase(),
        isCenterLetter: true,
      } as HexboardKeyData),
    [centerLetter]
  );

  useEffect(() => {
    eventRef?.current.focus();
  }, [eventRef]);

  return (
    <Stack {...stackProps}>
      <Box pos="relative" w={getWidth(3)} h={getHeight(3)} my={8}>
        <HexboardKey
          onClick={(value) => {
            if (!eventRef.current) {
              return;
            }
            eventRef.current.value = `${eventRef.current.value?.toUpperCase()}${value?.toUpperCase()}`;
            eventRef.current.blur();
            eventRef.current.focus();
          }}
          pos="absolute"
          left={getLeft(0.5)}
          top={getTop(0.5)}
          {...centerKeyInfo}
        />
        {edgeKeysInfo.map((data, i) => (
          <HexboardKey
            onClick={(value) => {
              if (!eventRef.current) {
                return;
              }
              eventRef.current.value = `${eventRef.current.value?.toUpperCase()}${value?.toUpperCase()}`;
              eventRef.current.blur();
              eventRef.current.focus();
            }}
            pos="absolute"
            left={EDGE_LETTERS_LEFT[i]}
            top={EDGE_LETTERS_TOP[i]}
            key={data.value}
            {...data}
          />
        ))}
      </Box>
      <Flex alignItems="center" justifyContent="space-evenly">
        <Button
          onClick={() => {
            eventRef.current.value = eventRef.current.value.substring(
              0,
              eventRef.current.value.length - 1
            );

            eventRef.current.blur();
            eventRef.current.focus();
          }}
        >
          DELETE
        </Button>
        <Button
          onClick={(e) => {
            e.preventDefault();
            setEdgeKeysInfo((curr) => [
              ...curr.sort(() => Math.random() - 0.5),
            ]);
          }}
        >
          SHUFFLE
        </Button>
        <Button
          onClick={(e) => {
            e.preventDefault();
            onEnter(eventRef.current.value);

            eventRef.current.blur();
            eventRef.current.focus();
          }}
        >
          ENTER
        </Button>
      </Flex>
    </Stack>
  );
};

export default Hexboard;
