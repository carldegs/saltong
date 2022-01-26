import { Button } from '@chakra-ui/button';
import { Flex, Heading, Text } from '@chakra-ui/layout';
import { useRouter } from 'next/router';

const Custom404: React.FC = () => {
  const router = useRouter();
  return (
    <Flex
      w="full"
      h="100vh"
      justifyContent="center"
      alignItems="center"
      flexDir="column"
    >
      <Heading fontSize="8xl" letterSpacing="10px">
        404
      </Heading>
      <Heading>Page Not Found</Heading>
      <Text mt={4} fontSize="xl">
        Naliligaw ka &apos;te?
      </Text>
      <Button
        colorScheme="blue"
        mt={8}
        onClick={() => {
          router.push('/');
        }}
      >
        Back to Homepage
      </Button>
    </Flex>
  );
};

export default Custom404;
