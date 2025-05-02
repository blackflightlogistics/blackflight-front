import { useEffect, useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import { clienteService, Cliente } from "../../services/clienteService";
import ClienteForm, {
  ClienteFormData,
} from "../../components/admin/ClienteForm";

function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [formVisible, setFormVisible] = useState(false);
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarClientes();
  }, []);

  const carregarClientes = async () => {
    setCarregando(true);
    const dados = await clienteService.listar();
    setClientes(dados);
    setCarregando(false);
  };

  const handleSalvarCliente = async (form: ClienteFormData) => {
    const endereco = {
      street: form.street,
      number: form.number,
      neighborhood: form.neighborhood,
      city: form.city,
      state: form.state,
      zipCode: form.zipCode,
      country: form.country, // ou ajustar conforme for
    };

    await clienteService.adicionar({
      name: form.name,
      phoneNumber: form.phoneNumber,
      email: form.email,
      address: endereco,
    });

    setFormVisible(false);
    carregarClientes();
  };

  return (
    <div className="flex min-h-screen">
      <div className="md:top-0 md:left-0 md:h-screen md:w-64 bg-black text-white border-r z-10">
        <button
          className="md:hidden fixed top-4 left-4 z-50 bg-black text-white px-4 py-2 rounded"
          onClick={() => setSidebarAberta(true)}
        >
          ☰ Menu
        </button>
        <Sidebar
          mobileAberta={sidebarAberta}
          onFechar={() => setSidebarAberta(false)}
        />
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#fcf7f1] pt-16 p-6">
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

        {carregando ? (
          <div className="flex justify-center items-center h-[300px]">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange border-t-transparent"></div>
          </div>
        ) : clientes.length === 0 ? (
          <p className="text-gray-600">Nenhum cliente cadastrado.</p>
        ) : (
          <ul className="space-y-4">
            {clientes.map((cliente) => (
              <li
                key={cliente.id}
                className="border border-orange bg-white p-4 rounded-md text-sm font-secondary"
              >
                <p>
                  <span className="font-bold">Nome:</span> {cliente.name}
                  <span className="font-bold ml-4">Contato:</span>{" "}
                  {cliente.phoneNumber}
                </p>
                <p className="mt-2">
                  <span className="font-bold">E-mail:</span> {cliente.email}
                </p>
                <p className="mt-2">
                  <span className="font-bold">Endereço:</span>{" "}
                  {cliente.address.street}, {cliente.address.number} -{" "}
                  {cliente.address.neighborhood}, {cliente.address.city} -{" "}
                  {cliente.address.state}, {cliente.address.zipCode}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Clientes;
