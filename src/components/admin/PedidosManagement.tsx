import { useState, useEffect } from 'react';
import { pedidosAPI, clientesAPI, motorizadosAPI } from '../../services/api';
import { Plus, Edit, Trash2, X } from 'lucide-react';

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
}

export default function PedidosManagement() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [motorizados, setMotorizados] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPedido, setEditingPedido] = useState<Pedido | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    clienteId: '',
    motorizadoId: '',
    descripcion: '',
    clienteFinal: '',
    celularCliente: '',
    direccionEntrega: '',
    precio: 0,
    estado: 'pendiente'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [pedidosData, clientesData, motorizadosData] = await Promise.all([
        pedidosAPI.getAll(),
        clientesAPI.getAll(),
        motorizadosAPI.getAll()
      ]);
      setPedidos(pedidosData);
      setClientes(clientesData.filter((c: any) => c.estado));
      setMotorizados(motorizadosData.filter((m: any) => m.estado));
    } catch (error: any) {
      alert(error.message);
    }
  };

  // En PedidosManagement.tsx

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    // 1. CREAMOS EL OBJETO BASE A ENVIAR
    const dataToSend = {
      ...formData,
      // 2. CORRECCIÓN CRÍTICA: Convertimos la cadena vacía del SELECT a null.
      // Si formData.motorizadoId es '' (Sin asignar), enviamos null.
      // Si es una ID válida, enviamos la ID.
      motorizadoId: formData.motorizadoId === '' ? null : formData.motorizadoId
    };

    if (editingPedido) {
      // Usamos dataToSend corregido
      await pedidosAPI.update(editingPedido._id, dataToSend);
    } else {
      // Usamos dataToSend corregido
      await pedidosAPI.create(dataToSend);
    }
    await loadData();
    closeModal();
  } catch (error: any) {
    alert(error.message);
  } finally {
    setLoading(false);
  }
};
  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este pedido?')) return;

    try {
      await pedidosAPI.delete(id);
      await loadData();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const openModal = (pedido?: Pedido) => {
    if (pedido) {
      setEditingPedido(pedido);
      setFormData({
        clienteId: pedido.clienteId._id,
        motorizadoId: pedido.motorizadoId?._id || '',
        descripcion: pedido.descripcion,
        clienteFinal: pedido.clienteFinal,
        celularCliente: pedido.celularCliente,
        direccionEntrega: pedido.direccionEntrega,
        precio: pedido.precio,
        estado: pedido.estado
      });
    } else {
      setEditingPedido(null);
      setFormData({
        clienteId: '',
        motorizadoId: '',
        descripcion: '',
        clienteFinal: '',
        celularCliente: '',
        direccionEntrega: '',
        precio: 0,
        estado: 'pendiente'
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPedido(null);
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Pedidos</h2>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition duration-200"
        >
          <Plus className="w-5 h-5" />
          Nuevo Pedido
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Motorizado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente Final</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pedidos.map((pedido) => (
              <tr key={pedido._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pedido.clienteId.nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {pedido.motorizadoId ? `${pedido.motorizadoId.nombre} (${pedido.motorizadoId.placa})` : 'Sin asignar'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pedido.clienteFinal}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{pedido.descripcion}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">S/ {pedido.precio.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getEstadoBadge(pedido.estado)}`}>
                    {pedido.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => openModal(pedido)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(pedido._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">
                {editingPedido ? 'Editar Pedido' : 'Nuevo Pedido'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Motorizado (Opcional)</label>
                  <select
                    value={formData.motorizadoId}
                    onChange={(e) => setFormData({ ...formData, motorizadoId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Sin asignar</option>
                    {motorizados.map((motorizado) => (
                      <option key={motorizado._id} value={motorizado._id}>
                        {motorizado.nombre} - {motorizado.placa}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={3}
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
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio (S/)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.precio}
                    onChange={(e) => setFormData({ ...formData, precio: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select
                    value={formData.estado}
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="asignado">Asignado</option>
                    <option value="entregado">Entregado</option>
                    <option value="recibido">Recibido</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition duration-200 disabled:opacity-50"
                >
                  {loading ? 'Guardando...' : 'Guardar'}
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
