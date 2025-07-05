import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  GridItem,
  Heading,
  Spinner,
  Text,
  Textarea,
  useColorMode,
  IconButton
} from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';

const API_URL = 'https://pahomm2116-summarizer-api.hf.space/summarize/'

function App() {
  const { colorMode, toggleColorMode } = useColorMode();
  const [text, setText] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setSummary('');
    setError(null);

    if (!text.trim()) {
      setError('Пожалуйста, введите текст для суммаризации.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text }),
      });

      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setSummary(data.summary);
    } catch (err) {
      if (err instanceof Error) {
        setError(`Произошла ошибка: ${err.message}`);
      } else {
        setError('Произошла неизвестная ошибка.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box bg={colorMode === 'dark' ? 'gray.900' : 'gray.50'} color={colorMode === 'dark' ? 'white' : 'black'} minH="100vh" py={10}>
      <Container maxW="container.lg">

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={8}>
          <Heading as="h1" size="xl">AI Summarizer</Heading>
          <IconButton
            aria-label="Toggle theme"
            icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
            onClick={toggleColorMode}
            variant="ghost"
          />
        </Box>

        <Grid templateColumns='1fr' gap={8}>

          <GridItem as="form" onSubmit={handleSubmit}>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Вставьте ваш текст сюда..."
              minHeight="250px"
              isDisabled={isLoading}
              focusBorderColor="teal.400"
              bg={colorMode === 'dark' ? 'gray.800' : 'white'}
            />
            <Button
              type="submit"
              colorScheme="teal"
              width="full"
              mt={4}
              isLoading={isLoading}
              loadingText="Обработка..."
            >
              Суммаризировать
            </Button>
          </GridItem>

          <GridItem>
            <Heading as="h2" size="lg" mb={4}>Результат</Heading>
            <Box
              minHeight="250px"
              p={4}
              border="1px solid"
              borderColor={colorMode === 'dark' ? 'gray.700' : 'gray.200'}
              borderRadius="md"
              bg={colorMode === 'dark' ? 'gray.800' : 'white'}
            >
              {isLoading && <Spinner color="teal.500" />}
              {error && <Text color="red.400">{error}</Text>}
              {summary && <Text>{summary}</Text>}
            </Box>
          </GridItem>
        </Grid>

      </Container>
    </Box>
  );
}

export default App;