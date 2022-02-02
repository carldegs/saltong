import { Flex, Heading, Text } from '@chakra-ui/layout';
import {
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverProps,
  PopoverTrigger,
} from '@chakra-ui/popover';
import { formatDuration } from 'date-fns';
import { useState } from 'react';

import { getCountdownToNextDay } from '../utils';

interface GameStatusPanelProps extends Omit<PopoverProps, 'children'> {
  gameId: number | string;
}

const GameStatusPanel: React.FC<GameStatusPanelProps> = ({
  gameId,
  ...popoverProps
}) => {
  const [timer, setTimer] = useState(undefined);
  const [countdown, setCountdown] = useState('');

  return (
    <Popover
      trigger="hover"
      isLazy
      onOpen={() => {
        const newTimer = setInterval(() => {
          setCountdown(formatDuration(getCountdownToNextDay()));
        }, 1000);
        setTimer(newTimer);
      }}
      onClose={() => {
        clearInterval(timer);
        setTimer(undefined);
      }}
      {...popoverProps}
    >
      <PopoverTrigger>
        <Text
          cursor="default"
          _hover={{
            textDecoration: 'underline',
          }}
          fontSize={['md', 'lg']}
        >
          Game #{gameId}
        </Text>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <Flex alignItems="center" flexDir="column" p={5}>
          <Text textAlign="center">Game ends in</Text>
          <Heading size="md" textAlign="center">
            {countdown}
          </Heading>
        </Flex>
      </PopoverContent>
    </Popover>
  );
};

export default GameStatusPanel;
