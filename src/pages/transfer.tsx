import { Box, Container } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

const TransferDataModal = dynamic(
  () => import('../organism/TransferDataModal'),
  { ssr: false }
);

const Transfer: React.FC = () => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Transfer Data - Saltong</title>
        <meta
          name="description"
          content="Transfer your Saltong data to Saltong Hub"
        />
      </Head>
      <Container maxW="container.md" py={8}>
        <Box>
          <TransferDataModal isOpen={true} onClose={() => router.push('/')} />
        </Box>
      </Container>
    </>
  );
};

export default Transfer;
