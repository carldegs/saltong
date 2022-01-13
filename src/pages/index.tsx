import { Flex, Heading } from '@chakra-ui/layout';

import Layout from '../components/Layout';

const Home: React.FC = () => {
  return (
    <Layout variant="fullContent">
      <Flex h="full" bg="cyan.50" alignItems="center" justifyContent="center">
        <Heading>Hello there, Kenobi!</Heading>
      </Flex>
    </Layout>
  );
};

export default Home;
