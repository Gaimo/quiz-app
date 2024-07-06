import { useState, useEffect } from 'react'
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Select,
  IconButton,
  useToast
} from '@chakra-ui/react'
import { DeleteIcon } from '@chakra-ui/icons'

const QuestionEditor = () => {
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState([''])
  const [answer, setAnswer] = useState('')
  const [tip, setTip] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [categories, setCategories] = useState([])
  const toast = useToast()

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await window.api.invoke('get-categories')
      setCategories(categories)
    }
    fetchCategories()
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
      await window.api.invoke('add-question', [
        question,
        JSON.stringify(options),
        answer,
        tip,
        categoryId
      ])
      toast({
        title: 'Success',
        description: 'Question added successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true
      })
      // Clear form after submission
      setQuestion('')
      setOptions([''])
      setAnswer('')
      setTip('')
      setCategoryId('')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add question.',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    }
  }

  return (
    <Box p={4}>
      <Heading as="h2" size="lg" mb={4}>
        Create a Question
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
        Submit Question
      </Button>
    </Box>
  )
}

export default QuestionEditor
