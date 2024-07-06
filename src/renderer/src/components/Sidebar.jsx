import { Box, Button, VStack } from '@chakra-ui/react'
import { IntlProvider, useIntl } from 'react-intl'
import { useContext } from 'react'
import { LocaleContext, ScreenContext } from '../App'

const messages = {
  'en-US': {
    'home-button': 'Quiz',
    'create-question-button': 'Create Question',
    'create-category-button': 'Create Category'
  },
  'pt-BR': {
    'home-button': 'Quiz',
    'create-question-button': 'Criar Questão',
    'create-category-button': 'Criar Categoria'
  }
}

export default function SidebarIntl() {
  const { locale } = useContext(LocaleContext)

  return (
    <IntlProvider messages={messages[locale]} locale={locale}>
      <Sidebar />
    </IntlProvider>
  )
}

function Sidebar() {
  const { formatMessage } = useIntl()
  const { setScreen } = useContext(ScreenContext)

  return (
    <Box p={4} borderWidth={1} borderRadius="lg" width="200px">
      <VStack spacing={4}>
        <Button width="100%" onClick={() => setScreen('quiz')}>
          {formatMessage({ id: 'home-button', defaultMessage: 'Quiz' })}
        </Button>
        <Button width="100%" onClick={() => setScreen('create-question')}>
          {formatMessage({ id: 'create-question-button', defaultMessage: 'Criar Questão' })}
        </Button>
        <Button width="100%" onClick={() => setScreen('create-category')}>
          {formatMessage({ id: 'create-category-button', defaultMessage: 'Criar Categoria' })}
        </Button>
      </VStack>
    </Box>
  )
}
