// src/pages/admin/ClienteEditar.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import {
  clienteService,
  Cliente,
  Address,
} from "../../services/clienteService";

function ClienteEditar() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [modoEnderecoVisivel, setModoEnderecoVisivel] = useState(false);

  const [editandoEnderecoIndex, setEditandoEnderecoIndex] = useState<number | null>(null);
  const [enderecoTemp, setEnderecoTemp] = useState<Address | null>(null);

  useEffect(() => {
    if (id) {
      clienteService.buscarPorId(id).then((data) => {
        setCliente(data);
        setCarregando(false);
      });
    }
  }, [id]);

  const atualizarCliente = async () => {
    if (!cliente) return;
    await clienteService.atualizar(cliente.id, cliente);
    navigate("/admin/clientes");
  };

  const handleSalvarEndereco = () => {
    if (!cliente || !enderecoTemp) return;

    const novosEnderecos = [...cliente.addresses];
    if (editandoEnderecoIndex !== null) {
      novosEnderecos[editandoEnderecoIndex] = enderecoTemp;
    } else {
      novosEnderecos.push(enderecoTemp);
    }

    setCliente({ ...cliente, addresses: novosEnderecos });
    setEditandoEnderecoIndex(null);
    setEnderecoTemp(null);
    setModoEnderecoVisivel(false);
  };

  const handleRemoverEndereco = async (index: number) => {
    if (!cliente) return;
    const confirm = window.confirm("Tem certeza que deseja remover este endereço?");
    if (!confirm) return;

    const novosEnderecos = cliente.addresses.filter((_, i) => i !== index);
    const atualizado = await clienteService.atualizar(cliente.id, {
      ...cliente,
      addresses: novosEnderecos,
    });

    setCliente(atualizado);
  };

  const handleEditarEndereco = (index: number) => {
    if (!cliente) return;
    setEditandoEnderecoIndex(index);
    setEnderecoTemp(cliente.addresses[index]);
    setModoEnderecoVisivel(true);
  };

  const handleAdicionarEndereco = () => {
    setEditandoEnderecoIndex(null);
    setEnderecoTemp({
      street: "",
      number: "",
      neighborhood: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    });
    setModoEnderecoVisivel(true);
  };

  if (carregando || !cliente) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar mobileAberta={sidebarAberta} onFechar={() => setSidebarAberta(false)} />

      <main className="flex-1 p-6 pt-20 bg-[#fcf7f1] space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold font-primary">Editar Cliente</h1>
          <button
            onClick={() => navigate("/admin/clientes")}
            className="bg-orange text-white px-4 py-2 rounded hover:opacity-90 font-secondary text-sm"
          >
            Voltar para listagem
          </button>
        </div>

        <div className="space-y-4 bg-white p-4 rounded border border-orange">
          <div className="grid md:grid-cols-3 gap-4">
            <input
              type="text"
              value={cliente.name}
              onChange={(e) => setCliente({ ...cliente, name: e.target.value })}
              placeholder="Nome"
              className="p-2 border rounded"
            />
            <input
              type="email"
              value={cliente.email}
              onChange={(e) => setCliente({ ...cliente, email: e.target.value })}
              placeholder="E-mail"
              className="p-2 border rounded"
            />
            <input
              type="text"
              value={cliente.phoneNumber}
              onChange={(e) => setCliente({ ...cliente, phoneNumber: e.target.value })}
              placeholder="Telefone"
              className="p-2 border rounded"
            />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="font-bold font-primary text-lg">Endereços</h2>

          {cliente.addresses.map((addr, index) => (
            <div key={index} className="border border-orange rounded p-4 bg-white">
              <p>
                {addr.street}, {addr.number} - {addr.neighborhood}, {addr.city} - {addr.state},{" "}
                {addr.zipCode}, {addr.country}
              </p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleEditarEndereco(index)}
                  className="px-4 py-2 bg-orange text-white rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleRemoverEndereco(index)}
                  className="px-4 py-2 bg-grey text-white rounded"
                >
                  Remover
                </button>
              </div>
            </div>
          ))}

          {modoEnderecoVisivel && enderecoTemp && (
            <div className="border border-orange rounded p-4 bg-white mt-4">
              <div className="grid md:grid-cols-3 gap-2">
                <input
                  value={enderecoTemp.street}
                  onChange={(e) => setEnderecoTemp({ ...enderecoTemp, street: e.target.value })}
                  placeholder="Rua"
                  className="p-2 border rounded"
                />
                <input
                  value={enderecoTemp.number}
                  onChange={(e) => setEnderecoTemp({ ...enderecoTemp, number: e.target.value })}
                  placeholder="Número"
                  className="p-2 border rounded"
                />
                <input
                  value={enderecoTemp.neighborhood}
                  onChange={(e) =>
                    setEnderecoTemp({ ...enderecoTemp, neighborhood: e.target.value })
                  }
                  placeholder="Bairro"
                  className="p-2 border rounded"
                />
                <input
                  value={enderecoTemp.city}
                  onChange={(e) => setEnderecoTemp({ ...enderecoTemp, city: e.target.value })}
                  placeholder="Cidade"
                  className="p-2 border rounded"
                />
                <input
                  value={enderecoTemp.state}
                  onChange={(e) => setEnderecoTemp({ ...enderecoTemp, state: e.target.value })}
                  placeholder="Estado"
                  className="p-2 border rounded"
                />
                <input
                  value={enderecoTemp.zipCode}
                  onChange={(e) => setEnderecoTemp({ ...enderecoTemp, zipCode: e.target.value })}
                  placeholder="CEP"
                  className="p-2 border rounded"
                />
                <input
                  value={enderecoTemp.country}
                  onChange={(e) => setEnderecoTemp({ ...enderecoTemp, country: e.target.value })}
                  placeholder="País"
                  className="p-2 border rounded"
                />
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleSalvarEndereco}
                  className="px-4 py-2 bg-orange text-white rounded"
                >
                  Salvar endereço
                </button>
                <button
                  onClick={() => {
                    setEditandoEnderecoIndex(null);
                    setEnderecoTemp(null);
                    setModoEnderecoVisivel(false);
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {!modoEnderecoVisivel && (
            <button
              onClick={handleAdicionarEndereco}
              className="mt-4 px-4 py-2 bg-orange text-white rounded"
            >
              Adicionar novo endereço
            </button>
          )}
        </div>

        <button
          onClick={atualizarCliente}
          className="mt-6 bg-orange text-white px-6 py-3 rounded hover:opacity-90"
        >
          Salvar Alterações
        </button>
      </main>
    </div>
  );
}

export default ClienteEditar;
