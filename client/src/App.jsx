import { useEffect, useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import EventCard from './EventCard.jsx'
import './App.css'

function App() {
  const [events, setEvents] = useState([])
  const [rsvps, setRsvps] = useState([])
  const [studentName, setStudentName] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()

    async function loadData() {
      try {
        const [eventsResponse, rsvpsResponse] = await Promise.all([
          fetch('/api/events', { signal: controller.signal }),
          fetch('/api/rsvps', { signal: controller.signal }),
        ])

        if (!eventsResponse.ok || !rsvpsResponse.ok) {
          throw new Error('Unable to load events and RSVPs.')
        }

        const [loadedEvents, loadedRsvps] = await Promise.all([
          eventsResponse.json(),
          rsvpsResponse.json(),
        ])
        setEvents(loadedEvents)
        setRsvps(loadedRsvps)
      } catch (loadError) {
        if (!controller.signal.aborted) {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load events and RSVPs.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    loadData()
    return () => controller.abort()
  }, [])

  async function addRsvp(event) {
    setError('')

    try {
      const response = await fetch('/api/rsvps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_id: event.id, student_name: studentName.trim() }),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Unable to save your RSVP.')
      }

      const createdRsvp = await response.json()
      setRsvps((currentRsvps) => [...currentRsvps, createdRsvp])
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to save your RSVP.')
    }
  }

  async function removeRsvp(rsvpId) {
    setError('')

    try {
      const response = await fetch(`/api/rsvps/${rsvpId}`, { method: 'DELETE' })
      if (!response.ok) {
        throw new Error('Unable to remove your RSVP.')
      }

      setRsvps((currentRsvps) => currentRsvps.filter((rsvp) => rsvp.id !== rsvpId))
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to remove your RSVP.')
    }
  }

  const myRsvps = rsvps.filter(
    (rsvp) => rsvp.student_name.toLowerCase() === studentName.trim().toLowerCase(),
  )

  return (
    <div className="app">
      <header className="site-header">
        <nav className="site-nav" aria-label="Main navigation">
          <Link className="nav-link" to="/">
            Home
          </Link>
          <Link className="nav-link" to="/rsvps">
            My RSVPs
          </Link>
        </nav>
      </header>

      <main className="page-content">
        <label className="student-name">
          Your name
          <input
            type="text"
            value={studentName}
            onChange={(event) => setStudentName(event.target.value)}
            placeholder="Enter your name to RSVP"
          />
        </label>
        {error && <p className="error-message" role="alert">{error}</p>}
        <Routes>
          <Route
            path="/"
            element={
              <section>
                <h1>Home</h1>
                <p className="page-intro">Find something happening on campus and save your spot.</p>
                {isLoading ? (
                  <p>Loading events…</p>
                ) : (
                  <div className="event-grid">
                    {events.map((event) => (
                    <EventCard
                        key={event.id}
                        event={{
                          ...event,
                          isRsvped: myRsvps.some((rsvp) => rsvp.event_id === event.id),
                        }}
                        canRsvp={Boolean(studentName.trim())}
                        onRsvp={addRsvp}
                      />
                    ))}
                  </div>
                )}
              </section>
            }
          />
          <Route
            path="/rsvps"
            element={
              <section>
                <h1>My RSVPs</h1>
                {!studentName.trim() ? (
                  <p className="empty-state">Enter your name above to see your RSVPs.</p>
                ) : myRsvps.length > 0 ? (
                  <div className="event-grid">
                    {myRsvps.map((rsvp) => {
                      const event = events.find((item) => item.id === rsvp.event_id)
                      return event ? (
                        <EventCard
                          key={rsvp.id}
                          event={{ ...event, isRsvped: true }}
                          canRsvp={false}
                          onRsvp={addRsvp}
                          rsvpId={rsvp.id}
                          onRemove={removeRsvp}
                        />
                      ) : null
                    })}
                  </div>
                ) : (
                  <p className="empty-state">You haven’t RSVP’d to any events yet. Browse Home to find one.</p>
                )}
              </section>
            }
          />
          <Route
            path="*"
            element={
              <section>
                <h1>Page not found</h1>
                <p className="page-intro">That page doesn’t exist.</p>
              </section>
            }
          />
        </Routes>
      </main>
    </div>
  )
}

export default App
