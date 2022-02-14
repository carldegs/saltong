import {
  Alert,
  CloseButton,
  Link,
  Skeleton,
  useColorModeValue,
} from '@chakra-ui/react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { Inline, INLINES, Text as TextType } from '@contentful/rich-text-types';
import { useMemo, useState } from 'react';

import { DOMAIN } from '../constants';
import useQueryContentful from '../queries/useQueryContentful';
import GameMode from '../types/GameMode';

const ContentfulAlert: React.FC<{ gameMode: GameMode }> = ({ gameMode }) => {
  const { data: contentfulData, isLoading: isLoadingContentfulData } =
    useQueryContentful(gameMode);
  const [showAlert, setShowAlert] = useState(true);
  const colorValue = useColorModeValue(600, 200);

  const alertMessage = useMemo(
    () =>
      (contentfulData?.items[0]?.fields as any)?.alert?.fields?.message
        ?.content[0],
    [contentfulData]
  );

  if (!showAlert || (!isLoadingContentfulData && !alertMessage)) {
    return null;
  }

  return (
    <Alert status="info">
      <Skeleton minH="20px" isLoaded={!isLoadingContentfulData}>
        {documentToReactComponents(alertMessage, {
          renderNode: {
            [INLINES.HYPERLINK]: (node) => {
              const { content, data } = (node || {}) as Inline;
              const text =
                content?.length && (content[0] as TextType)?.value
                  ? (content[0] as TextType)?.value
                  : '';
              const { uri } = data || {};
              const isExternal = !(uri || '').includes(DOMAIN);

              return (
                <Link
                  isExternal={isExternal}
                  href={uri}
                  fontWeight="bold"
                  color={`blue.${colorValue}`}
                >
                  {text}
                </Link>
              );
            },
          },
        })}
      </Skeleton>
      <CloseButton
        position="absolute"
        right="8px"
        top="8px"
        onClick={() => {
          setShowAlert(false);
        }}
      />
    </Alert>
  );
};

export default ContentfulAlert;
