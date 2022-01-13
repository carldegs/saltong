import { FormLabel } from '@chakra-ui/form-control';
import { FormErrorMessage } from '@chakra-ui/form-control';
import { FormControl, FormControlProps } from '@chakra-ui/form-control';
import React, { ReactElement } from 'react';
import { useFormContext, UseFormRegisterReturn } from 'react-hook-form';

export interface QFormControlProps extends FormControlProps {
  name: string;
  render?: (props: UseFormRegisterReturn) => ReactElement;
  hideErrorMessage?: boolean;
}

const QFormControl: React.FC<QFormControlProps> = ({
  render,
  children,
  label,
  name,
  hideErrorMessage,
  ...props
}) => {
  const { register, formState } = useFormContext();
  const { errors } = formState;

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, register(name));
    }
    return child;
  });

  return (
    <FormControl
      isInvalid={props.isInvalid || !!errors[name]?.message}
      {...props}
    >
      {label && <FormLabel>{label}</FormLabel>}
      {render ? render(register(name)) : childrenWithProps}
      {errors[name]?.message && !hideErrorMessage ? (
        <FormErrorMessage>{errors[name]?.message}</FormErrorMessage>
      ) : null}
    </FormControl>
  );
};

export default QFormControl;
