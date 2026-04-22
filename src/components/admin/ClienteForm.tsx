import { useState } from "react";
import { useLanguage } from "../../context/useLanguage";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export type ClienteFormData = {
  id?: string;
  name: string;
  last_name: string;
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
    last_name: initialData?.last_name || "",
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
    setForm({
      name: "",
      last_name: "",
      phone_number: "",
      email: "",
      street: "",
      number: "",
      neighborhood: "",
      city: "",
      state: "",
      cep: "",
      country: "",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-100 p-4 rounded space-y-4 mb-6"
    >
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
          name="last_name"
          placeholder={t.form_sobrenome}
          required
          value={form.last_name}
          onChange={handleChange}
          className="p-2 border rounded"
        />

        {/* TELEFONE COM PHONE INPUT */}
        <PhoneInput
          country={"br"}
          value={form.phone_number}
          onChange={(value) =>
            setForm((prev) => ({ ...prev, phone_number: value }))
          }
          inputProps={{
            name: "phone_number",
            required: true,
          }}
          enableSearch
          containerClass="w-full !w-full h-12"
          inputClass="p-2 border rounded w-full !w-full h-12"
          buttonClass="border rounded-l !border-r-0 h-12"
          containerStyle={{ width: '100%', height: '48px' }}
          inputStyle={{ width: '100%', height: '48px' }}
          buttonStyle={{ height: '48px' }}
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
          value={form.street}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          name="number"
          placeholder={t.form_numero}
          value={form.number}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          name="neighborhood"
          placeholder={t.form_bairro}
          value={form.neighborhood}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          name="country"
          placeholder={t.form_pais}
          value={form.country}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          name="state"
          placeholder={t.form_estado}
          value={form.state}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          name="city"
          placeholder={t.form_cidade}
          value={form.city}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          name="cep"
          placeholder={t.form_cep}
          value={form.cep}
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
