import { ChakraProvider } from '@chakra-ui/react';
import '@fontsource/ibm-plex-sans';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import React, { useEffect, useRef } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Hydrate } from 'react-query/hydration';

import { DisclosuresProvider } from '../context/DisclosuresContext';
import { HexGameProvider } from '../context/HexGameContext';
import { KeyboardProvider } from '../context/KeyboardContext';
import ModalWrapper from '../organism/ModalWrapper';
import theme from '../theme';
import { sendPageViewEvent } from '../utils/gtag';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }: AppProps) => {
  const queryClientRef = useRef<QueryClient>();
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient();
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
                <ModalWrapper>
                  <Component {...pageProps} />
                </ModalWrapper>
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
