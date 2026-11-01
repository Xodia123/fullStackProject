const express = require('express')
const db = require('./db')

const app = express()

app.use(express.json())

app.get('/api/events', (req, res) => {
  const events = db.prepare('SELECT * FROM events ORDER BY id').all()
  res.json(events)
})

app.delete('/api/rsvps/:id', (req, res) => {
  db.prepare('DELETE FROM rsvps WHERE id = ?').run(req.params.id)
  res.sendStatus(200)
})

app.post('/api/rsvps', (req, res) => {
  const eventId = Number(req.body?.event_id)
  const studentName = req.body?.student_name

  if (
    !Number.isInteger(eventId) ||
    eventId < 1 ||
    typeof studentName !== 'string' ||
    !studentName.trim()
  ) {
    return res.status(400).json({ error: 'A valid event_id and student_name are required.' })
  }

  const event = db.prepare('SELECT id FROM events WHERE id = ?').get(eventId)
  if (!event) {
    return res.status(404).json({ error: 'Event not found.' })
  }

  const result = db
    .prepare('INSERT INTO rsvps (event_id, student_name) VALUES (?, ?)')
    .run(eventId, studentName.trim())
  const rsvp = db.prepare('SELECT * FROM rsvps WHERE id = ?').get(result.lastInsertRowid)

  res.status(201).json(rsvp)
})

app.get('/api/rsvps', (req, res) => {
  const rsvps = db.prepare('SELECT * FROM rsvps ORDER BY id').all()
  res.json(rsvps)
})

module.exports = app
