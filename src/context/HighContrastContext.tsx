import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { HIGH_CONTRAST_DATA } from '../constants';
import ContextNoProviderError from '../lib/errors/ContextNoProviderError';
import { getPersistState, setPersistState } from '../utils/local';

const getPState = () =>
  getPersistState<{ isHighContrast: boolean }>(HIGH_CONTRAST_DATA);
const setPState = (isHighContrast: boolean) =>
  setPersistState<{ isHighContrast: boolean }>(HIGH_CONTRAST_DATA, {
    isHighContrast,
  });

interface useHighContrastProps {
  isHighContrast: boolean;
  setHighContrast: Dispatch<SetStateAction<boolean>>;
  toggleHighContrast: () => void;
}

const DEFAULT_DATA: useHighContrastProps = {
  isHighContrast: false,
  setHighContrast: () => undefined,
  toggleHighContrast: () => undefined,
};

const HighContrastContext = createContext<useHighContrastProps>(DEFAULT_DATA);

export const useHighContrast = () => {
  const state = useContext(HighContrastContext);

  if (!state) {
    throw new ContextNoProviderError('useHighContrast', 'HighContrastProvider');
  }

  return state;
};

export const HighContrastProvider: React.FC = ({ children }) => {
  const [isHighContrast, setHighContrast] = useState(undefined);

  const toggleHighContrast = useCallback(() => {
    setHighContrast((curr) => !curr);
  }, []);

  useEffect(() => {
    if (isHighContrast === undefined) {
      setHighContrast(getPState()?.isHighContrast);
    } else {
      setPState(isHighContrast);
    }
  }, [isHighContrast]);

  const value: useHighContrastProps = {
    isHighContrast,
    setHighContrast,
    toggleHighContrast,
  };

  return (
    <HighContrastContext.Provider value={value}>
      {children}
    </HighContrastContext.Provider>
  );
};
