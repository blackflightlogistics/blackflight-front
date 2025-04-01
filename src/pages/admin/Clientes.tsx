import { useEffect, useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import { clienteService, Cliente } from "../../services/clienteService";
import ClienteForm, { ClienteFormData } from "../../components/admin/ClienteForm";

function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    carregarClientes();
  }, []);

  const carregarClientes = async () => {
    const dados = await clienteService.listar();
    setClientes(dados);
  };

  const handleSalvarCliente = async (form: ClienteFormData) => {
    const endereco = `${form.rua}, ${form.numero} - ${form.bairro}, ${form.cidade} - ${form.estado}, ${form.cep}`;

    await clienteService.adicionar({
      nome: form.nome,
      telefone: form.telefone,
      email: form.email,
      endereco,
    });

    setFormVisible(false);
    carregarClientes();
  };

  return (
    <div className="h-screen overflow-hidden">
      {/* Sidebar fixa */}
      <div className="fixed top-0 left-0 h-screen w-64 bg-white border-r z-10">
        <Sidebar />
      </div>

      {/* Conteúdo principal com scroll */}
      <main className="ml-64 h-full overflow-y-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Clientes</h1>
          <button
            onClick={() => setFormVisible(!formVisible)}
            className="px-4 py-2 bg-black text-white rounded hover:opacity-80"
          >
            {formVisible ? "Cancelar" : "Novo Cliente"}
          </button>
        </div>

        {formVisible && (
          <ClienteForm
            onSubmit={handleSalvarCliente}
            onCancel={() => setFormVisible(false)}
          />
        )}

        {clientes.length === 0 ? (
          <p className="text-gray-600">Nenhum cliente cadastrado.</p>
        ) : (
          <ul className="space-y-2">
            {clientes.map((cliente) => (
              <li key={cliente.id} className="p-4 bg-white rounded shadow">
                <p><strong>{cliente.nome}</strong></p>
                <p>{cliente.email} | {cliente.telefone}</p>
                <p>{cliente.endereco}</p>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

export default Clientes;
