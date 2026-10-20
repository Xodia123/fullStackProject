function EventCard({ event, onRsvp, onRemoveRsvp }) {
  return (
    <article className="event-card">
      <div className="event-details">
        <h2>{event.title}</h2>
        <p className="event-meta">{event.date} <span aria-hidden="true">·</span> {event.location}</p>
        <p>{event.description}</p>
        <p className="event-capacity">Capacity: {event.capacity}</p>
      </div>
      <button
        className="rsvp-button"
        type="button"
        onClick={() => event.isRsvped ? onRemoveRsvp(event.id) : onRsvp(event)}
      >
        {event.isRsvped ? 'Cancel RSVP' : 'RSVP'}
      </button>
    </article>
  )
}

export default EventCard
