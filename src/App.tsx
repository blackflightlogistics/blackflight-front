import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Rastreamento from './pages/Rastreamento';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Clientes from './pages/admin/Clientes';
import Encomendas from './pages/admin/Encomendas';

function App() {
  return (
    <Router>
      <Routes>
        {/* Site público */}
        <Route path="/" element={<Home />} />
        <Route path="/rastreamento" element={<Rastreamento />} />

        {/* Admin */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/clientes" element={<Clientes />} />
        <Route path="/admin/encomendas" element={<Encomendas />} />
      </Routes>
    </Router>
  );
}

export default App;
