import { ButtonProps } from '@chakra-ui/button';
import { Button } from '@chakra-ui/react';
import React from 'react';
import { useFormContext } from 'react-hook-form';

interface QSubmitButtonProps extends ButtonProps {
  onClick: (data: any) => void;
}

const QSubmitButton: React.FC<QSubmitButtonProps> = ({
  children,
  name,
  onClick,
  ...props
}) => {
  const { handleSubmit, formState } = useFormContext();
  const { isDirty } = formState;

  return (
    <Button onClick={handleSubmit(onClick)} isDisabled={!isDirty} {...props}>
      {children}
    </Button>
  );
};

export default QSubmitButton;
