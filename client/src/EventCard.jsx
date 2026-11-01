function EventCard({ event, canRsvp, onRsvp, rsvpId, onRemove }) {
  return (
    <article className="event-card">
      <div className="event-details">
        <h2>{event.title}</h2>
        <p className="event-meta">{event.date}</p>
        {event.location && <p className="event-meta">{event.location}</p>}
        {event.description && <p>{event.description}</p>}
        <p className="event-capacity">Capacity: {event.capacity}</p>
      </div>
      <button
        className="rsvp-button"
        type="button"
        onClick={() => onRsvp(event)}
        disabled={!canRsvp || event.isRsvped}
      >
        {event.isRsvped ? 'RSVP’d' : 'RSVP'}
      </button>
      {onRemove && (
        <button
          className="rsvp-button remove-button"
          type="button"
          onClick={() => onRemove(rsvpId)}
        >
          Remove
        </button>
      )}
    </article>
  )
}

export default EventCard
