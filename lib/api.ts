import { MenuItem, Order, CreateOrderPayload } from '@/types';

const BASE = process.env.NEXT_PUBLIC_API_URL!;

function authHeaders(token?: string | null): HeadersInit {
  return token
    ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    : { 'Content-Type': 'application/json' };
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message ?? `Request failed (${res.status})`);
  return data as T;
}

// ── Menu ──────────────────────────────────────────────────────────────
export async function fetchMenu(): Promise<MenuItem[]> {
  const res = await fetch(`${BASE}/menu`);
  return handleResponse(res);
}

// ── Auth ──────────────────────────────────────────────────────────────
export async function apiRegister(name: string, email: string, password: string) {
  const res = await fetch(`${BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  return handleResponse<{ user: { id: string; email: string; name: string }; token: string }>(res);
}

export async function apiLogin(email: string, password: string) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse<{ user: { id: string; email: string; name: string }; token: string }>(res);
}

// ── Orders ────────────────────────────────────────────────────────────
export async function createOrder(payload: CreateOrderPayload, token: string): Promise<Order> {
  const res = await fetch(`${BASE}/orders`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function fetchOrder(id: string, token: string): Promise<Order> {
  const res = await fetch(`${BASE}/orders/${id}`, {
    headers: authHeaders(token),
  });
  return handleResponse(res);
}

export async function fetchMyOrders(token: string): Promise<Order[]> {
  const res = await fetch(`${BASE}/orders/my`, {
    headers: authHeaders(token),
  });
  return handleResponse(res);
}

export async function fetchOrders(token: string): Promise<Order[]> {
  const res = await fetch(`${BASE}/orders`, {
    headers: authHeaders(token),
  });
  return handleResponse(res);
}
