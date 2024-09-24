import { useState } from 'react';
import {
  Box,
  Button,
  Image,
  Text,
  VStack,
  Heading,
  Center,
  Avatar,
  Flex,
  Spacer,
  useToast,
} from '@chakra-ui/react';
import Dropzone from '../components/Dropzone';
import ExplanationModal from '../components/ExplanationModal';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';

const Home = () => {
  const { t, i18n } = useTranslation('common');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toast = useToast();

  if (!i18n.isInitialized) {
    return <p>Loading translations...</p>;
  }

  const handleFileAccepted = (file: File) => {
    if (
      !['image/jpeg', 'image/png', 'image/heic', 'image/heif'].includes(
        file.type
      )
    ) {
      toast({
        title: t('invalidFileType'),
        description: t('pleaseSelectImage'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: t('fileTooLarge'),
        description: t('imageSizeLimit'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    setSelectedFile(file);
    setProcessedImage(null);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast({
        title: t('noFileSelected'),
        description: t('pleaseSelectImage'),
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch('/api/images/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error processing image');
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setProcessedImage(imageUrl);
      setSelectedFile(null);
    } catch (error) {
      console.error(error);
      toast({
        title: t('error'),
        description: t('errorProcessingImage'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (processedImage) {
      const link = document.createElement('a');
      link.href = processedImage;
      link.download = 'processed_image.jpg';
      link.click();
    }
  };

  return (
    <Flex direction={['column', 'column', 'row']} height="100vh">
      <Box
        w={['100%', '100%', '30%']}
        p={5}
        textAlign={['center', 'center', 'left']}
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
        height="100%"
        bg={['transparent', 'transparent', 'gray.100']}
      >
        <Heading
          as="h2"
          size="lg"
          mb={5}
          textAlign={['center', 'center', 'left']}
        >
          {t('aboutMe')}
        </Heading>
        <Center mb={4}>
          <Avatar size="2xl" src="../img.jpg" />
        </Center>
        <Text fontSize="lg" mb={4} textAlign={['center', 'center', 'left']}>
          {t('description')}
        </Text>
        <Center>
          <ExplanationModal />
        </Center>
        <Spacer />
        <Center mt={3}>
          <Button onClick={() => i18n.changeLanguage('en')}>English</Button>
          <Button onClick={() => i18n.changeLanguage('it')} ml={3}>
            Italian
          </Button>
        </Center>
      </Box>

      <Box flex="1" p={5}>
        <Heading as="h1" size="xl" mb={10} textAlign="center">
          {t('title')}
        </Heading>

        <Center flexDirection="column" maxW="70%" mx="auto">
          <Dropzone onFileAccepted={handleFileAccepted} />

          {selectedFile && !processedImage && (
            <Box mb={5} textAlign="center">
              <Text fontWeight="bold">{t('selectedImage')}</Text>
              <Image
                src={URL.createObjectURL(selectedFile)}
                alt="Selected"
                maxW={['100%', '400px']}
                mx="auto"
                my={3}
              />
            </Box>
          )}

          <Button
            colorScheme="red"
            onClick={handleSubmit}
            isLoading={isLoading}
            loadingText={t('uploadButton')}
            mb={5}
            disabled={isLoading || !selectedFile}
            w="full"
            maxW="400px"
            mx="auto"
          >
            {t('uploadButton')}
          </Button>

          {processedImage && (
            <VStack spacing={5}>
              <Box>
                <Image
                  src={processedImage}
                  alt="Processed"
                  maxW={['100%', '400px']}
                  mx="auto"
                />
              </Box>
              <Button colorScheme="teal" onClick={handleDownload}>
                {t('downloadButton')}
              </Button>
            </VStack>
          )}
        </Center>
      </Box>
    </Flex>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, ['common'])),
  },
});

export default Home;
