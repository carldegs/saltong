import { joiResolver } from '@hookform/resolvers/joi/dist/joi';
import Joi, { AnySchema } from 'joi';
import { DeepPartial, UnpackNestedValue, UseFormProps } from 'react-hook-form';

type FormSchema<T> = Partial<Record<keyof T, AnySchema>>;

export class FormObject<FormData> {
  private defaultResolverOptions: Partial<Joi.AsyncValidationOptions> = {
    abortEarly: false,
    allowUnknown: true,
  };

  private defaultFormOptions: UseFormProps<FormData> = {
    criteriaMode: 'all',
  };

  constructor(
    readonly defaultValues: FormData,
    readonly schema?: FormSchema<FormData>,
    readonly options?: {
      form: UseFormProps<FormData>;
      resolver: Joi.AsyncValidationOptions;
    }
  ) {}

  getHookOptions(): UseFormProps<FormData> {
    return {
      ...this.defaultFormOptions,
      defaultValues: this.defaultValues as UnpackNestedValue<
        DeepPartial<FormData>
      >,
      resolver: joiResolver(Joi.object(this.schema), {
        ...this.defaultResolverOptions,
        ...this.options?.resolver,
      }),
    };
  }
}
