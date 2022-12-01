import { HamburgerIcon } from '@chakra-ui/icons';
import {
  Button,
  IconButton,
  useColorMode,
  Heading,
  Flex,
  Stack,
  Text,
  Box,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverCloseButton,
  Spacer,
  HStack,
  Divider,
  FormControl,
  FormLabel,
  Switch,
  useColorModeValue,
  useBreakpointValue,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  Tooltip,
  CloseButton,
  Badge,
} from '@chakra-ui/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import {
  BugBeetle,
  HandWaving,
  Lifebuoy,
  Question,
  SkipBack,
  Trophy,
} from 'phosphor-react';
import { ReactElement, useState } from 'react';

import HexIcon from '../../public/hex.png';
import MainIcon from '../../public/icon-192.png';
import MaxIcon from '../../public/max.png';
import MiniIcon from '../../public/mini.png';
import { useDisclosures } from '../context/DisclosuresContext';
import { useHighContrast } from '../context/HighContrastContext';
import { useKeyboard } from '../context/KeyboardContext';
import GameMode from '../types/GameMode';
import GameStatus from '../types/GameStatus';

interface GameMenuProps {
  gameStatus?: GameStatus;
  resetLocalStorage: () => void;
  gameMode: GameMode;
}

const gameModeButtons = [
  {
    name: 'Saltong Mini',
    icon: MiniIcon,
    gameMode: GameMode.mini,
    path: `/${GameMode.mini}`,
  },
  {
    name: 'Saltong',
    icon: MainIcon,
    gameMode: GameMode.main,
    path: '/',
  },
  {
    name: 'Saltong Max',
    icon: MaxIcon,
    gameMode: GameMode.max,
    path: `/${GameMode.max}`,
  },
  {
    name: 'Saltong Hex',
    icon: HexIcon,
    gameMode: GameMode.hex,
    path: `/${GameMode.hex}`,
  },
];

const GameMenu: React.FC<GameMenuProps> = ({
  gameStatus,
  resetLocalStorage,
  gameMode,
}) => {
  const [showDevTools, setShowDevTools] = useState(
    () => process.env.NODE_ENV === 'development'
  );
  const keyboardRef = useKeyboard();
  const disc = useDisclosures();
  const showPopover = useBreakpointValue({ base: false, lg: true });

  const { isHighContrast, toggleHighContrast } = useHighContrast();
  const router = useRouter();
  const { colorMode, toggleColorMode } = useColorMode();
  const hoverBg = useColorModeValue('gray.100', 'gray.800');

  const isShareResultMenuItemDisabled =
    gameMode !== GameMode.hex && gameStatus === GameStatus.playing;
  const ShareResultMenuItem = (
    <LargeMenuItem
      icon={
        <Trophy
          size={28}
          color="var(--chakra-colors-orange-500)"
          weight="duotone"
        />
      }
      header="View and Share Results"
      description="Show off your win with your friends"
      onClick={
        gameMode === GameMode.hex
          ? disc.hexShareModal.onOpen
          : disc.endGameModal.onOpen
      }
      isDisabled={isShareResultMenuItemDisabled}
    />
  );

  const Content = (
    <Stack spacing={3} direction={{ base: 'column', md: 'row' }}>
      <Box flexGrow={1} w={{ base: 'full', md: '320px' }}>
        <LargeMenuItem
          icon={
            <Question
              size={28}
              color="var(--chakra-colors-blue-500)"
              weight="duotone"
            />
          }
          header="How to Play"
          description={`Learn how to play Saltong${
            gameMode !== GameMode.main ? ` ${gameMode.toUpperCase()}` : ''
          }`}
          onClick={
            gameMode === GameMode.hex
              ? disc.hexRulesModal.onOpen
              : disc.rulesModal.onOpen
          }
        />

        {isShareResultMenuItemDisabled ? (
          <Tooltip
            label="Only viewable once you've finished this round"
            openDelay={300}
          >
            {ShareResultMenuItem}
          </Tooltip>
        ) : (
          ShareResultMenuItem
        )}

        {gameMode === GameMode.hex && (
          <LargeMenuItem
            icon={
              <SkipBack
                size={28}
                color="var(--chakra-colors-teal-500)"
                weight="duotone"
              />
            }
            header="Previous Results"
            description="View the previous game's answers"
            onClick={disc.hexPrevAnsModal.onOpen}
          />
        )}

        <LargeMenuItem
          icon={
            <BugBeetle
              size={28}
              color="var(--chakra-colors-red-500)"
              weight="duotone"
            />
          }
          header="Report Issues"
          description="Report bugs and missing words"
          onClick={disc.bugReportModal.onOpen}
        />

        <LargeMenuItem
          icon={
            <HandWaving
              size={28}
              color="var(--chakra-colors-purple-500)"
              weight="duotone"
            />
          }
          header="About"
          description="More info about Saltong"
          onClick={disc.aboutModal.onOpen}
        />

        <LargeMenuItem
          icon={
            <Lifebuoy
              size={28}
              color="var(--chakra-colors-green-500)"
              weight="duotone"
            />
          }
          header={
            <>
              Contribute{' '}
              <Badge ml={1} mb={1} colorScheme="green">
                NEW
              </Badge>
            </>
          }
          description="Help keep the site running!"
          onClick={disc.contributeModal.onOpen}
        />
      </Box>

      <Divider
        h="350px"
        orientation="vertical"
        display={{ md: 'inherit', base: 'none' }}
        alignSelf="center"
      />

      <Flex minW={{ md: '210px' }} flexDir="column" justifyContent="center">
        <Box>
          <Heading fontSize="md" fontWeight="bold" mb={4} px={4}>
            Game Modes
          </Heading>
          <Stack spacing={1}>
            {gameModeButtons
              .filter(({ gameMode: buttonMode }) => gameMode !== buttonMode)
              .map(({ icon, name, path }) => (
                <Flex
                  key={`game-mode-${name}`}
                  onClick={() => {
                    disc.menuModal.onClose();
                    router.push(path);
                  }}
                  cursor="pointer"
                  alignItems="center"
                  spacing={0}
                  _hover={{ bg: hoverBg }}
                  borderRadius={8}
                  px={4}
                  py={2}
                  transition="background 0.3s ease"
                >
                  <Text textAlign="center" opacity="0.8">
                    {name}
                  </Text>

                  <Spacer />
                  <Flex
                    borderRadius={4}
                    overflow="hidden"
                    alignItem="center"
                    justifyContent="center"
                  >
                    <Image src={icon} height="20px" width="20px" />
                  </Flex>
                </Flex>
              ))}
          </Stack>
        </Box>

        <Box>
          <Heading fontSize="md" fontWeight="bold" mt={6} mb={8} px={4}>
            UI Settings
          </Heading>
          <Stack mt={4} ml={4} spacing={6}>
            <FormControl display="flex" alignItems="center" cursor="pointer">
              <Switch
                id="dark-mode"
                isChecked={colorMode === 'dark'}
                onChange={toggleColorMode}
              />
              <FormLabel
                htmlFor="dark-mode"
                mb="0"
                ml={4}
                cursor="pointer"
                opacity="0.8"
              >
                Dark Mode
              </FormLabel>
            </FormControl>

            <FormControl display="flex" alignItems="center" cursor="pointer">
              <Switch
                id="cb-mode"
                isChecked={isHighContrast}
                onChange={toggleHighContrast}
              />
              <FormLabel
                htmlFor="cb-mode"
                mb="0"
                ml={4}
                cursor="pointer"
                opacity="0.8"
              >
                Color Blind Mode
              </FormLabel>
            </FormControl>
          </Stack>

          {showDevTools && (
            <>
              <HStack alignItems="center" justifyContent="space-between">
                <Heading fontSize="md" fontWeight="bold" mt={6} mb={4} px={4}>
                  Dev Tools
                </Heading>
                <CloseButton onClick={() => setShowDevTools(false)} />
              </HStack>
              <Stack mt={4} ml={4} spacing={2}>
                <Button onClick={resetLocalStorage}>Clear Localstorage</Button>
                <Button onClick={disc.endGameModal.onOpen}>
                  Show Endgame Modal
                </Button>
                <Button onClick={disc.debugModal.onOpen}>Debug Modal</Button>
              </Stack>
            </>
          )}
        </Box>
      </Flex>
    </Stack>
  );

  return showPopover ? (
    <Popover
      placement="bottom-end"
      isOpen={disc.menuModal.isOpen}
      onClose={() => {
        disc.menuModal.onClose();
        keyboardRef.current?.focus();
      }}
      onOpen={disc.menuModal.onOpen}
      isLazy
    >
      <PopoverTrigger>
        <IconButton
          aria-label="Menu"
          icon={<HamburgerIcon />}
          variant="outline"
        />
      </PopoverTrigger>
      <PopoverContent w="full" maxW="600px">
        <PopoverCloseButton />
        <PopoverBody m={4} mx={0}>
          {Content}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  ) : (
    <>
      <IconButton
        aria-label="Menu"
        icon={<HamburgerIcon />}
        variant="outline"
        onClick={disc.menuModal.onOpen}
      />
      <Drawer
        placement="bottom"
        isOpen={disc.menuModal.isOpen}
        onClose={() => {
          disc.menuModal.onClose();
          keyboardRef.current?.focus();
        }}
      >
        <DrawerOverlay />

        <DrawerContent maxH="85vh">
          <DrawerCloseButton />
          <DrawerBody my={8} maxW="600px" mx="auto">
            {Content}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
export default GameMenu;

const LargeMenuItem: React.FC<{
  icon: ReactElement;
  header: string | ReactElement;
  description: string | ReactElement;
  onClick?: () => void;
  isDisabled?: boolean;
}> = ({ icon, header, description, onClick, isDisabled }) => {
  const hoverBg = useColorModeValue('gray.100', 'gray.800');

  return (
    <HStack
      cursor={isDisabled ? 'not-allowed' : 'pointer'}
      py={3}
      px={4}
      _hover={
        !isDisabled && {
          bg: hoverBg,
        }
      }
      borderRadius={8}
      onClick={!isDisabled ? onClick : () => undefined}
      opacity={isDisabled ? 0.5 : 1}
      transition="background 0.3s ease"
    >
      <Box p={2} borderRadius={8} bg={hoverBg}>
        {icon}
      </Box>
      <Stack spacing={0}>
        <Text fontSize="md" fontWeight="bold">
          {header}
        </Text>
        <Text fontSize="sm">{description}</Text>
      </Stack>
    </HStack>
  );
};
