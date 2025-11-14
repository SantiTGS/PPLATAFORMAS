import Link from "next/link";

export default function MyTrips() {
  return (
    <div className="my-trips-container">
      <header>
        <h1>My Trips</h1>
      </header>

      <div className="trip-list">
        <div className="trip-item">
          <h2>Campus → University Javeriana</h2>
          <p>Hour: 7:30 AM</p>
          <p>Status: Confirmado</p>

          <Link href="/cancelar-viaje" className="btn btn-secunadary">
            Cancel a trip
          </Link> 
        </div>

        <div className="trip-item">
          <h2>Campus → University Javeriana</h2>
          <p>Hour: 8:00 AM</p>
          <p>Status: Finalizado</p>
        </div>
      </div>

      <Link href="/available-quotas" className="btn btn-primary">
        Back to available rides
      </Link>
      
    </div>
  );
}
