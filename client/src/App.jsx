import { useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import EventCard from './EventCard.jsx'
import events from './events.json'
import './App.css'

function Greeting({ name }) {
  return <p className="example-result">Hello, {name}!</p>
}

function GreetingExample() {
  return (
    <article className="example-card">
      <h2>Passing a prop</h2>
      <p>The parent passes <code>name="Ada"</code> to the child as a prop.</p>
      <Greeting name="Ada" />
    </article>
  )
}

function CounterExample() {
  const [count, setCount] = useState(0)

  return (
    <article className="example-card">
      <h2>Local state and re-renders</h2>
      <p>Count: <span className="counter">{count}</span></p>
      <button
        className="counter-button"
        type="button"
        onClick={() => setCount((currentCount) => currentCount + 1)}
      >
        Increment
      </button>
      <p className="example-explanation">
        Clicking queues a state update, so React renders this counter again with the new count.
        The state belongs to this component, so the click does not itself update the App component.
        A parent render can also render this component; in development, Strict Mode may invoke
        render an extra time to help find impure code.
      </p>
    </article>
  )
}

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
                <section className="learning-examples" aria-label="React examples">
                  <GreetingExample />
                  <CounterExample />
                </section>
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
