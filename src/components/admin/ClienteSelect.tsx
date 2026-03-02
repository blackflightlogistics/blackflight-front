// src/components/admin/ClienteSelect.tsx
import { useRef, Fragment, useState, useEffect } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { Cliente } from "../../services/clienteService";

const DEBOUNCE_MS = 350;

type Props = {
  label: string;
  loadClientes: (search: string) => Promise<Cliente[]>;
  selectedId: string | undefined;
  selectedCliente?: Cliente | null;
  onSelect: (clienteId: string, cliente: Cliente) => void;
  onCadastrarNovo: () => void;
};

const ClienteSelect = ({
  label,
  loadClientes,
  selectedId,
  selectedCliente,
  onSelect,
  onCadastrarNovo,
}: Props) => {
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [comboboxAberto, setComboboxAberto] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      loadClientes(query)
        .then((data) => setOptions(data))
        .finally(() => setLoading(false));
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query, loadClientes]);

  const displayLabel = (id: string | "") => {
    if (selectedCliente && selectedCliente.id === id) {
      return `${selectedCliente.name} ${selectedCliente.last_name}`;
    }
    const cliente = options.find((c) => c.id === id);
    return cliente ? `${cliente.name} ${cliente.last_name}` : "";
  };

  const handleChange = (id: string) => {
    const cliente = options.find((c) => c.id === id);
    if (cliente) onSelect(id, cliente);
  };

  return (
    <div>
      <Combobox value={selectedId} onChange={handleChange}>
        <Combobox.Label className="block mb-1 text-sm font-medium">
          {label}
        </Combobox.Label>
        <div className="relative">
          <Combobox.Input
            ref={inputRef}
            className="w-full border border-gray-300 rounded p-2"
            displayValue={(id: string | "") => displayLabel(id)}
            onChange={(event) => {
              setQuery(event.target.value);
              setComboboxAberto(true);
            }}
            placeholder="Buscar por nome, e-mail ou telefone"
          />
          {comboboxAberto && (
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              afterLeave={() => setQuery("")}
            >
              <Combobox.Options className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded shadow-md max-h-60 overflow-auto">
                {loading ? (
                  <div className="px-4 py-3 text-sm text-gray-500">
                    Carregando...
                  </div>
                ) : options.length === 0 ? (
                  <div
                    onClick={() => {
                      onCadastrarNovo();
                      setComboboxAberto(false);
                      inputRef.current?.blur();
                    }}
                    className="cursor-pointer px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
                  >
                    Cadastrar novo cliente
                  </div>
                ) : (
                  options.map((cliente) => (
                    <Combobox.Option
                      key={cliente.id}
                      value={cliente.id}
                      className={({ active }) =>
                        `px-4 py-2 text-sm cursor-pointer ${
                          active ? "bg-gray-200" : ""
                        }`
                      }
                    >
                      <div className="font-semibold">{cliente.name?.toLowerCase()}</div>
                      <div className="text-xs text-gray-500">
                        {cliente.email} | {cliente.phone_number}
                      </div>
                    </Combobox.Option>
                  ))
                )}
              </Combobox.Options>
            </Transition>
          )}
        </div>
      </Combobox>
    </div>
  );
};

export default ClienteSelect;
