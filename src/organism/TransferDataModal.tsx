import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Img,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  ModalProps,
  SimpleGrid,
  Stack,
  Text,
  useColorMode,
  useToast,
} from '@chakra-ui/react';
import { FC, useCallback, useMemo, useState } from 'react';

import { LOCAL_GAME_DATA } from '../constants';
import UserData from '../types/UserData';
import { getPersistState } from '../utils/local';

const SECRET_KEY = 'mama-mo-saltong';

const xorCipher = (text: string, key: string): string => {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(
      text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    );
  }
  return result;
};

const TransferDataModal: FC<Omit<ModalProps, 'children'>> = ({
  onClose,
  isOpen,
}) => {
  const { colorMode } = useColorMode();
  const toast = useToast();
  const [hubEmail, setHubEmail] = useState('');
  const isValidHubEmail = useMemo(() => {
    if (!hubEmail) {
      return false;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(hubEmail.trim());
  }, [hubEmail]);

  const saltongData =
    getPersistState<UserData>(LOCAL_GAME_DATA) ?? ({} as UserData);

  const baseData = [
    saltongData.main ?? ({} as UserData['main']),
    saltongData.max ?? ({} as UserData['max']),
    saltongData.mini ?? ({} as UserData['mini']),
  ]
    .map((game) =>
      [
        game?.numPlayed,
        game?.numWins,
        game?.winStreak,
        game?.longestWinStreak,
        game.lastWinDate ? new Date(game.lastWinDate).getTime() : null,
        game?.turnStats?.join(',') || '',
      ].join('|')
    )
    .join(';');

  const encryptedData = xorCipher(baseData, SECRET_KEY);
  const data = Buffer.from(encryptedData, 'binary').toString('base64');

  const emailContent = useMemo(
    () =>
      [
        'Saltong Hub Account Email:',
        hubEmail || '[add your Saltong Hub email above]',
        '',
        'Encrypted Save Data:',
        data,
      ].join('\n'),
    [hubEmail, data]
  );

  const mailtoHref = useMemo(
    () =>
      `mailto:carl@carldegs.com?subject=${encodeURIComponent(
        'Saltong Data Transfer'
      )}&body=${encodeURIComponent(emailContent)}`,
    [emailContent]
  );

  const handleCopyEmailContent = useCallback(async () => {
    if (!hubEmail || !isValidHubEmail) {
      toast({
        title: 'Enter a valid Saltong Hub email',
        description: 'Add the same email you use on Saltong Hub before copying.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    try {
      if (
        typeof navigator !== 'undefined' &&
        navigator.clipboard &&
        navigator.clipboard.writeText
      ) {
        await navigator.clipboard.writeText(emailContent);
      } else if (typeof document !== 'undefined') {
        const textArea = document.createElement('textarea');
        textArea.value = emailContent;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      } else {
        throw new Error('Clipboard API unavailable');
      }

      toast({
        title: 'Email content copied',
        description: 'Paste it into your mail app if the button does not work.',
        status: 'success',
        duration: 4000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Unable to copy email content',
        description: 'Please try again or use the email button instead.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [emailContent, hubEmail, isValidHubEmail, toast]);

  const handleSendEmail = useCallback(() => {
    if (!hubEmail || !isValidHubEmail) {
      toast({
        title: 'Enter a valid Saltong Hub email',
        description: 'Add the same email you use on Saltong Hub before sending.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    if (typeof window !== 'undefined') {
      window.location.href = mailtoHref;
    }
  }, [hubEmail, isValidHubEmail, mailtoHref, toast]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      closeOnOverlayClick={false}
      closeOnEsc={false}
    >
      <ModalOverlay />
      <ModalContent pb={4}>
        <ModalBody mt={4}>
          <Stack direction="column" spacing={6}>
            {/* Header Section with Logo and CTA */}
            <Box
              bg={colorMode === 'light' ? 'blue.50' : 'blue.900'}
              py={6}
              px={[4, 6]}
              borderRadius={10}
            >
              <Stack direction="row" spacing={4} align="center">
                <Img
                  src="/hub.svg"
                  alt="Saltong Hub Logo"
                  boxSize="80px"
                  flexShrink={0}
                />
                <Stack spacing={3} flex={1}>
                  <Text fontSize="lg" fontWeight="semibold">
                    Saltong is moving to Saltong Hub!
                  </Text>
                  <Text
                    fontSize="sm"
                    color={colorMode === 'light' ? 'gray.700' : 'gray.300'}
                  >
                    Starting January 1, 2026, Saltong is moving to its new,
                    permanent home at{' '}
                    <a href="https://saltong.com">saltong.com</a>
                  </Text>
                  <Button
                    as="a"
                    href="https://saltong.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    colorScheme="blue"
                    size="md"
                    fontWeight="bold"
                    w="fit-content"
                  >
                    Go to Saltong Hub
                  </Button>
                </Stack>
              </Stack>
            </Box>

            {/* Step 1 */}
            <Box
              bg={colorMode === 'light' ? 'gray.100' : 'gray.700'}
              py={5}
              px={[4, 6]}
              borderRadius={10}
            >
              <Text fontWeight="semibold" fontSize="lg" mb={2}>
                Step 1: Create Your Saltong Hub Account
              </Text>
              <Text
                mb={4}
                color={colorMode === 'light' ? 'gray.600' : 'gray.300'}
              >
                Sign up at{' '}
                <Text
                  as="a"
                  href="https://saltong.com/auth"
                  target="_blank"
                  rel="noopener noreferrer"
                  color="blue.500"
                  fontWeight="semibold"
                >
                  saltong.com/auth
                </Text>{' '}
                then add the email you used below. We need it to match your
                Saltong Hub account.
              </Text>
              <FormControl isInvalid={Boolean(hubEmail) && !isValidHubEmail}>
                <FormLabel fontSize="sm">Saltong Hub account email</FormLabel>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={hubEmail}
                  onChange={(event) => setHubEmail(event.target.value)}
                  bg={colorMode === 'light' ? 'white' : 'gray.800'}
                />
                <FormErrorMessage fontSize="xs">
                  Please enter a valid email address.
                </FormErrorMessage>
              </FormControl>
            </Box>

            <Box
              bg={colorMode === 'light' ? 'gray.100' : 'gray.700'}
              py={5}
              px={[4, 6]}
              borderRadius={10}
            >
              <Text fontSize="lg" fontWeight="semibold" mb={1}>
                Step 2: Confirm the Data To Transfer
              </Text>
              <Text
                fontSize="sm"
                mb={4}
                color={colorMode === 'light' ? 'gray.600' : 'gray.300'}
              >
                Your Stats That Will Be Transferred
              </Text>
              <SimpleGrid columns={[1, 3]} spacing={4}>
                <Box
                  bg={colorMode === 'light' ? 'gray.50' : 'gray.600'}
                  p={4}
                  borderRadius={8}
                  textAlign="center"
                >
                  <Box mb={2}>
                    <Img
                      src="/icon-192.png"
                      alt="Main Game"
                      width="40px"
                      height="40px"
                      mx="auto"
                    />
                  </Box>

                  <Text fontWeight="bold" fontSize="lg" mb={2}>
                    Saltong
                  </Text>
                  <Text fontSize="sm" mb={1}>
                    Games Played: {saltongData.main?.numPlayed || 0}
                  </Text>
                  <Text fontSize="sm" mb={1}>
                    Wins: {saltongData.main?.numWins || 0}
                  </Text>
                  <Text fontSize="sm" mb={1}>
                    Current Streak: {saltongData.main?.winStreak || 0}
                  </Text>
                  <Text fontSize="sm">
                    Best Streak: {saltongData.main?.longestWinStreak || 0}
                  </Text>
                </Box>
                <Box
                  bg={colorMode === 'light' ? 'gray.50' : 'gray.600'}
                  p={4}
                  borderRadius={8}
                  textAlign="center"
                >
                  <Box mb={2}>
                    <Img
                      src="/max.png"
                      alt="Max Game"
                      width="40px"
                      height="40px"
                      mx="auto"
                    />
                  </Box>
                  <Text fontWeight="bold" fontSize="lg" mb={2}>
                    Saltong Max
                  </Text>
                  <Text fontSize="sm" mb={1}>
                    Games Played: {saltongData.max?.numPlayed || 0}
                  </Text>
                  <Text fontSize="sm" mb={1}>
                    Wins: {saltongData.max?.numWins || 0}
                  </Text>
                  <Text fontSize="sm" mb={1}>
                    Current Streak: {saltongData.max?.winStreak || 0}
                  </Text>
                  <Text fontSize="sm">
                    Best Streak: {saltongData.max?.longestWinStreak || 0}
                  </Text>
                </Box>
                <Box
                  bg={colorMode === 'light' ? 'gray.50' : 'gray.600'}
                  p={4}
                  borderRadius={8}
                  textAlign="center"
                >
                  <Box mb={2}>
                    <Img
                      src="/mini.png"
                      alt="Mini Game"
                      width="40px"
                      height="40px"
                      mx="auto"
                    />
                  </Box>
                  <Text fontWeight="bold" fontSize="lg" mb={2}>
                    Saltong Mini
                  </Text>
                  <Text fontSize="sm" mb={1}>
                    Games Played: {saltongData.mini?.numPlayed || 0}
                  </Text>
                  <Text fontSize="sm" mb={1}>
                    Wins: {saltongData.mini?.numWins || 0}
                  </Text>
                  <Text fontSize="sm" mb={1}>
                    Current Streak: {saltongData.mini?.winStreak || 0}
                  </Text>
                  <Text fontSize="sm">
                    Best Streak: {saltongData.mini?.longestWinStreak || 0}
                  </Text>
                </Box>
              </SimpleGrid>
            </Box>

            <Box
              bg={colorMode === 'light' ? 'gray.100' : 'gray.700'}
              py={5}
              px={[4, 6]}
              borderRadius={10}
            >
              <Text fontWeight="semibold" fontSize="lg" mb={2}>
                Step 3: Send the Email
              </Text>
              <Text
                fontSize="sm"
                mb={4}
                color={colorMode === 'light' ? 'gray.600' : 'gray.300'}
              >
                Use the button below to draft the email automatically. If it
                does not work, copy the content and send it manually to
                carl@carldegs.com.
              </Text>
              <Stack spacing={3} direction="column">
                <Button
                  onClick={handleSendEmail}
                  colorScheme="green"
                  size="lg"
                  py={3}
                  fontWeight="bold"
                  flex={1}
                >
                  Send Email
                </Button>
                <Button
                  variant="link"
                  onClick={handleCopyEmailContent}
                  flex={1}
                  py={1}
                >
                  Copy Email Content
                </Button>
              </Stack>
            </Box>

            <Box mt={8}>
              <Text fontSize="md" fontWeight="semibold" mb={2}>
                What will <u>not</u> be transferred:
              </Text>
              <Box as="ul" pl={5} mb={2}>
                <li>Specific games played and their answers</li>
                <li>Saltong Hex progress and data</li>
              </Box>
              <Text fontSize="sm" color="gray.500" mb={2}>
                You will have the chance to play previous games again from the
                archives in Saltong Hub.
              </Text>
              <Text fontSize="sm" color="gray.400" textAlign="center" mt={4}>
                Need help? Email{' '}
                <Text
                  as="a"
                  href="mailto:carl@carldegs.com"
                  fontWeight="bold"
                  color="blue.500"
                >
                  carl@carldegs.com
                </Text>
              </Text>
              <Text
                fontSize="sm"
                color="blue.500"
                textAlign="center"
                mt={2}
                fontWeight="semibold"
              >
                Once transferred, start playing at Saltong Hub to keep your
                streak going!
              </Text>
            </Box>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default TransferDataModal;
