import { useForm, UseFormReturn } from 'react-hook-form';

import { FormObject } from '../formHandlers/FormObject';

const useJoiForm = <T>(formObject: FormObject<T>): UseFormReturn<T> => {
  return useForm<T>(formObject.getHookOptions());
};

export default useJoiForm;
