import { Heading, Flex, FlexProps } from '@chakra-ui/layout';
import { useStyleConfig } from '@chakra-ui/react';

import { useHighContrast } from '../context/HighContrastContext';
import LetterStatus from '../types/LetterStatus';

interface LetterBoxProps extends Omit<FlexProps, 'onChange'> {
  status?: LetterStatus;
  editable?: boolean;
  onChange?: (e: string) => void;
  value?: string;
  submitOnEnter?: boolean;
}

const LetterBox: React.FC<LetterBoxProps> = ({
  status,
  editable,
  children,
  value,
  onChange,
  onFocus,
  onBlur,
  submitOnEnter,
  fontSize,
  ...boxProps
}) => {
  const { isHighContrast } = useHighContrast();
  const styles = useStyleConfig('LetterBox', {
    variant: `${LetterStatus[status]}${isHighContrast ? 'High' : ''}`,
  } as any);

  return (
    <Flex __css={styles} w={[10, 12]} h={[10, 12]} pos="relative" {...boxProps}>
      <Heading
        textAlign="center"
        fontSize={fontSize || ['2xl', '3xl']}
        onContextMenu={(e) => e.preventDefault()}
      >
        {value?.toUpperCase() || children}
      </Heading>
    </Flex>
  );
};

export default LetterBox;
