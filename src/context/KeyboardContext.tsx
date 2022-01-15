import { createContext, MutableRefObject, useContext, useRef } from 'react';

import ContextNoProviderError from '../lib/errors/ContextNoProviderError';

const KeyboardContext =
  createContext<MutableRefObject<HTMLInputElement>>(undefined);

export const useKeyboard = () => {
  const keyboardRef = useContext(KeyboardContext);

  if (!keyboardRef) {
    throw new ContextNoProviderError('useKeyboard', 'KeyboardProvider');
  }

  return keyboardRef;
};

export const KeyboardProvider: React.FC = ({ children }) => {
  const ref = useRef<HTMLInputElement>();

  return (
    <KeyboardContext.Provider value={ref}>{children}</KeyboardContext.Provider>
  );
};

export default KeyboardContext;
