import { ChakraProvider, Flex, Box } from '@chakra-ui/react'
import QuizIntl from './components/Quiz'
import CategoryEditorIntl from './components/CategoryEditor'
import QuestionEditorIntl from './components/QuestionEditor'
import SidebarIntl from './components/Sidebar'
import { createContext, useState } from 'react'

export const LocaleContext = createContext()
export const ScreenContext = createContext()

function App() {
  const [locale, setLocale] = useState('pt-BR')
  const [screen, setScreen] = useState('quiz') // Default screen

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <ScreenContext.Provider value={{ screen, setScreen }}>
        <ChakraProvider>
          <Flex p={4} gap={4}>
            <Box>
              <SidebarIntl />
            </Box>
            <Box>
              {screen === 'quiz' && <QuizIntl />}
              {screen === 'create-category' && <CategoryEditorIntl />}
              {screen === 'create-question' && <QuestionEditorIntl />}
            </Box>
          </Flex>
        </ChakraProvider>
      </ScreenContext.Provider>
    </LocaleContext.Provider>
  )
}

export default App
