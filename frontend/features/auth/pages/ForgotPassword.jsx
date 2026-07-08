import { Send } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../shared/components/ui/Button.jsx';
import Input from '../../../shared/components/ui/Input.jsx';
import { ROUTES } from '../../../shared/constants/routes.js';
import { isEmail } from '../../../shared/utils/validators.js';
import { authService } from '../services/authService.js';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (!isEmail(email)) {
      setError('Enter a valid email address.');
      return;
    }
    setError('');
    setMessage('');
    setIsSubmitting(true);
    try {
      const response = await authService.forgotPassword({ email });
      setMessage(response?.message || 'If an account exists, reset instructions will be sent.');
    } catch (resetError) {
      setError(resetError.message || 'Unable to send reset instructions.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft" onSubmit={submit}>
      <h1 className="text-2xl font-bold text-slate-950">Reset password</h1>
      <p className="mt-2 text-sm text-slate-500">We will send recovery instructions to your email.</p>
      <div className="mt-6 space-y-4">
        <Input label="Email" name="email" type="email" value={email} error={error} onChange={(event) => setEmail(event.target.value)} />
        {message ? <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">{message}</p> : null}
      </div>
      <Button className="mt-6 w-full" disabled={isSubmitting} type="submit">
        <Send size={18} />
        {isSubmitting ? 'Sending reset link' : 'Send reset link'}
      </Button>
      <Link className="mt-4 block text-center text-sm font-semibold text-brand-700" to={ROUTES.LOGIN}>
        Back to sign in
      </Link>
    </form>
  );
}
