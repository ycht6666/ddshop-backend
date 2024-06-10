import express from 'express'
const router = express.Router()

// Import helper to convert req.params to numbers
import { getIdParam } from '#db-helpers/db-tool.js'

// Import MySQL database connection
import db from '#configs/mysql.js'

// GET - Retrieve all comments
router.get('/', async (req, res) => {
  try {
    // Fetch all comments
    const [comments] = await db.query('SELECT * FROM article_comment')

    // Fetch total count of comments
    const [[{ count }]] = await db.query(
      'SELECT COUNT(*) AS count FROM article_comment'
    )

    return res.json({
      status: 'success',
      data: {
        total: count,
        comments,
      },
    })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return res
      .status(500)
      .json({ status: 'error', message: 'Failed to fetch comments' })
  }
})

// GET - Retrieve a single comment by ID
router.get('/:id', async (req, res) => {
  const id = getIdParam(req)

  try {
    const [comments] = await db.query(
      'SELECT * FROM article_comment WHERE article_id = ?',
      [id]
    )

    if (comments.length === 0) {
      return res
        .status(404)
        .json({ status: 'error', message: 'Comment not found' })
    }

    return res.json({ status: 'success', data: { comments } })
  } catch (error) {
    console.error('Error fetching comment:', error)
    return res
      .status(500)
      .json({ status: 'error', message: 'Failed to fetch comment' })
  }
})

// POST - Add a new comment
router.post('/', async (req, res) => {
  const { user_id, article_id, content } = req.body

  if (!user_id || !article_id || !content) {
    return res
      .status(400)
      .json({ status: 'error', message: 'Missing required fields' })
  }

  try {
    // Insert the new comment into the database
    const [result] = await db.query(
      'INSERT INTO article_comment (user_id, article_id, content) VALUES (?, ?, ?)',
      [user_id, article_id, content]
    )

    const commentId = result.insertId

    // Fetch the newly inserted comment
    const [[newComment]] = await db.query(
      'SELECT * FROM article_comment WHERE id = ?',
      [commentId]
    )

    return res
      .status(201)
      .json({ status: 'success', data: { comment: newComment } })
  } catch (error) {
    console.error('Error adding new comment:', error)
    return res
      .status(500)
      .json({ status: 'error', message: 'Failed to add new comment' })
  }
})

// DELETE - Delete a comment by ID
router.delete('/:id', async (req, res) => {
  const id = getIdParam(req)

  try {
    // Check if the comment exists
    const [existingComment] = await db.query(
      'SELECT * FROM article_comment WHERE id = ?',
      [id]
    )

    if (existingComment.length === 0) {
      return res
        .status(404)
        .json({ status: 'error', message: 'Comment not found' })
    }

    // Delete the comment from the database
    await db.query('DELETE FROM article_comment WHERE id = ?', [id])

    return res.json({
      status: 'success',
      message: 'Comment deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting comment:', error)
    return res
      .status(500)
      .json({ status: 'error', message: 'Failed to delete comment' })
  }
})

export default router
