import { Save } from 'lucide-react';
import { useState } from 'react';
import Button from '../../../shared/components/ui/Button.jsx';
import Card from '../../../shared/components/ui/Card.jsx';
import Input from '../../../shared/components/ui/Input.jsx';

export default function ProfileForm({ profile, onSubmit }) {
  const [form, setForm] = useState(profile);
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  return (
    <Card as="form" onSubmit={(event) => { event.preventDefault(); onSubmit(form); }}>
      <h2 className="text-lg font-semibold text-slate-950">Profile Details</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <Input label="Full name" name="name" value={form.name} onChange={update} />
        <Input label="Email" name="email" type="email" value={form.email} onChange={update} />
        <Input label="Target role" name="role" value={form.role} onChange={update} />
        <Input label="Location" name="location" value={form.location} onChange={update} />
      </div>
      <Button className="mt-6" type="submit">
        <Save size={18} />
        Save profile
      </Button>
    </Card>
  );
}
