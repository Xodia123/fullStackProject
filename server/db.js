const path = require('node:path')
const Database = require('better-sqlite3')

const db = new Database(path.join(__dirname, 'events.sqlite'))

db.exec(`
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY,
    title TEXT,
    date TEXT,
    capacity INTEGER
  );

  CREATE TABLE IF NOT EXISTS rsvps (
    id INTEGER PRIMARY KEY,
    event_id INTEGER,
    student_name TEXT
  )
`)

const eventCount = db.prepare('SELECT COUNT(*) AS count FROM events').get().count

if (eventCount === 0) {
  const insertEvent = db.prepare(
    'INSERT INTO events (id, title, date, capacity) VALUES (?, ?, ?, ?)',
  )
  const seedEvents = db.transaction(() => {
    insertEvent.run(1, 'School Fall Fest', 'Oct 28', 200)
    insertEvent.run(2, 'Coding Contest', 'Nov 5', 50)
    insertEvent.run(3, 'Saturday Tutoring', 'Nov 12', 30)
  })

  seedEvents()
}

module.exports = db
