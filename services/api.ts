import { API_URL } from '../constants/config';

// Cliente HTTP mínimo para hablar con el backend de Tuali.
// Sin dependencias extra: solo fetch.

export type CustomerProfile = {
  customer_id: string;
  total_orders: number;
  total_spent: number;
  favorite_products: { _id: string; total: number }[];
  status_breakdown: Record<string, number>;
};

export type LoginResponse = {
  success: boolean;
  token: string;
  customer: CustomerProfile;
};

// Documento de pedido tal cual viene del backend (colección "orders", flexible).
export type BackendOrder = {
  id_pedido?: string;
  customer_id?: string;
  pais?: string;
  status_final?: string;
  SubTotal?: string | number;
  Total?: string | number;
  [key: string]: any;
};

// Línea de un pedido (colección "orderdetails").
export type OrderDetailLine = {
  id_linea?: string;
  id_pedido?: string;
  sku_solicitado?: string;
  nombre_sku_solicitado?: string;
  Quantity?: string | number;
  Status?: string;
  [key: string]: any;
};

// Insights del cliente (texto + métricas listas para mostrar / para el agente).
export type CustomerInsights = {
  success: boolean;
  customerId: string;
  metrics: {
    totalOrders: number;
    totalSpent: number;
    topProducts: string[];
    deliveryRate: number;
  };
  summary: string;
};

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch (e) {
    // Error de red (back apagado, URL mal, sin internet…)
    throw new Error(
      `No se pudo conectar con el servidor (${API_URL}). ¿Está corriendo el backend?`
    );
  }

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    const msg = body?.message || body?.error || `Error ${res.status}`;
    throw new Error(msg);
  }

  return body as T;
}

// Lista de clientes disponibles para el login.
export async function fetchClients(): Promise<string[]> {
  const data = await request<{ customerIds: string[] }>('/api/auth/clients');
  return data.customerIds ?? [];
}

// Login "muy equis": manda el customer_id y recibe el perfil del cliente.
export async function login(customerId: string): Promise<LoginResponse> {
  return request<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ customer_id: customerId }),
  });
}

// Perfil comercial del cliente (mismas métricas que el login).
export async function fetchCustomerProfile(customerId: string) {
  return request<CustomerProfile>(`/api/customers/${customerId}/profile`);
}

// Pedidos del cliente.
export async function fetchCustomerOrders(customerId: string) {
  return request<{ count: number; data: BackendOrder[] }>(
    `/api/customers/${customerId}/orders`
  );
}

// Líneas (productos) de un pedido concreto.
export async function fetchOrderDetails(idPedido: string) {
  return request<{ success: boolean; count: number; data: OrderDetailLine[] }>(
    `/api/order-details/${idPedido}`
  );
}

// Productos top del cliente.
export async function fetchTopProducts(customerId: string) {
  return request<{ _id: string; total: number }[]>(
    `/api/customers/${customerId}/top-products`
  );
}

// Insights automáticos del cliente (texto + métricas).
export async function fetchCustomerInsights(customerId: string) {
  return request<CustomerInsights>(`/api/customers/${customerId}/insights`);
}

// Pregunta al agente conversacional del backend.
export async function askAgent(question: string) {
  return request<{ success: boolean; answer: string }>('/api/agent/query', {
    method: 'POST',
    body: JSON.stringify({ question }),
  });
}
