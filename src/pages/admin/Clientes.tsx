import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import { clienteService, Cliente } from "../../services/clienteService";
import ClienteForm, { ClienteFormData } from "../../components/admin/ClienteForm";
import { formatarLinkWhatsapp } from "../../utils/formatarLinkWhatsapp";
import { useLanguage } from "../../context/useLanguage";

function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [formVisible, setFormVisible] = useState(false);
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();
  const { translations: t } = useLanguage();

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
      cep: form.cep,
      country: form.country,
    };

    await clienteService.adicionar({
      name: form.name,
      phone_number: form.phone_number,
      email: form.email,
      adresses: [endereco],
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
          ☰ {t.menu}
        </button>
        <Sidebar mobileAberta={sidebarAberta} onFechar={() => setSidebarAberta(false)} />
      </div>

      <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#fcf7f1] pt-16 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold font-primary">{t.client_title}</h1>
          <button
            onClick={() => setFormVisible(!formVisible)}
            className="bg-orange text-white px-4 py-2 rounded hover:opacity-90 font-secondary text-sm"
          >
            {formVisible ? t.cancelar : t.novo_cliente}
          </button>
        </div>

        {formVisible && (
          <ClienteForm onSubmit={handleSalvarCliente} onCancel={() => setFormVisible(false)} />
        )}

        {carregando ? (
          <div className="flex justify-center items-center h-[300px]">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange border-t-transparent"></div>
          </div>
        ) : clientes.length === 0 ? (
          <p className="text-gray-600">{t.nenhum_cliente}</p>
        ) : (
          <ul className="space-y-4">
            {clientes.map((cliente) => (
              <li
                key={cliente.id}
                className="border border-orange bg-white p-4 rounded-md text-sm font-secondary"
              >
                <p>
                  <span className="font-bold">{t.nome}:</span> {cliente.name}
                  <span className="font-bold ml-4">{t.contato}: </span>
                  {formatarLinkWhatsapp(cliente.phone_number, { icon: true })}
                </p>
                <p className="mt-2">
                  <span className="font-bold">E-mail:</span> {cliente.email}
                </p>
                <div className="mt-2 space-y-1">
                  <span className="font-bold">{t.enderecos}:</span>
                  {cliente.adresses.length === 0 ? (
                    <p className="text-gray-600">{t.nenhum_endereco}</p>
                  ) : (
                    <ul className="ml-4 list-disc">
                      {cliente.adresses.map((endereco, idx) => (
                        <li key={idx}>
                          {endereco.number} - {endereco.street} - {endereco.neighborhood} - 
                          {endereco.city} - {endereco.state} - {endereco.country} {endereco.cep}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="mt-4">
                  <button
                    onClick={() => navigate(`/admin/clientes/${cliente.id}/editar`)}
                    className="bg-orange text-white px-4 py-2 rounded hover:opacity-90 font-secondary text-sm"
                  >
                    {t.editar}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Clientes;
