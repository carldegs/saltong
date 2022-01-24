import { useDisclosure, UseDisclosureReturn } from '@chakra-ui/react';
import { createContext, useContext } from 'react';

import ContextNoProviderError from '../lib/errors/ContextNoProviderError';

interface DisclosuresContextParams {
  endGameModal: UseDisclosureReturn;
  hexShareModal: UseDisclosureReturn;
  bugReportModal: UseDisclosureReturn;
  aboutModal: UseDisclosureReturn;
  rulesModal: UseDisclosureReturn;
  hexRulesModal: UseDisclosureReturn;
  debugModal: UseDisclosureReturn;
  privacyPolicyModal: UseDisclosureReturn;
  resetDataDialog: UseDisclosureReturn;
  hexPrevAnsModal: UseDisclosureReturn;
}

const DisclosuresContext = createContext<Partial<DisclosuresContextParams>>({});

export const useDisclosures = () => {
  const disclosures = useContext(DisclosuresContext);

  if (!disclosures) {
    throw new ContextNoProviderError('useDisclosures', 'DisclosuresProvider');
  }

  return disclosures;
};

export const DisclosuresProvider: React.FC = ({ children }) => {
  const endGameModal = useDisclosure();
  const bugReportModal = useDisclosure();
  const aboutModal = useDisclosure();
  const rulesModal = useDisclosure();
  const hexRulesModal = useDisclosure();
  const debugModal = useDisclosure();
  const privacyPolicyModal = useDisclosure();
  const resetDataDialog = useDisclosure();
  const hexShareModal = useDisclosure();
  const hexPrevAnsModal = useDisclosure();

  const value = {
    endGameModal,
    bugReportModal,
    aboutModal,
    rulesModal,
    hexRulesModal,
    debugModal,
    privacyPolicyModal,
    resetDataDialog,
    hexShareModal,
    hexPrevAnsModal,
  };

  return (
    <DisclosuresContext.Provider value={value}>
      {children}
    </DisclosuresContext.Provider>
  );
};
