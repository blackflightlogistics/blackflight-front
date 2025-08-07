import React from "react";
import { OrderFilters, EncomendaStatus, EncomendaPagamentoStatus, FormaPagamento } from "../../services/encomendaService";
import { useLanguage } from "../../context/useLanguage";

interface OrderFiltersProps {
  filtros: OrderFilters;
  onFiltrosChange: (filtros: OrderFilters) => void;
  onAplicarFiltros: () => void;
  onLimparFiltros: () => void;
}

const OrderFiltersComponent: React.FC<OrderFiltersProps> = ({
  filtros,
  onFiltrosChange,
  onAplicarFiltros,
  onLimparFiltros,
}) => {
  const { translations: t } = useLanguage();

  const handleFiltroChange = (key: keyof OrderFilters, value: string | EncomendaStatus | FormaPagamento | EncomendaPagamentoStatus) => {
    onFiltrosChange({
      ...filtros,
      [key]: value || undefined,
    });
  };

  return (
    <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-4 items-end">
        {/* Status da Encomenda */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-700 h-5 flex items-center">
            Status da Encomenda
          </label>
          <select
            value={filtros.status || ""}
            onChange={(e) => handleFiltroChange("status", e.target.value as EncomendaStatus)}
            className="h-10 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent bg-white"
          >
            <option value="">Todos</option>
            <option value="em_preparacao">{t.status_em_preparacao}</option>
            <option value="em_transito">{t.status_em_transito}</option>
            <option value="aguardando_retirada">{t.status_aguardando_retirada}</option>
            <option value="entregue">{t.status_entregue}</option>
            <option value="cancelada">{t.status_cancelada}</option>
          </select>
        </div>

        {/* Forma de Pagamento */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-700 h-5 flex items-center">
            Forma de Pagamento
          </label>
          <select
            value={filtros.payment_type || ""}
            onChange={(e) => handleFiltroChange("payment_type", e.target.value as FormaPagamento)}
            className="h-10 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent bg-white"
          >
            <option value="">Todos</option>
            <option value="a_vista">{t.forma_pagamento_a_vista}</option>
            <option value="parcelado">{t.forma_pagamento_parcelado}</option>
            <option value="na_retirada">{t.forma_pagamento_na_retirada}</option>
          </select>
        </div>

        {/* Data Inicial */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-700 h-5 flex items-center">
            Data Inicial
          </label>
          <input
            type="date"
            value={filtros.initial_date || ""}
            onChange={(e) => handleFiltroChange("initial_date", e.target.value)}
            className="h-10 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent"
          />
        </div>

        {/* Data Final */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-700 h-5 flex items-center">
            Data Final
          </label>
          <input
            type="date"
            value={filtros.final_date || ""}
            onChange={(e) => handleFiltroChange("final_date", e.target.value)}
            className="h-10 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent"
          />
        </div>

        {/* Status de Pagamento */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-700 h-5 flex items-center">
            Status de Pagamento
          </label>
          <select
            value={filtros.payment_status || ""}
            onChange={(e) => handleFiltroChange("payment_status", e.target.value as EncomendaPagamentoStatus)}
            className="h-10 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent bg-white"
          >
            <option value="">Todos</option>
            <option value="pago">Pago</option>
            <option value="parcial">Parcial</option>
            <option value="pendente">Pendente</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>

        {/* Tracking Code */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-700 h-5 flex items-center">
            Código de Rastreio
          </label>
          <input
            type="text"
            placeholder="Digite o código..."
            value={filtros.tracking_code || ""}
            onChange={(e) => handleFiltroChange("tracking_code", e.target.value)}
            className="h-10 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent"
          />
        </div>

        {/* Botão Aplicar */}
        <div className="flex flex-col space-y-2">
          <div className="h-5"></div>
          <button
            onClick={onAplicarFiltros}
            className="h-10 px-4 py-2 bg-orange text-white rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Aplicar Filtros
          </button>
        </div>

        {/* Botão Limpar */}
        <div className="flex flex-col space-y-2">
          <div className="h-5"></div>
          <button
            onClick={onLimparFiltros}
            className="h-10 px-4 py-2 bg-gray-500 text-white rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Limpar Filtros
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderFiltersComponent;