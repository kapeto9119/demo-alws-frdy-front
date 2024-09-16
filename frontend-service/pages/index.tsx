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
    // Validación del lado del cliente
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Tipo de archivo inválido',
        description: 'Por favor, sube un archivo de imagen',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Archivo demasiado grande',
        description: 'El tamaño de la imagen debe ser menor a 5MB',
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
        title: 'No se ha seleccionado ningún archivo',
        description: 'Por favor, selecciona una imagen para subir',
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
      const response = await fetch('http://localhost:5000/api/images/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al procesar la imagen');
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setProcessedImage(imageUrl);
    } catch (error: any) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Ocurrió un error al procesar la imagen.',
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
        Aplicación de Detección Facial
      </Heading>

      <Dropzone onFileAccepted={handleFileAccepted} />

      {selectedFile && !processedImage && (
        <Box mb={5}>
          <Text fontWeight="bold">Imagen Seleccionada:</Text>
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
        Subir y Detectar Rostros
      </Button>

      {processedImage && selectedFile && (
        <VStack spacing={5}>
          <Text fontWeight="bold">Comparación de Imágenes:</Text>
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
              <Text fontWeight="medium">Procesada</Text>
              <Image
                src={processedImage}
                alt="Procesada"
                maxW={['100%', '400px']}
                mx="auto"
              />
            </Box>
          </Stack>
          <Button colorScheme="teal" onClick={handleDownload}>
            Descargar Imagen Procesada
          </Button>
        </VStack>
      )}
    </Box>
  );
};

export default Home;