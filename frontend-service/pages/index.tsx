import { useState } from 'react';
import {
  Box,
  Button,
  Image,
  Text,
  useToast,
  VStack,
  Heading,
  Stack,
} from '@chakra-ui/react';
import Dropzone from '../components/Dropzone';

const Home: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toast = useToast();

  const handleFileAccepted = (file: File) => {
    // Client side validation
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please, select an image file',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File is too large',
        description: 'Image size must be less than 5MB',
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
        title: 'No file has been selected',
        description: 'Please, select an image file',
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
      // Use the NGINX proxy URL for the backend
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
    } catch (error: any) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'An error occurred while processing the image',
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
    <Box textAlign="center" p={5}>
      <Heading as="h1" size="xl" mb={5}>
        Facial Recognition App for Always Friday Interview
      </Heading>

      <Dropzone onFileAccepted={handleFileAccepted} />

      {selectedFile && !processedImage && (
        <Box mb={5}>
          <Text fontWeight="bold">Selected Image:</Text>
          <Image
            src={URL.createObjectURL(selectedFile)}
            alt="Seleccionada"
            maxW={['100%', '400px']}
            mx="auto"
            my={3}
          />
        </Box>
      )}

      <Button
        colorScheme="teal"
        onClick={handleSubmit}
        isLoading={isLoading}
        loadingText="Procesando"
        mb={5}
        disabled={isLoading || !selectedFile}
      >
        Upload and Detect Faces
      </Button>

      {processedImage && selectedFile && (
        <VStack spacing={5}>
          <Text fontWeight="bold">Image Comparison:</Text>
          <Stack
            direction={['column', 'row']}
            spacing={5}
            align="center"
            justify="center"
          >
            <Box>
              <Text fontWeight="medium">Original</Text>
              <Image
                src={URL.createObjectURL(selectedFile)}
                alt="Original"
                maxW={['100%', '400px']}
                mx="auto"
              />
            </Box>
            <Box>
              <Text fontWeight="medium">Processed</Text>
              <Image
                src={processedImage}
                alt="Procesada"
                maxW={['100%', '400px']}
                mx="auto"
              />
            </Box>
          </Stack>
          <Button colorScheme="teal" onClick={handleDownload}>
            Download Processed Image
          </Button>
        </VStack>
      )}
    </Box>
  );
};

export default Home;
