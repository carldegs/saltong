import {
  Box,
  Button,
  Img,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  SimpleGrid,
  Stack,
  Text,
  useColorMode,
} from '@chakra-ui/react';

import { LOCAL_GAME_DATA, LOCAL_HEX_DATA } from '../constants';
import { HexGameState } from '../types/HexGameData';
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

const TransferDataModal: React.FC<Omit<ModalProps, 'children'>> = ({
  onClose,
  isOpen,
}) => {
  const { colorMode } = useColorMode();

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
      ].join('|')
    )
    .join(';');

  const encryptedData = xorCipher(baseData, SECRET_KEY);
  const data = Buffer.from(encryptedData, 'binary').toString('base64');

  console.log('Transfer Data:', baseData, encryptedData, data);

  const downloadData = () => {
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'saltong-save.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // const transferUrl = `${
  //   process.env.NEXT_PUBLIC_TRANSFER_URL || 'https://saltong.com'
  // }/transfer?data=${encodeURIComponent(data)}`;

  const transferUrl = `${
    process.env.NODE_ENV === 'production'
      ? 'https://saltong.com'
      : 'http://localhost:3000'
  }/transfer?data=${encodeURIComponent(data)}`;

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
        <ModalHeader>Transfer Your Saltong Data</ModalHeader>
        <ModalBody>
          <Stack direction="column" spacing={4}>
            <Stack direction="row">
              <Img
                src="/hub.svg"
                alt="Saltong Hub Logo"
                boxSize="80px"
                flexShrink={0}
              />
              <Text fontSize="md" mb={4}>
                Starting January 1, 2026, Saltong will be fully integrated with
                Saltong Hub. Please transfer your data to continue your
                progress.
              </Text>
            </Stack>
            <Box
              bg={colorMode === 'light' ? 'gray.100' : 'gray.700'}
              py={5}
              px={[4, 6]}
              borderRadius={10}
            >
              <Text fontWeight="semibold" fontSize="lg" mb={4}>
                Transfer Your Saltong Data
              </Text>
              <Text fontSize="md" mb={4}>
                Follow these steps to transfer your data:
              </Text>
              <Box as="ol" pl={5}>
                <Text as="li" mb={2}>
                  Create an account in{' '}
                  <Text
                    as="a"
                    href="https://saltong.com/auth"
                    target="_blank"
                    rel="noopener noreferrer"
                    color="blue.500"
                  >
                    Saltong Hub
                  </Text>
                  .
                </Text>
                <Text as="li" mb={2}>
                  Once created, take note of the email used.
                </Text>
                <Text as="li">
                  Download save file and send to carl@carldegs.com along with
                  email.
                </Text>
              </Box>
            </Box>

            <Box>
              <Text fontSize="md" fontWeight="semibold" mb={4}>
                Your Stats That Will Be Transferred:
              </Text>
              <SimpleGrid columns={3} spacing={4}>
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

            <Box textAlign="center">
              <Stack direction="row" spacing={4} justify="center">
                <Button
                  colorScheme="blue"
                  size="lg"
                  fontWeight="bold"
                  onClick={downloadData}
                >
                  Download Save File
                </Button>
                <Button
                  as="a"
                  href="mailto:carl@carldegs.com?subject=Saltong Data Transfer&body=Please find attached my Saltong save file."
                  colorScheme="green"
                  size="lg"
                  fontWeight="bold"
                >
                  Send Email
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
