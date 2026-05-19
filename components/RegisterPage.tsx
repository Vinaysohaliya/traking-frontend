'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { apiRegister } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

export function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { user, token } = await apiRegister(form.name, form.email, form.password);
      setAuth(user, token);
      toast.success(`Account created! Welcome, ${user.name}!`, { icon: '🎉' });
      router.push('/');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const field = (key: keyof typeof form, label: string, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        className={`input-field ${errors[key] ? 'border-red-400' : ''}`}
        placeholder={placeholder}
        data-testid={`register-${key}`}
      />
      {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-8">
      <div className="card p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-5xl">🍔</span>
          <h1 className="text-2xl font-bold text-gray-900 mt-3">Create account</h1>
          <p className="text-gray-500 mt-1">Join FoodDash and start ordering</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {field('name', 'Full Name', 'text', 'John Doe')}
          {field('email', 'Email', 'email', 'you@example.com')}
          {field('password', 'Password', 'password', '••••••••')}
          {field('confirm', 'Confirm Password', 'password', '••••••••')}

          <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-orange-600 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
