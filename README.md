# nextjs-typescript-boilerplate

A custom template based on NextJS in Typescript.

It includes the following libraries/frameworks:

- [Chakra UI](https://chakra-ui.com/) (UI Framework)
- [React Hook Form](https://react-hook-form.com/) (Form Validation)
- [Joi](https://joi.dev/api/) (Validation Schema)
- [React Query](https://react-query.tanstack.com/) (Data Handling)

The following are also setup:

- Added `useJoiForm` that assists in using `useForm` with a `joiResolver`. This uses a custom class `FormObject` that would also assist you in creating the default values and schemas of your form.
- Addded `<QFormControl />` which can help create `FormControl`s already integrated with `react-hook-form`. To use this:
  - you must wrap them in a `<FormProvider />`. More info [here](https://react-hook-form.com/api/useformcontext).
  - For nested or complex inputs (e.g, using `<InputGroup />`), use the control prop to set what component should be registered.
- Chakra UI theme extended with a custom scrollbar and a full-height html page.
- Custom Layout component that handles different layout options with a navbar and footer
  - To include footers in the layout, uncomment them in `/components/Layout.tsx`
- ESLint setup using recommended rules
- Custom prettier rules that includes automatic sorting of imports
- Added `next-connect` and `createApiHandler` for handling api calls
