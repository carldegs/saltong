import { ChakraProvider } from '@chakra-ui/provider';
import '@fontsource/ibm-plex-sans';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import React, { useEffect, useRef } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Hydrate } from 'react-query/hydration';

import { DisclosuresProvider } from '../context/DisclosuresContext';
import { GameProvider } from '../context/GameContext';
import { HexGameProvider } from '../context/HexGameContext';
import { KeyboardProvider } from '../context/KeyboardContext';
import ModalWrapper from '../organism/ModalWrapper';
import theme from '../theme';
import { sendPageViewEvent } from '../utils/gtag';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }: AppProps) => {
  const queryClientRef = useRef<QueryClient>();
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          refetchOnWindowFocus: false,
          cacheTime: 1000 * 60 * 60 * 1,
        },
      },
    });
  }

  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      sendPageViewEvent(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <QueryClientProvider client={queryClientRef.current}>
      <Hydrate state={pageProps.dehydratedState}>
        <ChakraProvider theme={theme}>
          <DisclosuresProvider>
            <KeyboardProvider>
              <HexGameProvider>
                <GameProvider>
                  <ModalWrapper>
                    <Component {...pageProps} />
                  </ModalWrapper>
                </GameProvider>
              </HexGameProvider>
            </KeyboardProvider>
          </DisclosuresProvider>
        </ChakraProvider>
      </Hydrate>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default MyApp;
