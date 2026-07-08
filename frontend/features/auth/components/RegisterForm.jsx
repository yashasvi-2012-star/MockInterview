import { UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Button from '../../../shared/components/ui/Button.jsx';
import ErrorMessage from '../../../shared/components/common/ErrorMessage.jsx';
import Input from '../../../shared/components/ui/Input.jsx';
import { ROUTES } from '../../../shared/constants/routes.js';
import { isEmail, minLength, required } from '../../../shared/utils/validators.js';
import useAuth from '../hooks/useAuth.js';

export default function RegisterForm() {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = (event) => {
    event.preventDefault();
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
    };
    const nextErrors = {
      name: required(payload.name) ? '' : 'Your name is required.',
      email: isEmail(payload.email) ? '' : 'Enter a valid email address.',
      password: minLength(payload.password, 8) ? '' : 'Use at least 8 characters.',
    };
    setErrors(nextErrors);
    if (!Object.values(nextErrors).some(Boolean)) {
      register.mutate(payload);
    }
  };

  return (
    <form className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft" onSubmit={submit}>
      <h1 className="text-2xl font-bold text-slate-950">Create your account</h1>
      <p className="mt-2 text-sm text-slate-500">Start tracking practice interviews and resume readiness.</p>
      <div className="mt-6 space-y-4">
        {register.error ? <ErrorMessage message={register.error.message} /> : null}
        <Input label="Full name" name="name" value={form.name} error={errors.name} onChange={update} />
        <Input label="Email" name="email" type="email" value={form.email} error={errors.email} onChange={update} />
        <Input label="Password" name="password" type="password" value={form.password} error={errors.password} onChange={update} />
      </div>
      <Button className="mt-6 w-full" disabled={register.isPending} type="submit">
        <UserPlus size={18} />
        {register.isPending ? 'Creating account' : 'Create account'}
      </Button>
      <p className="mt-4 text-center text-sm text-slate-500">
        Already registered? <Link className="font-semibold text-brand-700" to={ROUTES.LOGIN}>Sign in</Link>
      </p>
    </form>
  );
}
