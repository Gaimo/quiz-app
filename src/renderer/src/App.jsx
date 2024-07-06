import { ChakraProvider } from '@chakra-ui/react'
import TableCategories from './components/CategoryEditor'
import { createContext, useState } from 'react'

export const LocaleContext = createContext()

function App() {
  const [locale, setLocale] = useState('pt-BR')

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <ChakraProvider>
        <TableCategories />
      </ChakraProvider>
    </LocaleContext.Provider>
  )
}

export default App
