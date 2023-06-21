import React, { useContext } from 'react';

export interface StringsInput<T extends {}> {
  [language: string]: T;
}

export type UseStrings<T> = () => T;

export const makeStrings = <T extends {}>(strings: StringsInput<T>): UseStrings<T> => {
  return () => {
    const locale = useLocale();

    const translate = (key: string) => {
      for (const preference of locale.preferences) {
        if ((strings[preference] as any)?.[key]) {
          return (strings[preference] as any)[key];
        }
      }
      throw new TypeError(`${key} is not translated. `);
    };
    return new Proxy(
      {},
      {
        get(_, prop) {
          if (typeof prop === 'string') {
            return translate(prop);
          } else {
            throw new TypeError('translating non-string is not supported. ');
          }
        },
      },
    ) as any;
  };
};

export const useLocale = () => {
  return useContext(LocaleContext);
};

export const LocaleContext = React.createContext({
  language: 'en',
  preferences: ['en'],
});

export type LocaleContextValue = typeof LocaleContext extends React.Context<infer T> ? T : never;

export const makeLocaleContextValue = (): LocaleContextValue => {
  return {
    language: navigator.language[0],
    preferences: ['en'], // [...navigator.languages, 'en'], // Always give English as the last resort
  };
};
