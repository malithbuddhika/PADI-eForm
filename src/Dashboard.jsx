import { useEffect, useState } from 'react';
import FormStep1 from './steps/FormStep1.jsx';
import FormStep2 from './steps/FormStep2.jsx';
import FormStep3 from './steps/FormStep3.jsx';
import { API_BASE } from './api'

const steps = [
  { id: 1, title: '', desc: '' },
  { id: 2, title: '', desc: '' },
  { id: 3, title: '', desc: '' },
];

function Stepper({ current, completed, goTo }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      {steps.map((s) => {
        const status = completed.includes(s.id) ? 'completed' : s.id === current ? 'current' : 'upcoming';
        // define clear class sets for each status so colors are distinct
        const base = 'flex items-center gap-3 px-3 py-2 rounded-md transition-colors cursor-pointer';
        const statusBtnClass = status === 'completed'
          ? `${base} bg-green-600 hover:bg-green-700 text-white`
          : status === 'current'
            ? `${base} bg-blue-600 hover:bg-blue-700 text-white shadow`
            : `${base} bg-gray-300 hover:bg-gray-400 text-gray-700`;

        const badgeClass = status === 'completed'
          ? 'w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs'
          : status === 'current'
            ? 'w-6 h-6 rounded-full bg-white text-blue-600 flex items-center justify-center font-semibold border-2 border-blue-600'
            : 'w-6 h-6 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-sm';

        return (
          <button
            key={s.id}
            onClick={() => goTo(s.id)}
            className={statusBtnClass}
          >
            <span className={badgeClass}>{status === 'completed' ? '✓' : s.id}</span>
            <div className="text-left">
              <div className="text-sm font-medium">{s.title}</div>
              <div className="text-xs text-gray-500">{s.desc}</div>
            </div>
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

  fetch(`${API_BASE}/api/users/${userId}`)
      .then((r) => r.json())
      .then(setUser)
      .catch(console.error);

    // load completion status
  fetch(`${API_BASE}/api/form-status/${userId}`)
      .then((r) => r.json())
      .then((s) => {
        const done = [];
        if (s.form1) done.push(1);
        if (s.form2) done.push(2);
        if (s.form3) done.push(3);
        setCompleted(done);
        // set current to first incomplete
        setCurrent(done.includes(1) && !done.includes(2) ? 2 : done.includes(2) && !done.includes(3) ? 3 : done.length === 3 ? 3 : 1);
      })
      .catch(() => {});

    // load drafts for steps
    Promise.all([1, 2, 3].map((step) =>
  fetch(`${API_BASE}/api/draft/${userId}/${step}`).then((r) => r.json()).catch(() => null)
    ))
      .then(([d1, d2, d3]) => {
        setDrafts({
          1: d1 ? { ...d1.data, signature: d1.signature } : null,
          2: d2 ? { ...d2.data, signature: d2.signature } : null,
          3: d3 ? { ...d3.data, signature: d3.signature } : null,
        });
      })
      .catch(() => {});
  }, [userId]);

  const goTo = (step) => {
    // Allow navigation to any step (1, 2, or 3)
    if (step >= 1 && step <= 3) {
      setCurrent(step);
    }
  };

  // Save draft (does NOT mark step completed)
  const saveDraft = async (step, data, signature) => {
  const res = await fetch(`${API_BASE}/api/draft`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, form_step: step, data, signature }),
    });
    if (res.ok) {
      setDrafts((prev) => ({ ...prev, [step]: { ...data, signature } }));
      if (step < 3) setCurrent(step + 1);
      return true;
    }
    return false;
  };

  // Final submit for a step (marks completed)
  const submitStep = async (step, data, signature) => {
    // If this is step 3, submit all forms together
    if (step === 3) {
      return submitComplete(data);
    }
    
    // For steps 1 and 2, just save as draft and move forward
    const res = await fetch(`${API_BASE}/api/form/${step}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, data, signature }),
    });
    if (res.ok) {
      setCompleted((c) => Array.from(new Set([...c, step])));
      setDrafts((prev) => ({ ...prev, [step]: { ...data, signature } }));
      if (step < 3) setCurrent(step + 1);
      alert('Submitted');
      return true;
    }
    alert('Submit failed');
    return false;
  };

  // Submit all forms together when completing step 3
  const submitComplete = async (form3Data) => {
    try {
      // Get the latest draft data for forms 1 and 2
      const form1Data = drafts[1] || {};
      const form2Data = drafts[2] || {};

      // Validate that we have data for all forms
      if (!form1Data.participant_signature || !form2Data.participant_signature) {
        alert('Please complete Forms 1 and 2 before submitting.');
        return false;
      }

      console.log('Submitting complete form data:', { form1Data, form2Data, form3Data });

      const res = await fetch(`${API_BASE}/api/submit-complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          form1Data,
          form2Data,
          form3Data
        }),
      });

      // Check if response is JSON
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        console.error('Non-JSON response:', text);
        throw new Error('Server returned non-JSON response. Check server logs.');
      }

      const result = await res.json();
      
      if (res.ok && result.success) {
        // Mark all forms as completed
        setCompleted([1, 2, 3]);
        alert('All forms submitted successfully!');
        return true;
      } else {
        alert('Submit failed: ' + (result.error || 'Unknown error'));
        return false;
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Submit failed: ' + error.message);
      return false;
    }
  };

  const back = () => setCurrent((c) => Math.max(1, c - 1));

  if (!user) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-2">{user.dive_center_name || 'Dashboard'}</h1>
        <p className="mb-4">Welcome, {user.name}</p>
        <Stepper current={current} completed={completed} goTo={goTo} />

        <div className="mt-4">
          {current === 1 && (
            <FormStep1 user={user} draft={drafts[1]} onDraft={(data, sig) => saveDraft(1, data, sig)} />
          )}
          {current === 2 && (
            <FormStep2 user={user} draft={drafts[2]} onDraft={(data, sig) => saveDraft(2, data, sig)} onBack={back} />
          )}
          {current === 3 && (
            <FormStep3 user={user} draft={drafts[3]} onSubmit={(data, sig) => submitStep(3, data, sig)} onBack={back} />
          )}
        </div>
      </div>
    </div>
  );
}