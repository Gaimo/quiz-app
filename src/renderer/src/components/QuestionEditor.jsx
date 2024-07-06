import { useState, useEffect, useRef } from 'react'
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

const QuestionEditor = () => {
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
        title: 'Error',
        description: 'Please fill in all required fields.',
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
        // Atualize o estado questions após a atualização bem-sucedida
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
          title: 'Success',
          description: 'Question updated successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true
        })
      } else {
        await window.api.invoke(
          'add-question',
          question,
          JSON.stringify(options),
          answer,
          tip,
          categoryId
        )
        toast({
          title: 'Success',
          description: 'Question added successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true
        })
      }
      // Clear form after submission
      setQuestion('')
      setOptions([''])
      setAnswer('')
      setTip('')
      setCategoryId('')
      setIsEditing(false)
      setEditingQuestionId(null)
    } catch (error) {
      toast({
        title: 'Error',
        description: isEditing ? 'Failed to update question.' : 'Failed to add question.',
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
        title: 'Success',
        description: 'Question deleted successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete question.',
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
      <Heading as="h2" size="lg" mb={4}>
        {isEditing ? 'Update Question' : 'Create a Question'}
      </Heading>
      <FormControl mb={4}>
        <FormLabel>Question:</FormLabel>
        <Input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} />
      </FormControl>
      <FormControl mb={4}>
        <FormLabel>Options:</FormLabel>
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
          Add Option
        </Button>
      </FormControl>
      <FormControl mb={4}>
        <FormLabel>Correct Answer:</FormLabel>
        <Select value={answer} onChange={(e) => setAnswer(e.target.value)}>
          <option value="">Select the correct answer</option>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {String.fromCharCode(65 + index)}
            </option>
          ))}
        </Select>
      </FormControl>
      <FormControl mb={4}>
        <FormLabel>Tip:</FormLabel>
        <Input type="text" value={tip} onChange={(e) => setTip(e.target.value)} />
      </FormControl>
      <FormControl mb={4}>
        <FormLabel>Category:</FormLabel>
        <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      </FormControl>
      <Button onClick={handleSubmit} colorScheme="blue">
        {isEditing ? 'Update Question' : 'Submit Question'}
      </Button>
      <Heading as="h3" size="md" mt={8} mb={4}>
        Questions List
      </Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Question</Th>
            <Th>Actions</Th>
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

      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsAlertOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Question
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this question? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsAlertOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  )
}

export default QuestionEditor
