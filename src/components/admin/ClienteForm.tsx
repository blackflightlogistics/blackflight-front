import { useState } from "react";
import { useLanguage } from "../../context/useLanguage";

export type ClienteFormData = {
  id?: string;
  name: string;
  phone_number: string;
  email: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
  country: string;
};

type Props = {
  onSubmit: (cliente: ClienteFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<ClienteFormData>;
};

const ClienteForm = ({ onSubmit, onCancel, initialData }: Props) => {
  const { translations: t } = useLanguage();

  const [form, setForm] = useState<ClienteFormData>({
    name: initialData?.name || "",
    phone_number: initialData?.phone_number || "",
    email: initialData?.email || "",
    street: initialData?.street || "",
    number: initialData?.number || "",
    neighborhood: initialData?.neighborhood || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    cep: initialData?.cep || "",
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
      phone_number: "",
      email: "",
      street: "",
      number: "",
      neighborhood: "",
      city: "",
      state: "",
      cep: "",
      country: "Brazil",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded space-y-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="name"
          placeholder={t.form_nome}
          required
          value={form.name}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          name="phone_number"
          placeholder={t.form_telefone}
          required
          value={form.phone_number}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          name="email"
          placeholder={t.form_email}
          required
          type="email"
          value={form.email}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          name="street"
          placeholder={t.form_rua}
          required
          value={form.street}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          name="number"
          placeholder={t.form_numero}
          required
          value={form.number}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          name="neighborhood"
          placeholder={t.form_bairro}
          required
          value={form.neighborhood}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          name="city"
          placeholder={t.form_cidade}
          required
          value={form.city}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          name="state"
          placeholder={t.form_estado}
          required
          value={form.state}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          name="cep"
          placeholder={t.form_cep}
          required
          value={form.cep}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          name="country"
          placeholder={t.form_pais}
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
          {t.form_salvar_cliente}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded text-sm"
          >
            {t.form_cancelar}
          </button>
        )}
      </div>
    </form>
  );
};

export default ClienteForm;
