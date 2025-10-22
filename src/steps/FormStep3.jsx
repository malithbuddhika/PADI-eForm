import { useEffect, useState } from 'react';
import SignaturePad from '../SignaturePad.jsx';

export default function FormStep3({ user, draft, onSubmit, onBack }) {
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
        <button onClick={() => onSubmit({ notes }, signature)} className="px-4 py-2 bg-green-600 text-white rounded">Submit</button>
      </div>
    </div>
  );
}
