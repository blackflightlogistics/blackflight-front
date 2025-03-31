import { useState } from "react";

export type ClienteFormData = {
  nome: string;
  telefone: string;
  email: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
};

type Props = {
  onSubmit: (cliente: ClienteFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<ClienteFormData>;
};

const ClienteForm = ({ onSubmit, onCancel, initialData }: Props) => {
  const [form, setForm] = useState<ClienteFormData>({
    nome: initialData?.nome || "",
    telefone: initialData?.telefone || "",
    email: initialData?.email || "",
    rua: initialData?.rua || "",
    numero: initialData?.numero || "",
    bairro: initialData?.bairro || "",
    cidade: initialData?.cidade || "",
    estado: initialData?.estado || "",
    cep: initialData?.cep || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
    setForm({
      nome: "",
      telefone: "",
      email: "",
      rua: "",
      numero: "",
      bairro: "",
      cidade: "",
      estado: "",
      cep: "",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-100 p-4 rounded space-y-4 mb-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="nome" placeholder="Nome" required value={form.nome} onChange={handleChange} className="p-2 border rounded" />
        <input name="telefone" placeholder="Telefone" required value={form.telefone} onChange={handleChange} className="p-2 border rounded" />
        <input name="email" placeholder="E-mail" required type="email" value={form.email} onChange={handleChange} className="p-2 border rounded" />
        <input name="rua" placeholder="Rua" required value={form.rua} onChange={handleChange} className="p-2 border rounded" />
        <input name="numero" placeholder="Número" required value={form.numero} onChange={handleChange} className="p-2 border rounded" />
        <input name="bairro" placeholder="Bairro" required value={form.bairro} onChange={handleChange} className="p-2 border rounded" />
        <input name="cidade" placeholder="Cidade" required value={form.cidade} onChange={handleChange} className="p-2 border rounded" />
        <input name="estado" placeholder="Estado" required value={form.estado} onChange={handleChange} className="p-2 border rounded" />
        <input name="cep" placeholder="CEP" required value={form.cep} onChange={handleChange} className="p-2 border rounded" />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:opacity-90">
          Salvar Cliente
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default ClienteForm;
