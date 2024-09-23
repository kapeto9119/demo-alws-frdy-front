import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  useDisclosure,
  VStack,
  Icon,
  HStack,
} from '@chakra-ui/react';
import { FaAws, FaDocker, FaGithub } from 'react-icons/fa';

const ExplanationModal: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen} colorScheme="teal" mt={5}>
        How this App Works
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="3xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="2xl">How the App Works</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack align="left" spacing={4}>
              <Text fontSize="lg" fontWeight="bold">
                Docker Architecture
              </Text>
              <Text fontSize="md">
                This app is composed of three Docker containers running on an
                AWS EC2 instance. Each container serves a specific role in the
                application architecture:
              </Text>
              <VStack align="left" spacing={2}>
                <Text fontSize="md">
                  • <strong>Frontend Service:</strong> Built using Next.js with
                  TypeScript, the frontend provides the user interface for
                  interacting with the app. Next.js handles server-side
                  rendering and client-side navigation, making the app
                  performant and scalable.
                </Text>
                <Text fontSize="md">
                  • <strong>Backend Service:</strong> Developed with Node.js and
                  TypeScript, the backend handles API requests and orchestrates
                  the interaction between the frontend and the machine learning
                  service. It processes incoming requests and sends the data to
                  the appropriate service.
                </Text>
                <Text fontSize="md">
                  • <strong>Machine Learning Service (ML):</strong> Implemented
                  with Python and FastAPI, this service performs image
                  recognition using OpenCV. When an image is uploaded, the
                  backend communicates with this ML service to perform face
                  detection or other processing tasks in real-time.
                </Text>
              </VStack>

              <Text fontSize="lg" fontWeight="bold">
                Communication Between Services
              </Text>
              <Text fontSize="md">
                Each microservice interacts with others via HTTP requests. The
                frontend communicates with the backend through API endpoints,
                while the backend makes HTTP requests to the machine learning
                service for processing. This architecture ensures modularity and
                separation of concerns.
              </Text>

              <Text fontSize="lg" fontWeight="bold">
                CI/CD Pipeline
              </Text>
              <Text fontSize="md">
                The CI/CD pipeline is set up with GitHub Actions. Whenever code
                is pushed to the <strong>main</strong> branch, a workflow is
                triggered to:
              </Text>
              <VStack align="left" spacing={2}>
                <Text fontSize="md">• Build a new Docker image</Text>
                <Text fontSize="md">• Push the image to Docker Hub</Text>
                <Text fontSize="md">
                  • SSH into the EC2 instance to update the deployment
                </Text>
              </VStack>

              <Text fontSize="lg" fontWeight="bold">
                Technologies Used
              </Text>
              <HStack spacing={6} justify="center">
                <VStack>
                  <Icon as={FaAws} w={10} h={10} />
                  <Text>AWS EC2</Text>
                </VStack>
                <VStack>
                  <Icon as={FaDocker} w={10} h={10} />
                  <Text>Docker</Text>
                </VStack>
                <VStack>
                  <Icon as={FaGithub} w={10} h={10} />
                  <Text>GitHub Actions</Text>
                </VStack>
              </HStack>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="teal" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ExplanationModal;
