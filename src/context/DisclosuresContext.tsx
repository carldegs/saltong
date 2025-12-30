import { useDisclosure, UseDisclosureReturn } from '@chakra-ui/hooks';
import { useRouter } from 'next/router';
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
  menuModal: UseDisclosureReturn;
  contributeModal: UseDisclosureReturn;
  transferDataModal: UseDisclosureReturn;
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
  const menuModal = useDisclosure();
  const router = useRouter();

  const transferDataModal = useDisclosure({
    onOpen: () => {
      router.replace(
        {
          pathname: router.asPath,
          query: { transfer: 1 },
        },
        undefined,
        { shallow: true }
      );
    },
    onClose: () => {
      router.replace(router.asPath.replace('?transfer=1', ''), undefined, {
        shallow: true,
      });
    },
    isOpen: !!router.query?.transfer,
  });

  const contributeModal = useDisclosure({
    onOpen: () => {
      router.replace(
        {
          pathname: router.asPath,
          query: { contribute: 1 },
        },
        undefined,
        { shallow: true }
      );
    },
    onClose: () => {
      router.replace(router.asPath.replace('?contribute=1', ''), undefined, {
        shallow: true,
      });
    },
    isOpen: !!router.query?.contribute,
  });

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
    menuModal,
    contributeModal,
    transferDataModal,
  };

  return (
    <DisclosuresContext.Provider value={value}>
      {children}
    </DisclosuresContext.Provider>
  );
};
