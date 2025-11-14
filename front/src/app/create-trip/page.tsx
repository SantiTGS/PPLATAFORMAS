"use client";
import { useState } from "react";
import Link from "next/link";

// ✅ Definimos los tipos válidos de ciudades
type Ciudad = "Palmira" | "Cali";

// ✅ Definimos el mapa de zonas por ciudad
const zonasPorCiudad: Record<Ciudad, string[]> = {
  Palmira: ["Llanogrande", "Unicentro"],
  Cali: ["Chipichape", "Unicentro"],
};

export default function SeleccionarCiudad() {
  const [origen, setOrigen] = useState<Ciudad | "">("");
  const [zona, setZona] = useState("");
  const [fecha, setFecha] = useState("");

  return (
    <main className="contenedor-ciudad">
      <h1 className="titulo">City selection</h1>

      <form className="formulario">
        {/* Ciudad de origen */}
        <div className="campo">
          <label htmlFor="origen">Place of origin</label>
          <select
            id="origen"
            value={origen}
            onChange={(e) => {
              setOrigen(e.target.value as Ciudad);
              setZona(""); // reset al cambiar de ciudad
            }}
            required
          >
            <option value="">Select city</option>
            <option value="Palmira">Palmira</option>
            <option value="Cali">Cali</option>
          </select>
        </div>

        {/* Zona dentro de la ciudad */}
        {origen && (
          <div className="campo">
            <label htmlFor="zona">Zone</label>
            <select
              id="zona"
              value={zona}
              onChange={(e) => setZona(e.target.value)}
              required
            >
              <option value="">Select area</option>
              {zonasPorCiudad[origen].map((z: string) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Universidad de destino */}
        <div className="campo">
          <label htmlFor="destino">Destination university</label>
          <select id="destino" name="destino" required>
            <option value="">Select university</option>
            <option value="Autónoma">Autónoma</option>
            <option value="Javeriana">Javeriana</option>
            <option value="ICESI">ICESI</option>
          </select>
        </div>

        {/* Fecha */}
        <div className="campo">
          <label htmlFor="fecha">Date</label>
          <input
            type="date"
            id="fecha"
            name="fecha"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
          />
        </div>

        {/*fecha*/ }
        <div className="campo">
            <label htmlFor="hora">Hour</label>
            <input type="time" id="hora" name="hora" required />
        </div>

        {/* Botón */}
        <Link href="/driver-trips" className="boton-navegar">
          Create trip
        </Link>
      </form>
    </main>
  );
}
