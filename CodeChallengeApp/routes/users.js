const express = require('express')
const router = express.Router()
const fs = require('fs').promises
const path = require('path')
const datasetPath = path.join(__dirname, "/../dataset.json")
const { body, validationResult } = require("express-validator")
const createError = require('http-errors')

async function readDatabase() {
  const data = await fs.readFile(datasetPath)
  const users = JSON.parse(data)
  return users
}

const userValidationRules = [
  body('name')
    .trim()
    .isLength({ min: 3 }).withMessage('Name must be at least 3 characters long')
    .matches(/^[a-zA-Z0-9\s]+$/).withMessage('Name must be alphanumeric (spaces allowed)'),
  body('id')
    .trim()
    .isLength(16).withMessage('Id must be exactly 16 characters long')
    .isAlphanumeric().withMessage('Id must be alphanumeric'),
  body('language').trim().isAlphanumeric().withMessage('Language must be alphanumeric'),
  body('bio').trim().escape(),
  body('version').isNumeric().withMessage('Version must be a number (dot as decimal separator)'),
]

const handleValidationErrors = (req, res, next) => {
  var d = new Date().toISOString().substring(0, 16)
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).render("error", { error: errors.array(), status: 400, date: d })
  }
  next()
}


// GET users list
router.get('/', async function (req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  try {
    const users = await readDatabase()

    users.sort((a, b) => a.name.localeCompare(b.name))
    res.status(200).render("home", { "usersL": users, "date": d })

  } catch (err) {
    res.status(500).render("error", { error: err, status: 500, date: d })
  }
})

// GET user creation form
router.get('/create', function (req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  res.status(200).render("userForm", { "date": d })
})

// POST new user
router.post('/create', userValidationRules, handleValidationErrors, async function (req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  try {
    var newUser = req.body
    const users = await readDatabase()

    users.push(newUser)
    await fs.writeFile(datasetPath, JSON.stringify(users, null, 2))
    res.redirect('/')

  } catch (err) {
    res.status(500).render("error", { error: err, date: d })
  }
})

// GET user edit form
router.get('/edit/:userId', async function (req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  try {
    const users = await readDatabase()
    const user = users.find(u => u.id === req.params.userId)

    if (user) {
      res.status(200).render("userEditForm", { "user": user, "date": d })

    } else {
      const err = createError(404, 'User not found')
      res.status(404).render("error", { error: err, date: d })
    }

  } catch (err) {
    res.status(500).render("error", { error: err, date: d })
  }
})

// PUT edited user info
router.put('/edit/:userId', userValidationRules, handleValidationErrors, async function (req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  try {
    const users = await readDatabase()
    const index = users.findIndex(u => u.id === req.params.userId)

    if (index !== -1) {
      users[index] = req.body
      await fs.writeFile(datasetPath, JSON.stringify(users, null, 2))
      res.status(201).send('User updated successfully')

    } else {
      const err = createError(404, 'User not found')
      res.status(404).render("error", { error: err, date: d })
    }

  } catch (err) {
    res.status(500).render("error", { error: err, date: d })
  }
})

// DELETE user
router.delete('/delete/:userId', async function (req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  try {
    const users = await readDatabase()
    const index = users.findIndex(u => u.id === req.params.userId)

    if (index !== -1) {
      users.splice(index, 1)
      await fs.writeFile(datasetPath, JSON.stringify(users, null, 2))
      res.status(204).send('User deleted successfully')
    } else {
      const err = createError(404, 'User not found')
      res.status(404).render("error", { error: err, date: d })
    }

  } catch (err) {
    res.status(500).render("error", { error: err, date: d })
  }
})

// GET user details
router.get(/\/[a-zA-Z0-9]{16}$/, async function (req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  try {
    const users = await readDatabase()
    const userId = req.url.substring(1)
    const user = users.find(u => u.id === userId)

    if (user) {
      res.status(200).render("userDetails", { "user": user, "date": d })
      console.log("tentei dar render")
    } else {
      const err = createError(404, 'User not found')
      res.status(404).render("error", { error: err, date: d })
    }

  } catch (err) {
    res.status(500).render("error", { error: err, date: d })
  }
})

module.exports = router
