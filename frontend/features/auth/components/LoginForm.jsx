import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useState } from 'react';
import Button from '../../../shared/components/ui/Button.jsx';
import Input from '../../../shared/components/ui/Input.jsx';
import ErrorMessage from '../../../shared/components/common/ErrorMessage.jsx';
import { ROUTES } from '../../../shared/constants/routes.js';
import { isEmail, minLength } from '../../../shared/utils/validators.js';
import useAuth from '../hooks/useAuth.js';

export default function LoginForm() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: 'demo@mockinterview.dev', password: 'password123' });
  const [errors, setErrors] = useState({});

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = (event) => {
    event.preventDefault();
    const nextErrors = {
      email: isEmail(form.email) ? '' : 'Enter a valid email address.',
      password: minLength(form.password, 8) ? '' : 'Password must be at least 8 characters.',
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) {
      return;
    }
    login.mutate(form);
  };

  return (
    <form className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft" onSubmit={submit}>
      <h1 className="text-2xl font-bold text-slate-950">Welcome back</h1>
      <p className="mt-2 text-sm text-slate-500">Sign in to continue your interview preparation.</p>
      <div className="mt-6 space-y-4">
        {login.error ? <ErrorMessage message={login.error.message} /> : null}
        <Input label="Email" name="email" type="email" value={form.email} error={errors.email} onChange={update} />
        <Input label="Password" name="password" type="password" value={form.password} error={errors.password} onChange={update} />
      </div>
      <div className="mt-4 flex items-center justify-between text-sm">
        <Link className="font-semibold text-brand-700" to={ROUTES.FORGOT_PASSWORD}>
          Forgot password?
        </Link>
        <Link className="font-semibold text-slate-600" to={ROUTES.REGISTER}>
          Create account
        </Link>
      </div>
      <Button className="mt-6 w-full" disabled={login.isPending} type="submit">
        <LogIn size={18} />
        {login.isPending ? 'Signing in' : 'Sign in'}
      </Button>
    </form>
  );
}
