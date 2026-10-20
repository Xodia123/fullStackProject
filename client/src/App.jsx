import { useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import EventCard from './EventCard.jsx'
import events from './events.json'
import './App.css'

function App() {
  const [rsvps, setRsvps] = useState([])

  function addRsvp(event) {
    setRsvps((currentRsvps) =>
      currentRsvps.some((rsvp) => rsvp.id === event.id)
        ? currentRsvps
        : [...currentRsvps, event],
    )
  }

  function removeRsvp(eventId) {
    setRsvps((currentRsvps) => currentRsvps.filter((event) => event.id !== eventId))
  }

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
        <Routes>
          <Route
            path="/"
            element={
              <section>
                <h1>Home</h1>
                <p className="page-intro">Find something happening on campus and save your spot.</p>
                <div className="event-grid">
                  {events.map((event) => (
                    <EventCard
                      key={event.id}
                      event={{
                        ...event,
                        isRsvped: rsvps.some((rsvp) => rsvp.id === event.id),
                      }}
                      onRsvp={addRsvp}
                      onRemoveRsvp={removeRsvp}
                    />
                  ))}
                </div>
              </section>
            }
          />
          <Route
            path="/rsvps"
            element={
              <section>
                <h1>My RSVPs</h1>
                {rsvps.length > 0 ? (
                  <div className="event-grid">
                    {rsvps.map((event) => (
                      <EventCard
                        key={event.id}
                        event={{ ...event, isRsvped: true }}
                        onRsvp={addRsvp}
                        onRemoveRsvp={removeRsvp}
                      />
                    ))}
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
