import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, Users, Bike, Package } from 'lucide-react';
import ClientesManagement from './ClientesManagement';
import MotorizadosManagement from './MotorizadosManagement';
import PedidosManagement from './PedidosManagement';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'clientes' | 'motorizados' | 'pedidos'>('pedidos');

  const tabs = [
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'motorizados', label: 'Motorizados', icon: Bike },
    { id: 'pedidos', label: 'Pedidos', icon: Package }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Panel de Administración</h1>
              <p className="text-green-100 text-sm">Bienvenido, {user?.username}</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 bg-green-700 hover:bg-green-800 px-4 py-2 rounded-lg transition duration-200"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          {activeTab === 'clientes' && <ClientesManagement />}
          {activeTab === 'motorizados' && <MotorizadosManagement />}
          {activeTab === 'pedidos' && <PedidosManagement />}
        </div>
      </div>
    </div>
  );
}
