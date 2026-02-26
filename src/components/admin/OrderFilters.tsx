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

  const handleFiltroChange = (key: keyof OrderFilters, value: string | EncomendaStatus | FormaPagamento | EncomendaPagamentoStatus | undefined) => {
    onFiltrosChange({
      ...filtros,
      [key]: value || undefined,
    });
  };

  return (
    <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
        {/* Status da Encomenda */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-700 leading-snug">
            {t.status_encomenda}
          </label>
          <select
            value={filtros.status || ""}
            onChange={(e) => handleFiltroChange("status", e.target.value as EncomendaStatus)}
            className="h-10 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent bg-white"
          >
            <option value="">{t.filtros_todos}</option>
            <option value="em_preparacao">{t.status_em_preparacao}</option>
            <option value="em_transito">{t.status_em_transito}</option>
            <option value="aguardando_retirada">{t.status_aguardando_retirada}</option>
            <option value="entregue">{t.status_entregue}</option>
            <option value="cancelada">{t.status_cancelada}</option>
          </select>
        </div>

        {/* Forma de Pagamento */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-700 leading-snug">
            {t.forma_pagamento_label}
          </label>
          <select
            value={filtros.payment_type || ""}
            onChange={(e) => handleFiltroChange("payment_type", e.target.value as FormaPagamento)}
            className="h-10 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent bg-white"
          >
            <option value="">{t.filtros_todos}</option>
            <option value="a_vista">{t.forma_pagamento_a_vista}</option>
            <option value="parcelado">{t.forma_pagamento_parcelado}</option>
            <option value="na_retirada">{t.forma_pagamento_na_retirada}</option>
          </select>
        </div>

        {/* Data Inicial */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-700 leading-snug">
            {t.filtro_data_inicial}
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
          <label className="text-sm font-medium text-gray-700 leading-snug">
            {t.filtro_data_final}
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
          <label className="text-sm font-medium text-gray-700 leading-snug">
            {t.status_do_pagamento}
          </label>
          <select
            value={filtros.payment_status || ""}
            onChange={(e) => handleFiltroChange("payment_status", e.target.value as EncomendaPagamentoStatus)}
            className="h-10 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent bg-white"
          >
            <option value="">{t.filtros_todos}</option>
            <option value="pago">{t.pagamento_pago}</option>
            <option value="parcial">{t.pagamento_parcial}</option>
            <option value="pendente">{t.status_pendente}</option>
            <option value="cancelado">{t.pagamento_cancelado}</option>
          </select>
        </div>

        {/* Tracking Code */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-700 leading-snug">
            {t.codigo_rastreio}
          </label>
          <input
            type="text"
            placeholder={t.tracking_placeholder}
            value={filtros.tracking_code || ""}
            onChange={(e) => handleFiltroChange("tracking_code", e.target.value)}
            className="h-10 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent"
          />
        </div>
      </div>

      {/* Segunda linha: busca + botões */}
      <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-200">
        <input
          type="text"
          value={filtros.search || ""}
          onChange={(e) => handleFiltroChange("search", e.target.value)}
          placeholder={t.buscar}
          className="h-10 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent min-w-[200px] sm:min-w-[280px]"
        />
        <button
          onClick={onAplicarFiltros}
          className="h-10 px-4 py-2 bg-orange text-white rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
        >
          {t.aplicar_filtros}
        </button>
        <button
          onClick={onLimparFiltros}
          className="h-10 px-4 py-2 bg-gray-500 text-white rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
        >
          {t.limpar_filtros}
        </button>
      </div>
    </div>
  );
};

export default OrderFiltersComponent;