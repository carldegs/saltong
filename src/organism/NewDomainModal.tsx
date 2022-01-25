import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Button,
  Code,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import useImport from '../hooks/useImport';

const REDIRECT_TIME = 30;

const NewDomainModal = () => {
  const [timeLeft, setTimeLeft] = useState(REDIRECT_TIME);
  const { isPrevDomain, onRedirect } = useImport();

  const onClose = () => {
    // eslint-disable-next-line no-console
    console.log('Using the old domain. Redirecting to new...');
  };

  useEffect(() => {
    let interval;
    let timer;

    if (isPrevDomain) {
      interval = setInterval(() => {
        setTimeLeft((curr) => curr - 1);
      }, 1000);

      timer = setTimeout(() => {
        clearInterval(interval);
        onRedirect();
      }, 1000 * REDIRECT_TIME);
    }

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onRedirect, isPrevDomain]);

  return (
    <Modal
      isOpen={isPrevDomain}
      onClose={onClose}
      closeOnOverlayClick={false}
      closeOnEsc={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalBody my={4}>
          <Stack spacing={4} align="center" textAlign="center">
            <Text fontSize="xl">Hi there! Saltong will now move to</Text>
            <Code fontSize="xl" width="min-content">
              saltong.carldegs.com
            </Code>
            <Text fontSize="xl">
              Don&apos;t worry! Your game data will be transferred to the new
              website.
            </Text>
            <Text pt={4}>
              You will be automatically redirected in {timeLeft} seconds or
              click the button below.
            </Text>
            <Button size="lg" onClick={onRedirect}>
              GO TO SITE
            </Button>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default NewDomainModal;
