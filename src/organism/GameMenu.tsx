import { HamburgerIcon } from '@chakra-ui/icons';
import {
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuItemOption,
  MenuList,
  useColorMode,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { Info } from 'phosphor-react';

import EmojiWrapper from '../atoms/EmojiWrapper';
import { useDisclosures } from '../context/DisclosuresContext';
import { useKeyboard } from '../context/KeyboardContext';
import GameMode from '../types/GameMode';
import GameStatus from '../types/GameStatus';
import { getUserData } from '../utils';

interface GameMenuProps {
  gameStatus?: GameStatus;
  resetLocalStorage: () => void;
  gameMode: GameMode;
}

const GameMenu: React.FC<GameMenuProps> = ({
  gameStatus,
  resetLocalStorage,
  gameMode,
}) => {
  const keyboardRef = useKeyboard();
  const disc = useDisclosures();
  const router = useRouter();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Menu
      onClose={() => {
        keyboardRef.current?.focus();
      }}
    >
      <MenuButton
        as={IconButton}
        aria-label="Menu"
        icon={<HamburgerIcon />}
        variant="outline"
      />
      <MenuList>
        <MenuItem
          onClick={
            gameMode === GameMode.hex
              ? disc.hexRulesModal.onOpen
              : disc.rulesModal.onOpen
          }
          icon={<Icon as={Info} weight="bold" />}
          display={['inherit', 'none']}
        >
          How to Play
        </MenuItem>
        {gameMode === GameMode.hex ? (
          <MenuItem
            onClick={disc.hexShareModal.onOpen}
            icon={<EmojiWrapper value="⭐" />}
          >
            Share Results
          </MenuItem>
        ) : (
          <MenuItem
            isDisabled={gameStatus === GameStatus.playing}
            onClick={disc.endGameModal.onOpen}
            title={
              gameStatus === GameStatus.playing
                ? 'Enabled once solved/game ended'
                : ''
            }
            icon={<EmojiWrapper value="📈" />}
          >
            View Stats/ Share Results
          </MenuItem>
        )}
        <MenuDivider />
        <MenuGroup title="Other Game Modes">
          {gameMode !== GameMode.mini && (
            <MenuItem
              icon={<EmojiWrapper value="🟢" />}
              onClick={() => router.push(`/${GameMode.mini}`)}
            >
              Saltong Mini
            </MenuItem>
          )}
          {gameMode !== GameMode.main && (
            <MenuItem
              icon={<EmojiWrapper value="🟡" />}
              onClick={() => router.push(`/`)}
            >
              Saltong
            </MenuItem>
          )}
          {gameMode !== GameMode.max && (
            <MenuItem
              icon={<EmojiWrapper value="🔴" />}
              onClick={() => router.push(`/${GameMode.max}`)}
            >
              Saltong Max
            </MenuItem>
          )}
          {gameMode !== GameMode.hex && (
            <MenuItem
              icon={<EmojiWrapper value="🐝" />}
              onClick={() => router.push(`/${GameMode.hex}`)}
            >
              Saltong Hex
            </MenuItem>
          )}
        </MenuGroup>

        <MenuDivider />
        <MenuGroup title="UI Settings">
          <MenuItemOption
            isChecked={colorMode === 'dark'}
            onClick={toggleColorMode}
            closeOnSelect={false}
          >
            Dark Mode
          </MenuItemOption>
          {/* <MenuItemOption
                    isChecked={colorMode === 'dark'}
                    onClick={toggleColorMode}
                    closeOnSelect={false}
                  >
                    Color Blind Mode (High Contrast)
                  </MenuItemOption> */}
        </MenuGroup>
        <MenuDivider />
        <MenuGroup title="Settings">
          <MenuItem
            onClick={disc.bugReportModal.onOpen}
            icon={<EmojiWrapper value="🐛" />}
          >
            Report Bug
          </MenuItem>
          <MenuItem
            onClick={disc.bugReportModal.onOpen}
            icon={<EmojiWrapper value="🔃" />}
          >
            Reset Data
          </MenuItem>
          <MenuItem
            onClick={disc.aboutModal.onOpen}
            icon={<EmojiWrapper value="❓" />}
          >
            About
          </MenuItem>
        </MenuGroup>
        {process.env.NODE_ENV === 'development' && (
          <>
            <MenuDivider />
            {gameMode !== GameMode.hex && (
              <MenuGroup title="Debug Mode">
                <MenuItem
                  onClick={() => {
                    resetLocalStorage();
                  }}
                  icon={<EmojiWrapper value="🧼" />}
                >
                  Clear LocalStorage
                </MenuItem>
                <MenuItem
                  onClick={disc.endGameModal.onOpen}
                  icon={<EmojiWrapper value="👁️‍🗨️" />}
                >
                  Show End Game Modal
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    // eslint-disable-next-line no-console
                    console.log(getUserData());
                  }}
                  icon={<EmojiWrapper value="📃" />}
                >
                  Log User Data
                </MenuItem>

                <MenuItem
                  onClick={disc.debugModal.onOpen}
                  icon={<EmojiWrapper value="🔍" />}
                >
                  Debug Code
                </MenuItem>
              </MenuGroup>
            )}
          </>
        )}
      </MenuList>
    </Menu>
  );
};
export default GameMenu;
