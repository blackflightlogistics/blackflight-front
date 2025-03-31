import Navbar from '../components/Navbar';

function Home() {
  return (
    <div>
      <Navbar />
      <main className="p-4">
        <h2 className="text-xl font-semibold">Bem-vindo ao sistema de envio de pacotes!</h2>
        <p className="mt-2 text-gray-700">Em breve mais informações aqui.</p>
      </main>
    </div>
  );
}

export default Home;
