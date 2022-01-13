import { Box, Container, Grid } from '@chakra-ui/layout';
import { BoxProps, GridProps } from '@chakra-ui/react';
import Head from 'next/head';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';

import Footer from './Footer';
import Navigation from './Navigation';

const LayoutVariant = {
  scrollable: 'scrollable', // Default. Page is scrollable.
  fullPage: 'fullPage', // Layout, including the footer, covers the screen height.
  fullContent: 'fullContent', // The header and content will cover the screen height. User must scroll to see the header.
};

interface MetaProps {
  url: string;
  title: string;
  description: string;
  image: string;
}

interface LayoutProps {
  pageTitle?: string;
  head?: JSX.Element;
  variant?: keyof typeof LayoutVariant;
  showDashNav?: boolean;
  gridProps?: GridProps;
  mainProps?: BoxProps;
  recaptcha?: boolean;
  hideNavButtons?: boolean | 'header' | 'footer';
  hideLogin?: boolean;
  affixTitle?: boolean;
  container?: boolean;
  metadata?: Partial<MetaProps>;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  pageTitle = '',
  head,
  variant = LayoutVariant.scrollable,
  gridProps,
  mainProps,
  affixTitle = true,
  container = false,
  metadata = {},
}) => {
  const [title, setTitle] = useState('');

  useEffect(() => {
    setTitle(
      `${pageTitle}${affixTitle && pageTitle ? ' | ' : ''}${
        affixTitle ? 'Create Next App' : ''
      }`
    );
  }, [affixTitle, pageTitle]);

  const Wrapper = !container ? Box : Container;

  return (
    <>
      <Navigation zIndex="sticky" />
      <Grid
        gridTemplateRows={LayoutVariant.scrollable ? 'auto auto' : '1fr auto'}
        overflow={variant === LayoutVariant.fullPage ? 'hidden' : 'inherit'}
        {...gridProps}
      >
        <Wrapper
          as="main"
          h={
            variant === LayoutVariant.fullContent
              ? 'calc(100vh - 60px)'
              : 'full'
          }
          maxW={container && 'container.xl'}
          {...mainProps}
        >
          <Head>
            {head || (
              <>
                <title>{title}</title>
                <link rel="icon" href="/favicon.ico" />
              </>
            )}
            {Object.entries(metadata).map(([key, value]) => (
              <meta property={`og:${key}`} key={`og:${key}`} content={value} />
            ))}
          </Head>
          {children}
        </Wrapper>
        {variant !== LayoutVariant.fullContent && <Footer />}
      </Grid>
      {variant === LayoutVariant.fullContent && <Footer />}
    </>
  );
};

export default Layout;
