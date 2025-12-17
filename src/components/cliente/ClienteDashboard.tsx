import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { pedidosAPI, clientesAPI } from '../../services/api';
import { LogOut, Plus, Package, CheckCircle } from 'lucide-react';

interface Pedido {
  _id: string;
  clienteId: { _id: string; nombre: string };
  motorizadoId?: { _id: string; nombre: string; placa: string };
  descripcion: string;
  clienteFinal: string;
  celularCliente: string;
  direccionEntrega: string;
  precio: number;
  estado: string;
  createdAt: string;
}

export default function ClienteDashboard() {
  const { user, logout } = useAuth();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    clienteId: '',
    descripcion: '',
    clienteFinal: '',
    celularCliente: '',
    direccionEntrega: '',
    precio: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [pedidosData, clientesData] = await Promise.all([
        pedidosAPI.getAll(),
        clientesAPI.getAll()
      ]);
      setPedidos(pedidosData);
      setClientes(clientesData.filter((c: any) => c.estado));
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await pedidosAPI.create(formData);
      await loadData();
      closeModal();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMarcarRecibido = async (pedidoId: string) => {
    if (!confirm('¿Confirmar que recibiste el pedido?')) return;

    try {
      await pedidosAPI.update(pedidoId, { estado: 'recibido' });
      await loadData();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const openModal = () => {
    setFormData({
      clienteId: '',
      descripcion: '',
      clienteFinal: '',
      celularCliente: '',
      direccionEntrega: '',
      precio: 0
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const getEstadoBadge = (estado: string) => {
    const colors: any = {
      pendiente: 'bg-yellow-100 text-yellow-800',
      asignado: 'bg-blue-100 text-blue-800',
      entregado: 'bg-purple-100 text-purple-800',
      recibido: 'bg-green-100 text-green-800',
      cancelado: 'bg-red-100 text-red-800'
    };
    return colors[estado] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Mis Pedidos</h1>
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Historial de Pedidos</h2>
          <button
            onClick={openModal}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition duration-200 shadow-md"
          >
            <Plus className="w-5 h-5" />
            Nuevo Pedido
          </button>
        </div>

        <div className="grid gap-4">
          {pedidos.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No tienes pedidos aún</p>
            </div>
          ) : (
            pedidos.map((pedido) => (
              <div key={pedido._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{pedido.clienteFinal}</h3>
                    <p className="text-sm text-gray-500">Cliente: {pedido.clienteId.nombre}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getEstadoBadge(pedido.estado)}`}>
                    {pedido.estado}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Descripción:</p>
                    <p className="text-sm font-medium text-gray-900">{pedido.descripcion}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Precio:</p>
                    <p className="text-sm font-medium text-gray-900">S/ {pedido.precio.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Celular:</p>
                    <p className="text-sm font-medium text-gray-900">{pedido.celularCliente}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Motorizado:</p>
                    <p className="text-sm font-medium text-gray-900">
                      {pedido.motorizadoId ? `${pedido.motorizadoId.nombre} (${pedido.motorizadoId.placa})` : 'Sin asignar'}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-500">Dirección de Entrega:</p>
                  <p className="text-sm font-medium text-gray-900">{pedido.direccionEntrega}</p>
                </div>

                {pedido.estado === 'entregado' && (
                  <button
                    onClick={() => handleMarcarRecibido(pedido._id)}
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition duration-200"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Marcar como Recibido
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">Crear Nuevo Pedido</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                <select
                  value={formData.clienteId}
                  onChange={(e) => setFormData({ ...formData, clienteId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Seleccionar cliente</option>
                  {clientes.map((cliente) => (
                    <option key={cliente._id} value={cliente._id}>{cliente.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción del Pedido</label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={3}
                  placeholder="Describe los productos o servicios del pedido"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cliente Final</label>
                  <input
                    type="text"
                    value={formData.clienteFinal}
                    onChange={(e) => setFormData({ ...formData, clienteFinal: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Nombre del destinatario"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Celular Cliente</label>
                  <input
                    type="text"
                    value={formData.celularCliente}
                    onChange={(e) => setFormData({ ...formData, celularCliente: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="999999999"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección de Entrega</label>
                <textarea
                  value={formData.direccionEntrega}
                  onChange={(e) => setFormData({ ...formData, direccionEntrega: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={2}
                  placeholder="Dirección completa de entrega"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio (S/)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.precio}
                  onChange={(e) => setFormData({ ...formData, precio: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition duration-200 disabled:opacity-50"
                >
                  {loading ? 'Creando...' : 'Crear Pedido'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 rounded-lg transition duration-200"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
