import { useEffect, useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import { configService } from "../../services/configService";
import { useLanguage } from "../../context/useLanguage";
import DecimalMoneyInput from "../../components/form/DecimalMoneyInput";
import { toast } from "react-toastify";

const Configuracoes = () => {
  const [precoPorQuilo, setPrecoPorQuilo] = useState("");
  const [precoSeguro, setPrecoSeguro] = useState("");
  const [adicionalExpresso, setAdicionalExpresso] = useState("");
  const [valorDolar, setValorDolar] = useState("");
  const [cambioTaxa, setCambioTaxa] = useState("");
  const [cafValue, setCafValue] = useState("");

  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const { changeLanguage, language, translations: t } = useLanguage();

  useEffect(() => {
    const carregarConfiguracoes = async () => {
      const config = await configService.buscar();
      setPrecoPorQuilo(config.amountPerKg);
      setPrecoSeguro(config.insurancePerc);
      setAdicionalExpresso(config.expressAmount);
      setCambioTaxa(config.cambio_tax ?? "0.00");
      setValorDolar(config.dollar_value?? "0.00");
      setCafValue(config.caf_value?? "0.00");
      setCarregando(false);
    };
    carregarConfiguracoes();
  }, []);

  const salvar = async () => {
try{
      await configService.atualizar({
      amount_per_kg: precoPorQuilo,
      insurance_perc: precoSeguro,
      express_amount: adicionalExpresso,
      cambio_tax: cambioTaxa,
      dollar_value: valorDolar,
      cfa: cafValue,
    });
    toast.success(t.configuracao_salva_sucesso);
} catch (error) {
  console.error("Erro ao salvar configuração:", error);
    toast.error(t.erro_salvar_configuracao);
}
  };

  if (carregando) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#fcf7f1]">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-black text-white px-4 py-2 rounded"
        onClick={() => setSidebarAberta(true)}
      >
        ☰ Menu
      </button>

      <Sidebar
        mobileAberta={sidebarAberta}
        onFechar={() => setSidebarAberta(false)}
      />

      <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#fcf7f1] pt-16 p-6 space-y-6">
        <h1 className="text-2xl font-bold font-primary">
          {t.configuracoes_do_sistema}
        </h1>
        {carregando ? (
          <div className="flex justify-center items-center h-screen bg-[#fcf7f1]">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange border-t-transparent"></div>
          </div>
        ) : (
          <>
            <div className="space-y-4 bg-white p-4 max-w-xl rounded border border-orange">
              <div>
                <label className="block text-sm font-medium font-secondary mb-1">
                  {t.preco_por_quilo}
                </label>

                <DecimalMoneyInput
                  value={precoPorQuilo}
                  onChange={(val) => setPrecoPorQuilo(val)}
                  placeholder={t.valor_declarado}
                  decimalPlaces={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium font-secondary mb-1">
                  {t.percentual_seguro}
                </label>

                <DecimalMoneyInput
                  value={precoSeguro}
                  onChange={(val) => setPrecoSeguro(val)}
                  placeholder={t.valor_declarado}
                  decimalPlaces={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium font-secondary mb-1">
                  {t.valor_adicional_expresso}
                </label>

                <DecimalMoneyInput
                  value={adicionalExpresso}
                  onChange={(val) => setAdicionalExpresso(val)}
                  placeholder={t.valor_declarado}
                  decimalPlaces={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium font-secondary mb-1">
                  {t.dollar_value}
                </label>

                <DecimalMoneyInput
                  value={valorDolar}
                  onChange={(val) => setValorDolar(val)}
                  placeholder={t.dollar_value}
                  decimalPlaces={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium font-secondary mb-1">
                  {t.taxa_cambio}
                </label>

                <DecimalMoneyInput
                  value={cambioTaxa}
                  onChange={(val) => setCambioTaxa(val)}
                  placeholder={t.taxa_cambio}
                  decimalPlaces={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium font-secondary mb-1">
                  {t.caf_value}
                </label>

                <DecimalMoneyInput
                  value={cafValue}
                  onChange={(val) => setCafValue(val)}
                  placeholder={t.caf_value}
                  decimalPlaces={2}
                />
              </div>

              {/* Botões de idioma */}
              <div className="flex flex-col gap-2 mt-6 pl-2">
                <p>{t.selecione_o_idioma}</p>
                <button
                  onClick={() => changeLanguage("EN")}
                  className={`text-sm text-left ${
                    language === "EN"
                      ? "text-orange font-semibold"
                      : "text-black"
                  } hover:text-orange`}
                >
                  🇺🇸 English
                </button>
                <button
                  onClick={() => changeLanguage("FR")}
                  className={`text-sm text-left ${
                    language === "FR"
                      ? "text-orange font-semibold"
                      : "text-black"
                  } hover:text-orange`}
                >
                  🇫🇷 Français
                </button>
                <button
                  onClick={() => changeLanguage("ES")}
                  className={`text-sm text-left ${
                    language === "ES"
                      ? "text-orange font-semibold"
                      : "text-black"
                  } hover:text-orange`}
                >
                  🇪🇸 Español
                </button>
                <button
                  onClick={() => changeLanguage("PT")}
                  className={`text-sm text-left ${
                    language === "PT"
                      ? "text-orange font-semibold"
                      : "text-black"
                  } hover:text-orange`}
                >
                  🇧🇷 Português
                </button>
              </div>
            </div>

            <div>
              <button
                onClick={salvar}
                className="bg-orange text-white px-4 py-2 rounded hover:opacity-90 font-secondary"
              >
                {t.salvar_configuracao}
              </button>
            </div>

            
          </>
        )}
      </main>
    </div>
  );
};

export default Configuracoes;
