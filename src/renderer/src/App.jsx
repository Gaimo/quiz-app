import { ChakraProvider } from '@chakra-ui/react'
import QuestionEditor from './components/QuestionEditor'
import { createContext, useState } from 'react'

export const LocaleContext = createContext()

function App() {
  const [locale, setLocale] = useState('pt-BR')

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <ChakraProvider>
        <QuestionEditor />
      </ChakraProvider>
    </LocaleContext.Provider>
  )
}

export default App
