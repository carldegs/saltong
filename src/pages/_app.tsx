import { ChakraProvider } from '@chakra-ui/provider';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import React, { useEffect, useRef } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Hydrate } from 'react-query/hydration';

import { DisclosuresProvider } from '../context/DisclosuresContext';
import { HighContrastProvider } from '../context/HighContrastContext';
import { KeyboardProvider } from '../context/KeyboardContext';
import ModalWrapper from '../organism/ModalWrapper';
import theme from '../theme';
import { AppPropsWithLayout } from '../types/NextPageWithLayout';
import { sendPageViewEvent } from '../utils/gtag';

const MyApp: React.FC<AppProps> = ({
  Component,
  pageProps,
}: AppPropsWithLayout) => {
  const queryClientRef = useRef<QueryClient>();
  const getLayout = Component.getLayout ?? ((page) => page);

  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          refetchOnWindowFocus: false,
          cacheTime: 1000 * 60 * 60 * 2,
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
            <HighContrastProvider>
              <KeyboardProvider>
                <ModalWrapper>
                  {getLayout(<Component {...pageProps} />)}
                </ModalWrapper>
              </KeyboardProvider>
            </HighContrastProvider>
          </DisclosuresProvider>
        </ChakraProvider>
      </Hydrate>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default MyApp;
