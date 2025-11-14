import Link from "next/link";
import Image from "next/image";

export default function AvailableQuotas() {
  return (
    <div className="available-container">
      <header className="header">
        <h1>Available Rides</h1>
      </header>

      <div className="rutas">
        <div className="ruta-card">
          <Image src="/car.png" alt="Carpool" width={60} height={60} />
          <div className="ruta-info">
            <h2>Campus → University Javeriana</h2>
            <p>Hour: 7:30 AM</p>
            <p>Available quotas: 3</p>
          </div>
          <Link href="/trip-details" className="btn btn-primary">
            View
          </Link>
        </div>

        <div className="ruta-card">
          <Image src="/car.png" alt="Carpool" width={60} height={60} />
          <div className="ruta-info">
            <h2>Campus → University Javeriana</h2>
            <p>Hour: 8:00 AM</p>
            <p>Available quotas: 1</p>
          </div>
          <Link href="/trip-details" className="btn btn-primary">
            View
          </Link>
        </div>
      </div>
    </div>
  );
}

