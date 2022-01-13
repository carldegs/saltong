import { Box, Heading, Text } from '@chakra-ui/layout';
import { Container, BoxProps, Spacer } from '@chakra-ui/react';
import { useRouter } from 'next/router';

const NAVBAR_HEIGHT = '60px';

const Navigation: React.FC<BoxProps> = (props) => {
  const router = useRouter();

  return (
    <Box
      as="header"
      bg="gray.900"
      h={NAVBAR_HEIGHT}
      w="full"
      position="sticky"
      top={0}
      {...props}
    >
      <Container
        h="full"
        maxW="container.xl"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Heading
          color="cyan.700"
          fontSize={{ base: 'xl', lg: '2xl' }}
          onClick={() => router.push('/')}
          cursor="pointer"
        >
          Create Next App
        </Heading>
        <Spacer />
        <Text color="cyan.700">User</Text>
      </Container>
    </Box>
  );
};

export default Navigation;
