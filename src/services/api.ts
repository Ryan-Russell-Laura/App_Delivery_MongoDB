const API_URL = 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

export const clientesAPI = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/clientes`, { headers: getHeaders() });
    if (!response.ok) throw new Error('Error al obtener clientes');
    return response.json();
  },

  create: async (data: any) => {
    const response = await fetch(`${API_URL}/clientes`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Error al crear cliente');
    return response.json();
  },

  update: async (id: string, data: any) => {
    const response = await fetch(`${API_URL}/clientes/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Error al actualizar cliente');
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_URL}/clientes/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Error al eliminar cliente');
    return response.json();
  }
};

export const motorizadosAPI = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/motorizados`, { headers: getHeaders() });
    if (!response.ok) throw new Error('Error al obtener motorizados');
    return response.json();
  },

  create: async (data: any) => {
    const response = await fetch(`${API_URL}/motorizados`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Error al crear motorizado');
    return response.json();
  },

  update: async (id: string, data: any) => {
    const response = await fetch(`${API_URL}/motorizados/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Error al actualizar motorizado');
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_URL}/motorizados/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Error al eliminar motorizado');
    return response.json();
  }
};

export const pedidosAPI = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/pedidos`, { headers: getHeaders() });
    if (!response.ok) throw new Error('Error al obtener pedidos');
    return response.json();
  },

  create: async (data: any) => {
    const response = await fetch(`${API_URL}/pedidos`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Error al crear pedido');
    return response.json();
  },

  update: async (id: string, data: any) => {
    const response = await fetch(`${API_URL}/pedidos/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Error al actualizar pedido');
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_URL}/pedidos/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Error al eliminar pedido');
    return response.json();
  }
};
