import { useCallback } from 'react';

const useTranslate = <T = Record<string, Record<string, string>>>(
  messages: T,
  lang: string,
  values?: Record<string, any>
) => {
  const getMessage = useCallback(
    (key: keyof typeof messages, wordValues?: Record<string, any>) => {
      let message = messages[key][lang];

      const valueKeys = (message.match(/\{(.*?)\}/g) || []).map((s) =>
        s.replace('{', '').replace('}', '')
      );

      valueKeys.map((valueKey) => {
        if ((wordValues || values)[valueKey]) {
          message = message.replace(
            `{${valueKey}}`,
            (wordValues || values)[valueKey]
          );
        }
      });

      return message;
    },
    [messages, lang, values]
  );

  return {
    getMessage,
  };
};

export default useTranslate;
