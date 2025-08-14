// src/pages/admin/ClienteEditar.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import {
  clienteService,
  Cliente,
  Address,
} from "../../services/clienteService";
import { useLanguage } from "../../context/useLanguage";
import PhoneInput from "react-phone-input-2";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

function ClienteEditar() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { translations: t } = useLanguage();

  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [modoEnderecoVisivel, setModoEnderecoVisivel] = useState(false);

  const [editandoEnderecoIndex, setEditandoEnderecoIndex] = useState<
    number | null
  >(null);
  const [enderecoTemp, setEnderecoTemp] = useState<Address | null>(null);

  const [loading, setLoading] = useState(false);

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
    try {
      setLoading(true);
      await clienteService.atualizar(cliente.id, cliente);
      navigate("/admin/clientes");
    } catch (error) {
      //{"params":{"last_name":["is required"]},"type":"eg:error:payload"}
      //tratar este erro
      if (error instanceof AxiosError) {
        if (error.response?.data.params.last_name) {
          toast.error("Erro ao salvar cliente adicione o sobrenome");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSalvarEndereco = () => {
    if (!cliente || !enderecoTemp) return;

    const novosEnderecos = [...cliente.adresses];
    if (editandoEnderecoIndex !== null) {
      novosEnderecos[editandoEnderecoIndex] = enderecoTemp;
    } else {
      novosEnderecos.push(enderecoTemp);
    }

    setCliente({ ...cliente, adresses: novosEnderecos });
    setEditandoEnderecoIndex(null);
    setEnderecoTemp(null);
    setModoEnderecoVisivel(false);
  };

  const handleRemoverEndereco = async (index: number) => {
    if (!cliente) return;
    const confirm = window.confirm(t.confirmar_remover_endereco);
    if (!confirm) return;
    const enderecoRemovido = cliente.adresses[index].id;
    if (typeof enderecoRemovido === "string") {
      setCliente((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          removed_adresses: [...prev.removed_adresses, enderecoRemovido],
          adresses: prev.adresses.filter((_, i) => i !== index),
        };
      });
    }
  };

  const handleEditarEndereco = (index: number) => {
    if (!cliente) return;
    setEditandoEnderecoIndex(index);
    setEnderecoTemp(cliente.adresses[index]);
    setModoEnderecoVisivel(true);
  };

  const handleAdicionarEndereco = () => {
    setEditandoEnderecoIndex(null);
    setEnderecoTemp({
      id: "",
      street: "",
      number: "",
      neighborhood: "",
      city: "",
      state: "",
      cep: "",
      country: "",
    });
    setModoEnderecoVisivel(true);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        mobileAberta={sidebarAberta}
        onFechar={() => setSidebarAberta(false)}
      />

      <main className="flex-1 overflow-y-auto p-6 pt-20 bg-[#fcf7f1] space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold font-primary">
            {t.editar_cliente}
          </h1>
          <button
            onClick={() => navigate("/admin/clientes")}
            className="bg-orange text-white px-4 py-2 rounded hover:opacity-90 font-secondary text-sm"
          >
            {t.voltar_para_listagem}
          </button>
        </div>

        {carregando || !cliente ? (
          <div className="flex justify-center pt-40 h-screen ">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange border-t-transparent"></div>
          </div>
        ) : (
          <>
            <div className="space-y-4 bg-white p-4 rounded border border-orange">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={cliente.name}
                  onChange={(e) =>
                    setCliente({ ...cliente, name: e.target.value })
                  }
                  placeholder={t.form_nome}
                  className="p-2 border rounded"
                />
                <input
                  type="text"
                  value={cliente.last_name}
                  onChange={(e) =>
                    setCliente({ ...cliente, last_name: e.target.value })
                  }
                  placeholder={t.form_sobrenome}
                  className="p-2 border rounded"
                />
                <input
                  type="email"
                  value={cliente.email}
                  onChange={(e) =>
                    setCliente({ ...cliente, email: e.target.value })
                  }
                  placeholder={t.form_email}
                  className="p-2 border rounded"
                />
                <PhoneInput
                  country={"br"}
                  value={cliente.phone_number}
                  onChange={(e) => setCliente({ ...cliente, phone_number: e })}
                  inputProps={{
                    name: "phone_number",
                    required: true,
                  }}
                  enableSearch
                  inputClass="p-2 border rounded w-100"
                  containerStyle={{ width: "300px" }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="font-bold font-primary text-lg">{t.enderecos}</h2>

              {cliente.adresses.map((addr, index) => (
                <div
                  key={index}
                  className="border border-orange rounded p-4 bg-white"
                >
                  <p>
                    {addr.street}, {addr.number} - {addr.neighborhood},{" "}
                    {addr.city} - {addr.state}, {addr.cep}, {addr.country}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleEditarEndereco(index)}
                      className="px-4 py-2 bg-orange text-white rounded"
                    >
                      {t.editar}
                    </button>
                    <button
                      onClick={() => handleRemoverEndereco(index)}
                      className="px-4 py-2 bg-grey text-white rounded"
                    >
                      {t.remover}
                    </button>
                  </div>
                </div>
              ))}

              {modoEnderecoVisivel && enderecoTemp && (
                <div className="border border-orange rounded p-4 bg-white mt-4">
                  <div className="grid md:grid-cols-3 gap-2">
                    <input
                      value={enderecoTemp.street || ""}
                      onChange={(e) =>
                        setEnderecoTemp({
                          ...enderecoTemp,
                          street: e.target.value,
                        })
                      }
                      placeholder={t.form_rua}
                      className="p-2 border rounded"
                    />
                    <input
                      value={enderecoTemp.number || ""}
                      onChange={(e) =>
                        setEnderecoTemp({
                          ...enderecoTemp,
                          number: e.target.value,
                        })
                      }
                      placeholder={t.form_numero}
                      className="p-2 border rounded"                      
                    />
                    <input
                      value={enderecoTemp.neighborhood || ""}
                      onChange={(e) =>
                        setEnderecoTemp({
                          ...enderecoTemp,
                          neighborhood: e.target.value,
                        })
                      }
                      placeholder={t.form_bairro}
                      className="p-2 border rounded"
                    />
                    <input
                      value={enderecoTemp.city || ""}
                      onChange={(e) =>
                        setEnderecoTemp({
                          ...enderecoTemp,
                          city: e.target.value,
                        })
                      }
                      placeholder={t.form_cidade}
                      className="p-2 border rounded"
                    />
                    <input
                      value={enderecoTemp.state || ""}
                      onChange={(e) =>
                        setEnderecoTemp({
                          ...enderecoTemp,
                          state: e.target.value,
                        })
                      }
                      placeholder={t.form_estado}
                      className="p-2 border rounded"
                    />
                    <input
                      value={enderecoTemp.cep || ""}
                      onChange={(e) =>
                        setEnderecoTemp({
                          ...enderecoTemp,
                          cep: e.target.value,
                        })
                      }
                      placeholder={t.form_cep}
                      className="p-2 border rounded"
                    />
                    <input
                      value={enderecoTemp.country}
                      onChange={(e) =>
                        setEnderecoTemp({
                          ...enderecoTemp,
                          country: e.target.value,
                        })
                      }
                      placeholder={t.form_pais}
                      className="p-2 border rounded"
                    />
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={handleSalvarEndereco}
                      className="px-4 py-2 bg-orange text-white rounded"
                    >
                      {t.salvar_endereco}
                    </button>
                    <button
                      onClick={() => {
                        setEditandoEnderecoIndex(null);
                        setEnderecoTemp(null);
                        setModoEnderecoVisivel(false);
                      }}
                      className="px-4 py-2 bg-gray-500 text-white rounded"
                    >
                      {t.form_cancelar}
                    </button>
                  </div>
                </div>
              )}

              {!modoEnderecoVisivel && (
                <button
                  onClick={handleAdicionarEndereco}
                  className="mt-4 px-4 py-2 bg-orange text-white rounded"
                >
                  {t.adicionar_endereco}
                </button>
              )}
            </div>

            <button
              onClick={atualizarCliente}
              className="mt-6 bg-orange text-white px-6 py-3 rounded hover:opacity-90"
            >
              {loading ? (
                <div className="animate-spin mx-12 rounded-full h-6 w-6 border-4 border-white border-t-transparent"></div>
              ) : (
                t.salvar_alteracoes
              )}
            </button>
          </>
        )}
      </main>
    </div>
  );
}

export default ClienteEditar;
