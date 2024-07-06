import { useState, useEffect, useRef, useContext } from 'react'
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Select,
  IconButton,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay
} from '@chakra-ui/react'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { IntlProvider, useIntl } from 'react-intl'
import { LocaleContext } from '../App'

const messages = {
  'en-US': {
    'update-question': 'Update Question',
    'create-question': 'Create a Question',
    'question-label': 'Question:',
    'options-label': 'Options:',
    'add-option': 'Add Option',
    'correct-answer-label': 'Correct Answer:',
    'select-correct-answer': 'Select the correct answer',
    'tip-label': 'Tip:',
    'category-label': 'Category:',
    'select-category': 'Select a category',
    'update-question-button': 'Update Question',
    'submit-question-button': 'Submit Question',
    'questions-list': 'Questions List',
    'id-column': 'ID',
    'question-column': 'Question',
    'actions-column': 'Actions',
    'delete-question': 'Delete Question',
    'delete-confirmation':
      'Are you sure you want to delete this question? This action cannot be undone.',
    'cancel-button': 'Cancel',
    'delete-button': 'Delete',
    'error-title': 'Error',
    'error-description': 'Please fill in all required fields.',
    'success-title': 'Success',
    'question-updated': 'Question updated successfully.',
    'question-added': 'Question added successfully.',
    'question-deleted': 'Question deleted successfully.',
    'update-failed': 'Failed to update question.',
    'add-failed': 'Failed to add question.',
    'delete-failed': 'Failed to delete question.'
  },
  'pt-BR': {
    'update-question': 'Atualizar Pergunta',
    'create-question': 'Criar uma Pergunta',
    'question-label': 'Pergunta:',
    'options-label': 'Opções:',
    'add-option': 'Adicionar Opção',
    'correct-answer-label': 'Resposta Correta:',
    'select-correct-answer': 'Selecione a resposta correta',
    'tip-label': 'Dica:',
    'category-label': 'Categoria:',
    'select-category': 'Selecione uma categoria',
    'update-question-button': 'Atualizar Pergunta',
    'submit-question-button': 'Enviar Pergunta',
    'questions-list': 'Lista de Perguntas',
    'id-column': 'ID',
    'question-column': 'Pergunta',
    'actions-column': 'Ações',
    'delete-question': 'Deletar Pergunta',
    'delete-confirmation':
      'Tem certeza de que deseja deletar esta pergunta? Esta ação não pode ser desfeita.',
    'cancel-button': 'Cancelar',
    'delete-button': 'Deletar',
    'error-title': 'Erro',
    'error-description': 'Por favor, preencha todos os campos obrigatórios.',
    'success-title': 'Sucesso',
    'question-updated': 'Pergunta atualizada com sucesso.',
    'question-added': 'Pergunta adicionada com sucesso.',
    'question-deleted': 'Pergunta deletada com sucesso.',
    'update-failed': 'Falha ao atualizar pergunta.',
    'add-failed': 'Falha ao adicionar pergunta.',
    'delete-failed': 'Falha ao deletar pergunta.'
  }
}

export default function QuestionEditorIntl() {
  const { locale } = useContext(LocaleContext)

  return (
    <IntlProvider messages={messages[locale]} locale={locale}>
      <QuestionEditor />
    </IntlProvider>
  )
}

const QuestionEditor = () => {
  const { formatMessage } = useIntl()
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState([''])
  const [answer, setAnswer] = useState('')
  const [tip, setTip] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [categories, setCategories] = useState([])
  const [questions, setQuestions] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [editingQuestionId, setEditingQuestionId] = useState(null)
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [deletingQuestionId, setDeletingQuestionId] = useState(null)
  const toast = useToast()
  const cancelRef = useRef()

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await window.api.invoke('get-categories')
      setCategories(categories)
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    const fetchQuestions = async () => {
      const questions = await window.api.invoke('get-questions')
      setQuestions(questions)
    }
    fetchQuestions()
  }, [])

  const handleOptionChange = (index, value) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const handleAddOption = () => {
    if (options.length < 5) {
      setOptions([...options, ''])
    }
  }

  const handleDeleteOption = (index) => {
    if (options.length > 1) {
      const newOptions = options.filter((_, i) => i !== index)
      setOptions(newOptions)
    }
  }

  const handleSubmit = async () => {
    if (question.trim() === '' || options.length < 2 || categoryId === '') {
      toast({
        title: formatMessage({ id: 'error-title' }),
        description: formatMessage({ id: 'error-description' }),
        status: 'error',
        duration: 5000,
        isClosable: true
      })
      return
    }

    try {
      if (isEditing) {
        await window.api.invoke(
          'update-question',
          editingQuestionId,
          question,
          JSON.stringify(options),
          answer,
          tip,
          categoryId
        )
        setQuestions((prevQuestions) =>
          prevQuestions.map((q) =>
            q.id === editingQuestionId
              ? {
                  ...q,
                  question,
                  options: JSON.stringify(options),
                  answer,
                  tip,
                  category_id: categoryId
                }
              : q
          )
        )
        toast({
          title: formatMessage({ id: 'success-title' }),
          description: formatMessage({ id: 'question-updated' }),
          status: 'success',
          duration: 5000,
          isClosable: true
        })
      } else {
        const newQuestionId = await window.api.invoke(
          'add-question',
          question,
          JSON.stringify(options),
          answer,
          tip,
          categoryId
        )
        setQuestions((prevQuestions) => [
          ...prevQuestions,
          {
            id: newQuestionId,
            question,
            options: JSON.stringify(options),
            answer,
            tip,
            category_id: categoryId
          }
        ])
        toast({
          title: formatMessage({ id: 'success-title' }),
          description: formatMessage({ id: 'question-added' }),
          status: 'success',
          duration: 5000,
          isClosable: true
        })
      }
      setQuestion('')
      setOptions([''])
      setAnswer('')
      setTip('')
      setCategoryId('')
      setIsEditing(false)
      setEditingQuestionId(null)
    } catch (error) {
      toast({
        title: formatMessage({ id: 'error-title' }),
        description: isEditing
          ? formatMessage({ id: 'update-failed' })
          : formatMessage({ id: 'add-failed' }),
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    }
  }

  const handleEdit = (q) => {
    setQuestion(q.question)
    setOptions(JSON.parse(q.options))
    setAnswer(q.answer)
    setTip(q.tip)
    setCategoryId(q.category_id)
    setIsEditing(true)
    setEditingQuestionId(q.id)
  }

  const handleDelete = (id) => {
    setDeletingQuestionId(id)
    setIsAlertOpen(true)
  }

  const confirmDelete = async () => {
    try {
      await window.api.invoke('delete-question', deletingQuestionId)
      setQuestions(questions.filter((q) => q.id !== deletingQuestionId))
      toast({
        title: formatMessage({ id: 'success-title' }),
        description: formatMessage({ id: 'question-deleted' }),
        status: 'success',
        duration: 5000,
        isClosable: true
      })
    } catch (error) {
      toast({
        title: formatMessage({ id: 'error-title' }),
        description: formatMessage({ id: 'delete-failed' }),
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    } finally {
      setIsAlertOpen(false)
      setDeletingQuestionId(null)
    }
  }

  return (
    <Box p={4}>
      <Box p={4} borderWidth={1} borderRadius="lg">
        <Heading as="h2" size="lg" mb={4}>
          {isEditing
            ? formatMessage({ id: 'update-question' })
            : formatMessage({ id: 'create-question' })}
        </Heading>
        <FormControl mb={4}>
          <FormLabel>{formatMessage({ id: 'question-label' })}</FormLabel>
          <Input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>{formatMessage({ id: 'options-label' })}</FormLabel>
          {options.map((option, index) => (
            <Box key={index} display="flex" alignItems="center" mb={2}>
              <Box mr={2}>{String.fromCharCode(65 + index)}.</Box>
              <Input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                mr={2}
              />
              <IconButton
                icon={<DeleteIcon />}
                onClick={() => handleDeleteOption(index)}
                aria-label="Delete option"
                isDisabled={options.length === 1}
              />
            </Box>
          ))}
          <Button onClick={handleAddOption} mt={2} isDisabled={options.length >= 5}>
            {formatMessage({ id: 'add-option' })}
          </Button>
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>{formatMessage({ id: 'correct-answer-label' })}</FormLabel>
          <Select value={answer} onChange={(e) => setAnswer(e.target.value)}>
            <option value="">{formatMessage({ id: 'select-correct-answer' })}</option>
            {options.map((option, index) => (
              <option key={index} value={option}>
                {String.fromCharCode(65 + index)}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>{formatMessage({ id: 'tip-label' })}</FormLabel>
          <Input type="text" value={tip} onChange={(e) => setTip(e.target.value)} />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>{formatMessage({ id: 'category-label' })}</FormLabel>
          <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="">{formatMessage({ id: 'select-category' })}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name.charAt(0).toUpperCase() + category.name.slice(1).toLowerCase()}
              </option>
            ))}
          </Select>
        </FormControl>
        <Button onClick={handleSubmit} colorScheme="blue">
          {isEditing
            ? formatMessage({ id: 'update-question-button' })
            : formatMessage({ id: 'submit-question-button' })}
        </Button>
      </Box>

      <Heading as="h3" size="md" mt={8} mb={4}>
        {formatMessage({ id: 'questions-list' })}
      </Heading>
      <Box p={4} borderWidth={1} borderRadius="lg">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>{formatMessage({ id: 'id-column' })}</Th>
              <Th>{formatMessage({ id: 'question-column' })}</Th>
              <Th>{formatMessage({ id: 'actions-column' })}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {questions.map((q) => (
              <Tr key={q.id}>
                <Td>{q.id}</Td>
                <Td>{q.question}</Td>
                <Td>
                  <IconButton
                    icon={<EditIcon />}
                    aria-label="Edit question"
                    onClick={() => handleEdit(q)}
                  />
                  <IconButton
                    icon={<DeleteIcon />}
                    aria-label="Delete question"
                    onClick={() => handleDelete(q.id)}
                    ml={2}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsAlertOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {formatMessage({ id: 'delete-question' })}
            </AlertDialogHeader>

            <AlertDialogBody>{formatMessage({ id: 'delete-confirmation' })}</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsAlertOpen(false)}>
                {formatMessage({ id: 'cancel-button' })}
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                {formatMessage({ id: 'delete-button' })}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  )
}
