import { Flex } from '@chakra-ui/react';
import { ReactElement } from 'react';

import useLetterStatusColor from '../hooks/useLetterStatusColor';
import LetterStatus from '../types/LetterStatus';

export interface KeyboardKeyData {
  value: string;
  label: ReactElement | string;
  status?: LetterStatus;
}

export interface KeyboardKeyProps extends KeyboardKeyData {
  onClick: (value: string) => void;
}

const KeyboardKey: React.FC<KeyboardKeyProps> = ({
  value,
  label,
  status,
  onClick,
}) => {
  const { getStyle } = useLetterStatusColor();
  return (
    <Flex
      onClick={(e) => {
        e.preventDefault();
        onClick(value);
      }}
      borderRadius={6}
      w="full"
      maxW={value.length > 1 ? ['42px', '54px'] : ['32px', '43px']}
      minW={value.length > 1 ? ['42px', '54px'] : ['32px', '43px']}
      h="58px"
      alignItems="center"
      justifyContent="center"
      cursor="pointer"
      {...getStyle(status)}
    >
      {label}
    </Flex>
  );
};

export default KeyboardKey;
