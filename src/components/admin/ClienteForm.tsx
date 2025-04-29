import { useState } from "react";

export type ClienteFormData = {
  name: string;
  phoneNumber: string;
  email: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
};

type Props = {
  onSubmit: (cliente: ClienteFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<ClienteFormData>;
};

const ClienteForm = ({ onSubmit, onCancel, initialData }: Props) => {
  const [form, setForm] = useState<ClienteFormData>({
    name: initialData?.name || "",
    phoneNumber: initialData?.phoneNumber || "",
    email: initialData?.email || "",
    street: initialData?.street || "",
    number: initialData?.number || "",
    neighborhood: initialData?.neighborhood || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    zipCode: initialData?.zipCode || "",
    country: initialData?.country || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
    setForm({
      name: "",
      phoneNumber: "",
      email: "",
      street: "",
      number: "",
      neighborhood: "",
      city: "",
      state: "",
      zipCode: "",
      country: "Brazil",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded space-y-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="name"
          placeholder="Nome"
          required
          value={form.name}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          name="phoneNumber"
          placeholder="Telefone"
          required
          value={form.phoneNumber}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          name="email"
          placeholder="E-mail"
          required
          type="email"
          value={form.email}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          name="street"
          placeholder="Rua"
          required
          value={form.street}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          name="number"
          placeholder="Número"
          required
          value={form.number}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          name="neighborhood"
          placeholder="Bairro"
          required
          value={form.neighborhood}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          name="city"
          placeholder="Cidade"
          required
          value={form.city}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          name="state"
          placeholder="Estado"
          required
          value={form.state}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          name="zipCode"
          placeholder="CEP"
          required
          value={form.zipCode}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          name="country"
          placeholder="País"
          required
          value={form.country}
          onChange={handleChange}
          className="p-2 border rounded"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-orange text-white px-4 py-2 rounded hover:opacity-90 font-secondary text-sm"
        >
          Salvar Cliente
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded text-sm"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default ClienteForm;
