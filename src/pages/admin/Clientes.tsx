import { useEffect, useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import { clienteService, Cliente } from "../../services/clienteService";
import ClienteForm, { ClienteFormData } from "../../components/admin/ClienteForm";

function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [formVisible, setFormVisible] = useState(false);
  const [sidebarAberta, setSidebarAberta] = useState(false);

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
    <div className="flex min-h-screen">
      {/* Sidebar fixa */}
      <Sidebar mobileAberta={sidebarAberta} onFechar={() => setSidebarAberta(false)} />

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#fcf7f1] p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold font-primary">Clientes</h1>

          <button
            onClick={() => setFormVisible(!formVisible)}
            className="bg-orange text-white px-4 py-2 rounded hover:opacity-90 font-secondary text-sm"
          >
            {formVisible ? "Cancelar" : "Novo cliente"}
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
          <ul className="space-y-4">
            {clientes.map((cliente) => (
              <li
                key={cliente.id}
                className="border border-orange bg-white p-4 rounded-md text-sm font-secondary"
              >
                <p><span className="font-bold">Nome:</span> {cliente.nome}  <span className="font-bold ml-4">Contato:</span> {cliente.telefone}</p>
                <p className="mt-2"><span className="font-bold">E-mail:</span> {cliente.email}</p>
                <p className="mt-2"><span className="font-bold">Endereço:</span> {cliente.endereco}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Clientes;
