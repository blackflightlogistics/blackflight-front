import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Rastreamento from "./pages/Rastreamento";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import Clientes from "./pages/admin/Clientes";
import Encomendas from "./pages/admin/Encomendas";
import Remessas from "./pages/admin/Remessas";
import RemessaDetalhes from "./pages/admin/RemessaDetalhes";
import Configuracoes from "./pages/admin/Configuracoes";
import NovaEncomenda from "./pages/admin/NovaEncomenda";
import EncomendaPagamento from "./pages/admin/EncomendaPagamento";
import Etiquetas from "./pages/admin/Etiquetas";
import Leitor from "./pages/admin/Leitor";
import RemessaNova from "./pages/admin/RemessaNova";

import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Site público */}
          <Route path="/" element={<Home />} />
          <Route path="/rastreamento" element={<Rastreamento />} />

          {/* Login público */}
          <Route path="/admin/login" element={<Login />} />

          {/* Área privada /admin */}
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/clientes"
            element={
              <PrivateRoute>
                <Clientes />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/remessas"
            element={
              <PrivateRoute>
                <Remessas />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/remessas/:id"
            element={
              <PrivateRoute>
                <RemessaDetalhes />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/remessas/nova"
            element={
              <PrivateRoute>
                <RemessaNova />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/configuracoes"
            element={
              <PrivateRoute>
                <Configuracoes />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/encomendas"
            element={
              <PrivateRoute>
                <Encomendas />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/encomendas/nova"
            element={
              <PrivateRoute>
                <NovaEncomenda />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/encomendas/:id/pagamento"
            element={
              <PrivateRoute>
                <EncomendaPagamento />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/encomendas/:id/etiquetas"
            element={
              <PrivateRoute>
                <Etiquetas />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/leitor"
            element={
              <PrivateRoute>
                <Leitor />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
