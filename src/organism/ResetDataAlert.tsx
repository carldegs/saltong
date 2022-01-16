import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogProps,
  Button,
} from '@chakra-ui/react';
import { useRef } from 'react';

interface ResetDataAlertProps
  extends Omit<AlertDialogProps, 'children' | 'leastDestructiveRef'> {
  resetLocalStorage: () => void;
}

const ResetDataAlert: React.FC<ResetDataAlertProps> = ({
  resetLocalStorage,
  isOpen,
  onClose,
}) => {
  const cancelRef = useRef();

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Reset Data
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure? Resetting will remove all your progress. You
            can&apos;t undo this action afterwards.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={async () => {
                resetLocalStorage();
                onClose();
              }}
              ml={3}
            >
              Reset Data
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default ResetDataAlert;
