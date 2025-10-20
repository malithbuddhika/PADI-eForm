import { useEffect, useState } from 'react';
import SignaturePad from './SignaturePad.jsx';

const steps = [
  { id: 1, title: 'Form 1: Personal Info', desc: 'Personal information' },
  { id: 2, title: 'Form 2: Professional Details', desc: 'Professional details' },
  { id: 3, title: 'Form 3: Final Review', desc: 'Review and submit' },
];

function Stepper({ current, completed, goTo }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      {steps.map((s) => {
        const status = completed.includes(s.id) ? 'completed' : s.id === current ? 'current' : 'upcoming';
        return (
          <button
            key={s.id}
            onClick={() => goTo(s.id)}
            disabled={status === 'upcoming'}
            className={`flex items-center gap-2 px-3 py-2 rounded ${status === 'completed' ? 'bg-green-100' : status === 'current' ? 'bg-blue-100' : 'bg-gray-100 opacity-60'}`}
          >
            <span className="font-semibold">{status === 'completed' ? '✓' : s.id}</span>
            <span className="text-sm">{s.title}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function Dashboard({ userId }) {
  const [user, setUser] = useState(null);
  const [current, setCurrent] = useState(1);
  const [completed, setCompleted] = useState([]);
  const [drafts, setDrafts] = useState({ 1: null, 2: null, 3: null });

  useEffect(() => {
    if (!userId) return;
    fetch(`http://localhost:4000/api/users/${userId}`)
      .then(r => r.json())
      .then(setUser)
      .catch(console.error);

    // load completion status
    fetch(`http://localhost:4000/api/form-status/${userId}`)
      .then(r => r.json())
      .then((s) => {
        const done = [];
        if (s.form1) done.push(1);
        if (s.form2) done.push(2);
        if (s.form3) done.push(3);
        setCompleted(done);
        // set current to first incomplete
        setCurrent(done.includes(1) && !done.includes(2) ? 2 : done.includes(2) && !done.includes(3) ? 3 : done.length === 3 ? 3 : 1);
      });
    // load drafts for steps
    Promise.all([1,2,3].map(step =>
      fetch(`http://localhost:4000/api/draft/${userId}/${step}`).then(r => r.json()).catch(() => null)
    )).then(([d1,d2,d3]) => {
      setDrafts({
        1: d1 ? { ...d1.data, signature: d1.signature } : null,
        2: d2 ? { ...d2.data, signature: d2.signature } : null,
        3: d3 ? { ...d3.data, signature: d3.signature } : null,
      });
    }).catch(() => {});
  }, [userId]);

  const goTo = (step) => {
    // only allow if step <= first incomplete + 1
    const max = Math.max(1, ...completed) + 1;
    if (step <= max) setCurrent(step);
  };

  const saveStep = async (step, data, signature) => {
    // Save to server
    const res = await fetch(`http://localhost:4000/api/form/${step}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, data, signature }),
    });
    if (res.ok) {
      // mark completed
      setCompleted((c) => Array.from(new Set([...c, step])));
      // update draft so going back shows values
      setDrafts((prev) => ({ ...prev, [step]: { ...data, signature } }));
      // auto advance
      if (step < 3) setCurrent(step + 1);
      alert('Saved');
    } else {
      alert('Save failed');
    }
  };

  const back = () => setCurrent((c) => Math.max(1, c - 1));

  if (!user) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
        <p className="mb-4">Welcome, {user.name}</p>
        <Stepper current={current} completed={completed} goTo={goTo} />

        <div className="mt-4">
          {current === 1 && (
            <FormStep1 user={user} draft={drafts[1]} onSave={(data, sig) => saveStep(1, data, sig)} />
          )}
          {current === 2 && (
            <FormStep2 user={user} draft={drafts[2]} onSave={(data, sig) => saveStep(2, data, sig)} onBack={back} />
          )}
          {current === 3 && (
            <FormStep3 user={user} draft={drafts[3]} onSave={(data, sig) => saveStep(3, data, sig)} onBack={back} />
          )}
        </div>
      </div>
    </div>
  );
}

function FormStep1({ user, draft, onSave }) {
  const [fieldA, setFieldA] = useState(draft?.fieldA || '');
  const [signature, setSignature] = useState(draft?.signature || '');

  useEffect(() => {
    setFieldA(draft?.fieldA || '');
    setSignature(draft?.signature || '');
  }, [draft]);
  return (
    <div>
      <h2 className="text-lg font-semibold">Personal Info</h2>
      <p className="text-sm text-gray-600">Please confirm your personal information.</p>
      <div className="mt-3">
        <label className="block text-sm">Full name</label>
        <input className="w-full border p-2 rounded bg-gray-100" value={user.name} readOnly />
      </div>
      <div className="mt-3">
        <label className="block text-sm">A field</label>
        <input className="w-full border p-2 rounded" value={fieldA} onChange={e => setFieldA(e.target.value)} />
      </div>
      <div className="mt-3">
        <label className="block text-sm">Signature</label>
        <SignaturePad
          onChange={setSignature}
          initialData={signature && !signature.startsWith('data:') ? `/signatures/${signature}` : signature}
        />
      </div>
      <div className="mt-3 flex justify-end gap-2">
        <button onClick={() => onSave({ fieldA }, signature)} className="px-4 py-2 bg-blue-600 text-white rounded">Next</button>
      </div>
    </div>
  );
}

function FormStep2({ user, draft, onSave, onBack }) {
  const [fieldB, setFieldB] = useState(draft?.fieldB || '');
  const [signature, setSignature] = useState(draft?.signature || '');

  useEffect(() => {
    setFieldB(draft?.fieldB || '');
    setSignature(draft?.signature || '');
  }, [draft]);
  return (
    <div>
      <h2 className="text-lg font-semibold">Professional Details</h2>
      <p className="text-sm text-gray-600">Enter your professional details.</p>
      <div className="mt-3">
        <label className="block text-sm">Full name</label>
        <input className="w-full border p-2 rounded bg-gray-100" value={user.name} readOnly />
      </div>
      <div className="mt-3">
        <label className="block text-sm">B field</label>
        <input className="w-full border p-2 rounded" value={fieldB} onChange={e => setFieldB(e.target.value)} />
      </div>
      <div className="mt-3">
        <label className="block text-sm">Signature</label>
        <SignaturePad
          onChange={setSignature}
          initialData={signature && !signature.startsWith('data:') ? `/signatures/${signature}` : signature}
        />
      </div>
      <div className="mt-3 flex justify-between">
        <button onClick={onBack} className="px-4 py-2 bg-gray-200 rounded">Back</button>
        <button onClick={() => onSave({ fieldB }, signature)} className="px-4 py-2 bg-blue-600 text-white rounded">Next</button>
      </div>
    </div>
  );
}

function FormStep3({ user, draft, onSave, onBack }) {
  const [notes, setNotes] = useState(draft?.notes || '');
  const [signature, setSignature] = useState(draft?.signature || '');

  useEffect(() => {
    setNotes(draft?.notes || '');
    setSignature(draft?.signature || '');
  }, [draft]);
  return (
    <div>
      <h2 className="text-lg font-semibold">Final Review</h2>
      <p className="text-sm text-gray-600">Review and submit.</p>
      <div className="mt-3">
        <label className="block text-sm">Full name</label>
        <input className="w-full border p-2 rounded bg-gray-100" value={user.name} readOnly />
      </div>
      <div className="mt-3">
        <label className="block text-sm">Notes</label>
        <textarea className="w-full border p-2 rounded" value={notes} onChange={e => setNotes(e.target.value)} />
      </div>
      <div className="mt-3">
        <label className="block text-sm">Signature</label>
        <SignaturePad
          onChange={setSignature}
          initialData={signature && !signature.startsWith('data:') ? `/signatures/${signature}` : signature}
        />
      </div>
      <div className="mt-3 flex justify-between">
        <button onClick={onBack} className="px-4 py-2 bg-gray-200 rounded">Back</button>
        <button onClick={() => onSave({ notes }, signature)} className="px-4 py-2 bg-green-600 text-white rounded">Submit</button>
      </div>
    </div>
  );
}
