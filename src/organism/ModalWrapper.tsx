import dynamic from 'next/dynamic';

import { useDisclosures } from '../context/DisclosuresContext';

const AboutModal = dynamic(() => import('../molecules/AboutModal'));
const DebugCodeModal = dynamic(() => import('./DebugCodeModal'));
const NewDomainModal = dynamic(() => import('./NewDomainModal'));

const ModalWrapper: React.FC = ({ children }) => {
  const disc = useDisclosures();
  return (
    <>
      <AboutModal
        isOpen={disc.aboutModal.isOpen}
        onClose={disc.aboutModal.onClose}
      />
      <DebugCodeModal
        isOpen={disc.debugModal.isOpen}
        onClose={disc.debugModal.onClose}
      />
      <NewDomainModal />
      {children}
    </>
  );
};

export default ModalWrapper;
