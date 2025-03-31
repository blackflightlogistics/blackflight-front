import Sidebar from "../../components/admin/Sidebar";

function Dashboard() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Bem-vindo ao painel administrativo</h1>
        <p>Selecione uma opção no menu lateral para começar.</p>
      </main>
    </div>
  );
}

export default Dashboard;
