import { useCallback } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';

interface DropzoneProps {
  onFileAccepted: (file: File) => void;
}

const Dropzone: React.FC<DropzoneProps> = ({ onFileAccepted }) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        onFileAccepted(file);
      }
    },
    [onFileAccepted]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Box
      {...getRootProps()}
      border="2px dashed"
      borderColor={isDragActive ? 'teal.500' : 'red.200'}
      borderRadius="md"
      p={10}
      mb={5}
      cursor="pointer"
      _hover={{ borderColor: 'teal.500' }}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <Text>Drop the files here...</Text>
      ) : (
        <Text>Drag and drop an image here, or click to select files</Text>
      )}
    </Box>
  );
};

export default Dropzone;
