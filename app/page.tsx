import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-center p-8">
      <h1 className="text-4xl font-extrabold text-blue-900 mb-4">Hotel SaaS System</h1>
      <p className="text-gray-600 mb-8 max-w-2xl text-lg">
        Plataforma Multi-Tenant para gestão hoteleira. 
        Para acessar a página de reservas de um hotel cliente, utilize a rota específica.
      </p>
      
      <Link 
        href="/h/hotel-serpa" 
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
      >
        Acessar Hotel Serpa (Demonstração)
      </Link>
    </main>
  );
}