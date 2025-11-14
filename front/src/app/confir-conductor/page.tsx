"use client";

import Link from "next/link";
import Image from "next/image";

export default function Confirmacion() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-center px-6">
      {/* Imagen del check */}
      <Image
        src="/check.png" 
        alt="Check icon"
        width={120}
        height={120}
        className="mb-6"
      />

      {/* Mensaje principal */}
      <h1 className="text-lg font-semibold text-gray-800 mb-2">
        Your account has been successfully create!!
      </h1>

      {/* Mensaje secundario */}
      <p className="text-gray-600 mb-8">
        Create your first trip
      </p>

      {/* Botones */}
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Link
          href="/create-trip" 
          className="bg-black text-white py-2 rounded-lg shadow-md hover:bg-gray-800 transition"
        >
          Continue
        </Link>

      </div>
    </div>
  );
}
