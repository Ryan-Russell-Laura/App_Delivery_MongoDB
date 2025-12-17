import { useState, useEffect } from 'react';
import { motorizadosAPI } from '../../services/api';
import { Plus, Edit, Trash2, X } from 'lucide-react';

interface Motorizado {
  _id: string;
  nombre: string;
  placa: string;
  celular: string;
  estado: boolean;
}

export default function MotorizadosManagement() {
  const [motorizados, setMotorizados] = useState<Motorizado[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingMotorizado, setEditingMotorizado] = useState<Motorizado | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    placa: '',
    celular: '',
    estado: true
  });

  useEffect(() => {
    loadMotorizados();
  }, []);

  const loadMotorizados = async () => {
    try {
      const data = await motorizadosAPI.getAll();
      setMotorizados(data);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingMotorizado) {
        await motorizadosAPI.update(editingMotorizado._id, formData);
      } else {
        await motorizadosAPI.create(formData);
      }
      await loadMotorizados();
      closeModal();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este motorizado?')) return;

    try {
      await motorizadosAPI.delete(id);
      await loadMotorizados();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const openModal = (motorizado?: Motorizado) => {
    if (motorizado) {
      setEditingMotorizado(motorizado);
      setFormData({
        nombre: motorizado.nombre,
        placa: motorizado.placa,
        celular: motorizado.celular,
        estado: motorizado.estado
      });
    } else {
      setEditingMotorizado(null);
      setFormData({
        nombre: '',
        placa: '',
        celular: '',
        estado: true
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingMotorizado(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Motorizados</h2>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition duration-200"
        >
          <Plus className="w-5 h-5" />
          Nuevo Motorizado
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Placa</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Celular</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {motorizados.map((motorizado) => (
              <tr key={motorizado._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{motorizado.nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{motorizado.placa}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{motorizado.celular}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${motorizado.estado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {motorizado.estado ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => openModal(motorizado)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(motorizado._id)}
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
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">
                {editingMotorizado ? 'Editar Motorizado' : 'Nuevo Motorizado'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Placa</label>
                <input
                  type="text"
                  value={formData.placa}
                  onChange={(e) => setFormData({ ...formData, placa: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Celular</label>
                <input
                  type="text"
                  value={formData.celular}
                  onChange={(e) => setFormData({ ...formData, celular: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.estado}
                  onChange={(e) => setFormData({ ...formData, estado: e.target.checked })}
                  className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm font-medium text-gray-700">Activo</label>
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
