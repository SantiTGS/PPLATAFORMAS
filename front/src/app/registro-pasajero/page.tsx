import Link from "next/link";

export default function RegistroConductor() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white text-gray-900 p-6">
      <div className="container text-center max-w-md">
        
        {/* Imagen */}
        <img src="/app.png" alt="Driver" className="w-40 mx-auto mb-4" />

        {/* Divider */}
        <div className="flex items-center mb-6">
          <hr className="flex-grow border-gray-300" />
          <span className="px-1 text-gray-500 text-sm"></span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Botones sociales */}
        <button className="btn btn-google w-full mb-3">Continue with Google</button>
        <button className="btn btn-facebook w-full mb-6">Continue with Facebook</button>

        {/* Divider */}
        <div className="flex items-center mb-6">
          <hr className="flex-grow border-gray-300" />
          <span className="px-2 text-gray-500 text-sm">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Formulario */}
        <form className="space-y-4">
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <button type="submit" className="btn btn-primary w-full">
            Continue
          </button>
        </form>

        {/* Link para login */}
        <p className="text-sm mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
