const Database = require('better-sqlite3')
const db = new Database('questions.db')

const createCategoryTable = db.prepare(`
  CREATE TABLE IF NOT EXISTS category (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  )
`)

const createQuestionsTable = db.prepare(`
  CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,
    options TEXT NOT NULL,
    answer TEXT NOT NULL,
    tip TEXT,
    category_id INTEGER,
    FOREIGN KEY (category_id) REFERENCES category(id)
  )
`)

createCategoryTable.run()
createQuestionsTable.run()

function addCategory(name) {
  name = name.toLowerCase()
  const checkCategory = db.prepare(`
    SELECT COUNT(*) as count FROM category WHERE name = ?
  `)
  const { count } = checkCategory.get(name)
  if (count > 0) {
    return null
  }
  const insertCategory = db.prepare(`
    INSERT INTO category (name) VALUES (?)
  `)
  const result = insertCategory.run(name)
  return result.lastInsertRowid
}

function addQuestion(question, options, answer, tip, categoryId) {
  const insertQuestion = db.prepare(`
    INSERT INTO questions (question, options, answer, tip, category_id) VALUES (?, ?, ?, ?, ?)
  `)
  const result = insertQuestion.run(question, options, answer, tip, categoryId)
  return result.lastInsertRowid
}

function getCategories() {
  const selectCategories = db.prepare(`
    SELECT * FROM category
  `)
  const result = selectCategories.all()
  return result
}

function deleteCategory(id) {
  const deleteCategoryStmt = db.prepare(`
    DELETE FROM category WHERE id = ?
  `)
  const result = deleteCategoryStmt.run(id)
  return result.changes > 0
}

export { addCategory, addQuestion, getCategories, deleteCategory }
