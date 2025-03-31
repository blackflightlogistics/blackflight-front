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
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
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
