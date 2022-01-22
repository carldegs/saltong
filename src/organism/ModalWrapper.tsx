import { useDisclosures } from '../context/DisclosuresContext';
import AboutModal from '../molecules/AboutModal';
import DebugCodeModal from './DebugCodeModal';

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
      {children}
    </>
  );
};

export default ModalWrapper;
