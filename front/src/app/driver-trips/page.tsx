"use client";
import Link from "next/link";

export default function DriverQuotas() {
  const quotas = [
    {
      ciudad: "Palmira",
      fecha: "3 AUGUST 2025",
      viajes: [
        { zona: "Unicentro", hora: "9:30" },
        { zona: "Javeriana", hora: "11:00" },
      ],
    },
    {
      ciudad: "Cali",
      fecha: "5 AUGUST 2025",
      viajes: [
        { zona: "Versalles", hora: "8:30" },
        { zona: "Icesi", hora: "10:00" },
      ],
    },
  ];

  return (
    <main className="driver-quotas-container">
      <h1 className="titulo">Your quotas</h1>

      <div className="quota-list">
        {quotas.map((q) => (
          <div key={q.ciudad} className="quota-card">
            <h2 className="quota-city">{q.ciudad}</h2>
            <p className="quota-date">{q.fecha}</p>

            {q.viajes.map((v, i) => (
              <div key={i} className="quota-info">
                <div className="quota-icon">📍</div>
                <p className="quota-zone">{v.zona}</p>
                <p className="quota-hour">{v.hora}</p>
              </div>
            ))}
          </div>
        ))}
      </div>

      <Link href="/create-trip" className="boton-navegar">
        + Create new quota
      </Link>
    </main>
  );
}
