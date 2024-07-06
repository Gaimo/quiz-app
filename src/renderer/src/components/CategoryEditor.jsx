import {
  Box,
  Button,
  IconButton,
  Input,
  FormControl,
  FormLabel,
  useToast,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td
} from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { useState, useEffect, useContext } from 'react'
import { IntlProvider, useIntl } from 'react-intl'
import { LocaleContext } from '../App'

const messages = {
  'en-US': {
    'add-category': 'Add Category',
    'delete-category': 'Delete Category',
    'category-added-success': 'Category added successfully!',
    'category-exists-error': 'Category already exists!',
    'category-deleted-success': 'Category deleted successfully!',
    'category-delete-failed': 'Failed to delete category!',
    'categories-heading': 'Categories',
    'new-category-label': 'New Category',
    'enter-category-placeholder': 'Enter category name',
    'id-column': 'Id',
    'category-column': 'Category',
    'action-column': 'Action',
    'delete-button': 'Delete'
  },
  'pt-BR': {
    'add-category': 'Adicionar Categoria',
    'delete-category': 'Deletar Categoria',
    'category-added-success': 'Categoria adicionada com sucesso!',
    'category-exists-error': 'Categoria já existe!',
    'category-deleted-success': 'Categoria deletada com sucesso!',
    'category-delete-failed': 'Falha ao deletar categoria!',
    'categories-heading': 'Categorias',
    'new-category-label': 'Nova Categoria',
    'enter-category-placeholder': 'Digite o nome da categoria',
    'id-column': 'Id',
    'category-column': 'Categoria',
    'action-column': 'Ação',
    'delete-button': 'Deletar'
  }
}

export default function CategoryEditorIntl() {
  const { locale } = useContext(LocaleContext)

  return (
    <IntlProvider messages={messages[locale]} locale={locale}>
      <CategoryEditor />
    </IntlProvider>
  )
}

function CategoryEditor() {
  const { formatMessage } = useIntl()
  const [categories, setCategories] = useState([])
  const [newCategory, setNewCategory] = useState('')
  const toast = useToast()

  useEffect(() => {
    async function fetchCategories() {
      const result = await window.api.invoke('get-categories')
      setCategories(result)
    }
    fetchCategories()
  }, [])

  const handleAddCategory = async () => {
    if (newCategory.trim() !== '') {
      setNewCategory(newCategory.toLowerCase())
      const result = await window.api.invoke('add-category', newCategory)
      if (result) {
        setCategories([...categories, { id: result, name: newCategory }])
        setNewCategory('')
        toast({
          title: formatMessage({ id: 'category-added-success' }),
          status: 'success',
          isClosable: true
        })
      } else {
        toast({
          title: formatMessage({ id: 'category-exists-error' }),
          status: 'error',
          isClosable: true
        })
      }
    }
  }

  const handleDeleteCategory = async (id) => {
    const result = await window.api.invoke('delete-category', id)
    if (result) {
      setCategories(categories.filter((category) => category.id !== id))
      toast({
        title: formatMessage({ id: 'category-deleted-success' }),
        status: 'success',
        isClosable: true
      })
    } else {
      toast({
        title: formatMessage({ id: 'category-delete-failed' }),
        status: 'error',
        isClosable: true
      })
    }
  }

  return (
    <Box p={4} borderWidth={1} borderRadius="lg" maxW="600px">
      <FormControl id="new-category">
        <FormLabel>{formatMessage({ id: 'new-category-label' })}</FormLabel>
        <Box display="flex" alignItems="center" gap="10px">
          <Input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder={formatMessage({ id: 'enter-category-placeholder' })}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddCategory()
              }
            }}
          />
          <IconButton
            colorScheme="teal"
            onClick={handleAddCategory}
            icon={<AddIcon />}
            aria-label={formatMessage({ id: 'add-category' })}
          />
        </Box>
      </FormControl>
      <Box mt={4} borderWidth={1} borderRadius="lg">
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th w="30px">{formatMessage({ id: 'id-column' })}</Th>
                <Th>{formatMessage({ id: 'category-column' })}</Th>
                <Th w="100px">{formatMessage({ id: 'action-column' })}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {categories.map((category) => (
                <Tr key={category.id}>
                  <Td>{category.id}</Td>
                  <Td>
                    {category.name.charAt(0).toUpperCase() + category.name.slice(1).toLowerCase()}
                  </Td>
                  <Td>
                    <Button colorScheme="red" onClick={() => handleDeleteCategory(category.id)}>
                      {formatMessage({ id: 'delete-button' })}
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  )
}
