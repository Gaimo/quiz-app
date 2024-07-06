import { useState, useContext, useEffect, useRef } from 'react'
import {
  Box,
  Button,
  Heading,
  Text,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay
} from '@chakra-ui/react'
import { IntlProvider, useIntl } from 'react-intl'
import { LocaleContext } from '../App'

const messages = {
  'en-US': {
    'show-tip': 'Show tip',
    'question-label': 'Question:',
    'next-question': 'Next question',
    'correct-answer': 'Correct answer',
    'wrong-answer': 'Wrong answer',
    'change-question-confirmation':
      'Are you sure you want to change the question without selecting an answer?',
    'cancel-button': 'Cancel',
    'confirm-button': 'Confirm',
    'no-questions-available': 'No questions available'
  },
  'pt-BR': {
    'show-tip': 'Mostrar dica',
    'question-label': 'Questão:',
    'next-question': 'Próxima questão',
    'correct-answer': 'Resposta correta',
    'wrong-answer': 'Resposta errada',
    'change-question-confirmation':
      'Tem certeza de que deseja mudar a questão sem selecionar uma resposta?',
    'cancel-button': 'Cancelar',
    'confirm-button': 'Confirmar',
    'no-questions-available': 'Nenhuma questão disponível'
  }
}

export default function QuizIntl() {
  const { locale } = useContext(LocaleContext)

  return (
    <IntlProvider messages={messages[locale]} locale={locale}>
      <Quiz />
    </IntlProvider>
  )
}

function Quiz() {
  const { formatMessage } = useIntl()
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [showTip, setShowTip] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [correctAnswer, setCorrectAnswer] = useState(null)
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [discardedAnswers, setDiscardedAnswers] = useState([])
  const cancelRef = useRef()

  const fetchRandomQuestion = async () => {
    const question = await window.api.invoke('get-random-question')
    if (question) {
      question.options = JSON.parse(question.options)
      question.options = question.options.sort(() => Math.random() - 0.5)
      setCurrentQuestion(question)
      setSelectedAnswer(null)
      setCorrectAnswer(null)
      setShowTip(false)
      setDiscardedAnswers([])
    } else {
      setCurrentQuestion(null)
    }
  }

  useEffect(() => {
    fetchRandomQuestion()
  }, [])

  const handleAnswerClick = (answer) => {
    if (selectedAnswer === null && !discardedAnswers.includes(answer)) {
      setSelectedAnswer(answer)
      if (answer === currentQuestion.answer) {
        setCorrectAnswer(true)
      } else {
        setCorrectAnswer(false)
      }
    }
  }

  const handleAnswerRightClick = (answer, event) => {
    event.preventDefault()
    if (selectedAnswer === null) {
      setDiscardedAnswers((prev) =>
        prev.includes(answer) ? prev.filter((a) => a !== answer) : [...prev, answer]
      )
    }
  }

  const handleNextQuestion = () => {
    if (selectedAnswer === null) {
      setIsAlertOpen(true)
    } else {
      fetchRandomQuestion()
    }
  }

  const confirmNextQuestion = () => {
    setIsAlertOpen(false)
    fetchRandomQuestion()
  }

  return (
    <Box p={4} borderWidth={1} borderRadius="lg">
      {currentQuestion ? (
        <Box w="705px">
          <Heading size="md" mt={4}>
            {currentQuestion.question}
          </Heading>
          {showTip && <Text mt={2}>{currentQuestion.tip}</Text>}
          <Box mt={4}>
            {currentQuestion.options &&
              currentQuestion.options.map((answer, index) => (
                <Text
                  key={index}
                  onClick={() => handleAnswerClick(answer)}
                  onContextMenu={(event) => handleAnswerRightClick(answer, event)}
                  cursor={
                    selectedAnswer === null && !discardedAnswers.includes(answer)
                      ? 'pointer'
                      : 'default'
                  }
                  color={
                    selectedAnswer === answer
                      ? correctAnswer
                        ? 'green'
                        : 'red'
                      : answer === currentQuestion.answer && selectedAnswer !== null
                        ? 'green'
                        : 'black'
                  }
                  textDecoration={discardedAnswers.includes(answer) ? 'line-through' : 'none'}
                  mt={2}
                  mr={2}
                >
                  {String.fromCharCode(65 + index)}) {answer}
                </Text>
              ))}
          </Box>
          <Box mt={4} display="flex" justifyContent="space-between">
            <Button onClick={() => setShowTip(true)} mt={4} isDisabled={showTip}>
              {formatMessage({ id: 'show-tip' })}
            </Button>
            <Button onClick={handleNextQuestion} mt={4}>
              {formatMessage({ id: 'next-question' })}
            </Button>
          </Box>
        </Box>
      ) : (
        <Text mt={4}>{formatMessage({ id: 'no-questions-available' })}</Text>
      )}
      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsAlertOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {formatMessage({ id: 'next-question' })}
            </AlertDialogHeader>
            <AlertDialogBody>
              {formatMessage({ id: 'change-question-confirmation' })}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsAlertOpen(false)}>
                {formatMessage({ id: 'cancel-button' })}
              </Button>
              <Button colorScheme="red" onClick={confirmNextQuestion} ml={3}>
                {formatMessage({ id: 'confirm-button' })}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  )
}
