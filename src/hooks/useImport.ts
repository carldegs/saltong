import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

import UserData from '../types/UserData';
import { getUserData, setUserData } from '../utils';

const useImport = () => {
  const [isPrevDomain, setIsPrevDomain] = useState(false);
  const router = useRouter();
  const { importfile } = router?.query || {};
  const toast = useToast();

  const onRedirect = useCallback(() => {
    const data = Buffer.from(JSON.stringify(getUserData() || {})).toString(
      'base64'
    );
    window.location.replace(
      `${process.env.NEXT_PUBLIC_NEW_DOMAIN}${
        router?.query ? `/${router.query?.slug || ''}` : ''
      }?importfile=${data}`
    );
  }, [router]);

  useEffect(() => {
    setIsPrevDomain(
      window.location.origin?.includes(process.env.NEXT_PUBLIC_OLD_DOMAIN)
    );
  }, []);

  useEffect(() => {
    if (importfile) {
      const currData = getUserData();
      const importedData: UserData = JSON.parse(
        Buffer.from(importfile as string, 'base64').toString('ascii')
      );

      if (importedData?.version) {
        const isCurrDataEmpty = !currData?.main?.numPlayed;

        if (isCurrDataEmpty) {
          setUserData(importedData);
        }

        router.replace(`/${router?.query?.slug || ''}`).then(() => {
          if (isCurrDataEmpty) {
            router.reload();
          }
        });

        toast({
          title: isCurrDataEmpty ? 'Import Success' : 'Import Failed',
          description: isCurrDataEmpty
            ? 'Game data successfully imported'
            : 'Import did not proceed because the current game data is not empty. Reset first by opening the menu then select the Reset Data option',
          status: isCurrDataEmpty ? 'success' : 'error',
          duration: 10000,
          isClosable: true,
          position: 'top-left',
        });
      }
    }
  }, [importfile, router, toast]);

  return {
    isPrevDomain,
    onRedirect,
  };
};

export default useImport;
