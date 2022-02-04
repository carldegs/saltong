import { Flex } from '@chakra-ui/layout';
import { useStyleConfig } from '@chakra-ui/react';
import { Spinner } from '@chakra-ui/spinner';
import { ReactElement, useState } from 'react';

import { useHighContrast } from '../context/HighContrastContext';
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
  const { isHighContrast } = useHighContrast();

  const styles = useStyleConfig('KeyboardKey', {
    variant: isDisabled
      ? 'disabled'
      : `${LetterStatus[status]}${isHighContrast ? 'High' : ''}`,
  } as any);

  return (
    <Flex
      __css={styles}
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
      w="full"
      maxW={
        value.length > 1 ? ['46px', '46px', '54px'] : ['36px', '36px', '43px']
      }
      minW={
        value.length > 1 ? ['42px', '42px', '54px'] : ['32px', '32px', '43px']
      }
      h="58px"
      cursor={isDisabled ? 'wait' : 'pointer'}
      onContextMenu={(e) => e.preventDefault()}
    >
      {isDisabled ? <Spinner /> : label}
    </Flex>
  );
};

export default KeyboardKey;
