import dynamic from 'next/dynamic';

import { useDisclosures } from '../context/DisclosuresContext';

const AboutModal = dynamic(() => import('../molecules/AboutModal'));
const DebugCodeModal = dynamic(() => import('./DebugCodeModal'));
const NewDomainModal = dynamic(() => import('./NewDomainModal'));

const ModalWrapper: React.FC = ({ children }) => {
  const disc = useDisclosures();
  return (
    <>
      {disc.aboutModal.isOpen && (
        <AboutModal
          isOpen={disc.aboutModal.isOpen}
          onClose={disc.aboutModal.onClose}
        />
      )}
      {disc.debugModal.isOpen && (
        <DebugCodeModal
          isOpen={disc.debugModal.isOpen}
          onClose={disc.debugModal.onClose}
        />
      )}
      <NewDomainModal />
      {children}
    </>
  );
};

export default ModalWrapper;
