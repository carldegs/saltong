import { Flex } from '@chakra-ui/layout';
import { Spinner } from '@chakra-ui/spinner';
import { ReactElement, useState } from 'react';

import useLetterStatusColor from '../hooks/useLetterStatusColor';
import LetterStatus from '../types/LetterStatus';

export interface KeyboardKeyData {
  value: string;
  label: ReactElement | string;
  status?: LetterStatus;
  disableDelay?: number;
}

export interface KeyboardKeyProps extends KeyboardKeyData {
  onClick: (value: string) => void;
}

const KeyboardKey: React.FC<KeyboardKeyProps> = ({
  value,
  label,
  status,
  onClick,
  disableDelay,
}) => {
  const [isDisabled, setDisabled] = useState(false);
  const { getStyle } = useLetterStatusColor();

  return (
    <Flex
      onClick={(e) => {
        if (isDisabled) {
          return;
        }

        e.preventDefault();
        onClick(value);
        if (disableDelay) {
          setDisabled(true);
          setTimeout(() => {
            setDisabled(false);
          }, disableDelay);
        }
      }}
      borderRadius={6}
      w="full"
      maxW={value.length > 1 ? ['42px', '54px'] : ['32px', '43px']}
      minW={value.length > 1 ? ['42px', '54px'] : ['32px', '43px']}
      h="58px"
      alignItems="center"
      justifyContent="center"
      cursor={isDisabled ? 'wait' : 'pointer'}
      onContextMenu={(e) => e.preventDefault()}
      {...getStyle(status, { isDisabled })}
    >
      {isDisabled ? <Spinner /> : label}
    </Flex>
  );
};

export default KeyboardKey;
