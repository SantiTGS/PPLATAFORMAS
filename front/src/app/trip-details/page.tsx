import Link from "next/link";
import Image from "next/image";

export default function TripDetails() {
  return (
    <div className="trip-details-container">
      <header>
        <h1>Trip Details</h1>
      </header>

      <div className="trip-card">
        <Image src="/route.png" alt="Route" width={100} height={100} />
        <h2>Campus  → University Javeriana</h2>
        <p>Driver: Juan Pérez</p>
        <p>Hour: 7:30 AM</p>
        <p>Available quotas: 3</p>
      </div>

      <button className="btn btn-primary">Reserve my seat</button>

      <Link href="/available-quotas" className="btn btn-secondary mt-3">
        Back
      </Link>
    </div>
  );
}
