import { useEffect, useState, useRef } from 'react';
import SignaturePad from '../SignaturePad.jsx';
import padiLogo from '../assets/padi_logo.png';

export default function FormStep2({ user, draft, onDraft, onBack }) {
  const [fieldB, setFieldB] = useState(draft?.fieldB || '');
  
  // Signatures and dates
  const [participantSignature, setParticipantSignature] = useState(draft?.participant_signature || '');
  const [participantDate, setParticipantDate] = useState(draft?.participant_signature_date || '');
  const [guardianSignature, setGuardianSignature] = useState(draft?.guardian_signature || '');
  const [guardianDate, setGuardianDate] = useState(draft?.guardian_signature_date || '');

  // birthdate to determine if guardian signature needed
  const [birthdate, setBirthdate] = useState(draft?.birthdate || user?.birthday || '');

  // UI state
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);
  const [activePad, setActivePad] = useState(null); // 'participant' | 'guardian' | null
  const [message, setMessage] = useState('');
  const [liveParticipant, setLiveParticipant] = useState('');
  const [liveGuardian, setLiveGuardian] = useState('');
  const participantPadRef = useRef(null);
  const guardianPadRef = useRef(null);

  useEffect(() => {
    setFieldB(draft?.fieldB || '');
    setParticipantSignature(draft?.participant_signature || '');
    setParticipantDate(draft?.participant_signature_date || '');
    setGuardianSignature(draft?.guardian_signature || '');
    setGuardianDate(draft?.guardian_signature_date || '');
    setBirthdate(draft?.birthdate || user?.birthday || '');
  }, [draft, user]);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (isMobile && activePad) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobile, activePad]);

  const calcAge = (bd) => {
    if (!bd) return null;
    let d = new Date(bd);
    if (isNaN(d)) {
      const parts = bd.split('/').map(p => parseInt(p, 10));
      if (parts.length === 3) {
        d = new Date(parts[2], (parts[1] || 1) - 1, parts[0]);
      }
    }
    if (isNaN(d)) return null;
    const diff = Date.now() - d.getTime();
    const age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    return age;
  };

  const isUnder18 = (() => {
    const age = calcAge(birthdate);
    return age !== null ? age < 18 : false;
  })();

  const formatToday = () => {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const saveSignature = (which) => {
    try {
      if (which === 'participant' && participantPadRef.current) {
        const d = participantPadRef.current.getDataURL();
        if (d) setLiveParticipant(d);
      }
      if (which === 'guardian' && guardianPadRef.current) {
        const d = guardianPadRef.current.getDataURL();
        if (d) setLiveGuardian(d);
      }
    } catch (e) {
      // ignore
    }
    if (which === 'participant') {
      const valueToSave = liveParticipant || participantSignature;
      if (!valueToSave) {
        setMessage('No participant signature to save.');
        return;
      }
      setParticipantSignature(valueToSave);
      setParticipantDate(formatToday());
      setMessage('Participant signature saved successfully');
      setActivePad(null);
    } else if (which === 'guardian') {
      const valueToSave = liveGuardian || guardianSignature;
      if (!valueToSave) {
        setMessage('No guardian signature to save.');
        return;
      }
      setGuardianSignature(valueToSave);
      setGuardianDate(formatToday());
      setMessage('Guardian signature saved successfully');
      setActivePad(null);
    }
    setTimeout(() => setMessage(''), 3000);
  };

  const clearSignature = (which) => {
    if (which === 'participant') {
      if (participantPadRef.current) participantPadRef.current.clear();
      setLiveParticipant('');
    } else if (which === 'guardian') {
      if (guardianPadRef.current) guardianPadRef.current.clear();
      setLiveGuardian('');
    }
  };

  const handleSaveDraft = () => {
    const payload = {
      fieldB,
      birthdate,
      participant_signature: participantSignature,
      participant_signature_date: participantDate,
      guardian_signature: guardianSignature || null,
      guardian_signature_date: guardianDate || null
    };
    onDraft(payload);
    setMessage('Draft saved successfully');
    setTimeout(() => setMessage(''), 3000);
  };
  return (
    <div className="max-w-4xl mx-auto bg-white">

      <div className="flex items-start mb-4">
        <img src={padiLogo} alt="PADI" className="w-20 h-20 mr-4" />
        <div className="flex-1">
          <h1 className="text-lg font-bold mb-1 bg-black text-white px-3 py-2">Non-Agency Disclosure and Acknowledgment Agreement</h1>
          <p className="text-xs text-red-600 px-3">In European Union and European Free Trade Association countries use alternative form.</p>
          <p className="text-xs font-bold px-3 mt-1">Please read carefully and fill in all blanks before signing.</p>
        </div>
      </div>

      <div className="px-3 text-xs leading-relaxed">

        <div className="mb-4">
          <p className="text-justify">
            I understand and agree that PADI Members ("Members"), including <span className="inline-block border-b border-gray-400 align-bottom mx-1 font-bold text-base" style={{ minWidth: `${Math.max((user?.dive_center_name || '').length * 10, 100)}px` }}>{user?.dive_center_name ||''}</span> 
            and/or any individual PADI Instructors and Divemasters associated with the program in which I am participat-
            ing, are licensed to use various PADI Trademarks and to conduct PADI training, but are not agents, employees or franchisees of PADI 
            Americas, Inc, or its parent, subsidiary and affiliated corporations ("PADI"). I further understand that Member business activities 
            are independent, and are neither owned nor operated by PADI, and that while PADI establishes the standards for PADI diver train-
            ing programs, it is not responsible for, nor does it have the right to control, the operation of the Members' business activities and 
            the day-to day conduct of PADI programs and supervision of divers by the Members or their associated staff. I further understand 
            and agree on behalf of myself, my heirs and my estate that in the event of an injury or death during this activity, neither I nor my es-
            tate shall seek to hold PADI liable for the actions, inactions or negligence of <span className="inline-block border-b border-gray-400 align-bottom mx-1 font-bold text-base" style={{ minWidth: `${Math.max((user?.dive_center_name || '').length * 10, 100)}px` }}>{user?.dive_center_name || ''}</span>
            and/or the instructors and divemasters associated with the activity.
          </p>
        </div>

        /* Liability Release Header */
        <div className="mb-3">
          <h2 className="text-base font-bold mb-1 bg-black text-white px-3 py-2 -mx-3">Liability Release and Assumption of Risk Agreement</h2>
          <p className="text-xs text-red-600 mt-1">In European Union and European Free Trade Association countries use alternative form.</p>
          <p className="text-xs font-bold mt-1">Please read carefully and fill in all blanks before signing.</p>
        </div>

        <p>
          I, <span className="inline-block border-b border-gray-400 align-bottom mx-1 font-bold text-base" style={{ minWidth: `${Math.max((user?.name || '').length * 10, 100)}px` }}>{user?.name || ''}</span>, hereby 
          affirm that I am aware that skin and scuba diving have inherent risks 
          which may result in serious injury or death.
        </p>

        <p>
          I understand that diving with compressed air involves certain inherent 
          risks; including but not limited to decompression sickness, embolism 
          or other hyperbaric/air expansion injury that require treatment in a 
          recompression chamber. I further understand that the open water 
          diving trips which are necessary for training and for certification may 
          be conducted at a site that is remote, either by time or distance or 
          both, from such a recompression chamber. I still choose to proceed 
          with such instructional dives in spite of the possible absence of a 
          recompression chamber in proximity to the dive site.
        </p>

        <p>
          I understand and agree that neither my instructor(s),
          <span className="inline-block border-b border-gray-400 align-bottom mx-1 font-bold text-base" style={{ minWidth: `${Math.max((user?.instructors?.map(i => i.name).join(', ') || '').length * 10, 100)}px` }}>
            {user?.instructors?.map(i => i.name).join(', ') || ''}
          </span>,
          the facility through which I receive my instruction, 
          <span className="inline-block border-b border-gray-400 align-bottom mx-1 font-bold text-base" style={{ minWidth: `${Math.max((user?.dive_center_name || '').length * 10, 100)}px` }}>
            {user?.dive_center_name || ''}
          </span>,
          nor PADI Americas, Inc., nor its affiliate and subsidiary corporations, 
          nor any of their respective employees, officers, agents, contractors 
          or assigns (hereinafter referred to as "Released Parties") may be 
          held liable or responsible in any way for any injury, death or other 
          damages to me, my family, estate, heirs or assigns that may occur 
          as a result of my participation in this diving program or as a result of 
          the negligence of any party, including the Released Parties, whether 
          passive or active.
        </p>

        <p>
          In consideration of being allowed to participate in this course (and 
          optional Adventure Dive), hereinafter referred to as "program," I 
          hereby personally assume all risks of this program, whether foreseen 
          or unforeseen, that may befall me while I am a participant in this 
          program including, but not limited to, the academics, confined water 
          and/or open water activities.
        </p>

        <p>
          I further release, exempt and hold harmless said program and Re-
          leased Parties from any claim or lawsuit by me, my family, estate, 
          heirs or assigns, arising out of my enrollment and participation in 
          this program including both claims arising during the program or 
          after I receive my certification.
        </p>

        <p>
          I also understand that skin diving and scuba diving are physically 
          strenuous activities and that I will be exerting myself during this 
          program, and that if I am injured as a result of heart attack, panic, 
          hyperventilation, drowning or any other cause, that I expressly as-
          sume the risk of said injuries and that I will not hold the Released 
          Parties responsible for the same. 
        </p>

        <p>
          I further state that I am of lawful age and legally competent to sign 
          this liability release, or that I have acquired the written consent of 
          my parent or guardian. I understand the terms herein are contractual 
          and not a mere recital, and that I have signed this Agreement of my 
          own free act and with the knowledge that I hereby agree to waive 
          my legal rights. I further agree that if any provision of this Agree-
          ment is found to be unenforceable or invalid, that provision shall be 
          severed from this Agreement. The remainder of this Agreement will 
          then be construed as though the unenforceable provision had never 
          been contained herein.
        </p>

        <p>
          I understand and agree that I am not only giving up my right to sue 
          the Released Parties but also any rights my heirs, assigns, or benefi-
          ciaries may have to sue the Released Parties resulting from my death. 
          I further represent I have the authority to do so and that my heirs, 
          assigns, or beneficiaries will be estopped from claiming otherwise 
          because of my representations to the Released Parties.
        </p>

          <p className="font-bold mt-4">
            I, <span className="inline-block border-b border-gray-400 align-bottom mx-1 font-bold text-base" style={{ minWidth: `${Math.max((user?.name || '').length * 10, 100)}px` }}>{user?.name || ''}</span>,
            BY THIS INSTRUMENT AGREE TO EXEMPT AND RELEASE MY 
            INSTRUCTORS, <span className="inline-block border-b border-gray-400 align-bottom mx-1 font-bold text-base" style={{ minWidth: `${Math.max((user?.instructors?.map(i => i.name).join(', ') || '').length * 10, 100)}px` }}>{user?.instructors?.map(i => i.name).join(', ') || ''}</span>, 
            THE FACILITY THROUGH WHICH I RECEIVE MY INSTRUCTION, 
            <span className="inline-block border-b border-gray-400 align-bottom mx-1 font-bold text-base" style={{ minWidth: `${Math.max((user?.dive_center_name || '').length * 10, 100)}px` }}>{user?.dive_center_name || ''}</span>, AND 
            PADI AMERICAS, INC., AND ALL RELATED ENTITIES AS DEFINED 
            ABOVE, FROM ALL LIABILITY OR RESPONSIBILITY WHATSOEVER 
            FOR PERSONAL INJURY, PROPERTY DAMAGE OR WRONGFUL DEATH 
            HOWEVER CAUSED, INCLUDING, BUT NOT LIMITED TO, THE NEGLI-
            GENCE OF THE RELEASED PARTIES, WHETHER PASSIVE OR ACTIVE.
          </p>

          <p className="font-bold text-xs uppercase mt-4">
            I HAVE FULLY INFORMED MYSELF AND MY HEIRS OF THE CONTENTS OF THIS NON-AGENCY DISCLOSURE AND ACKNOWLEDGMENT AGREEMENT AND LIABILITY RELEASE AND ASSUMPTION OF RISK AGREEMENT BY READING BOTH BEFORE SIGNING BELOW ON BEHALF OF MYSELF AND MY HEIRS.
          </p>

          {/* Signature area previews */}
        <div className="space-y-6 mt-8">
          <div>
            <label className="block font-semibold mb-2 text-sm">Participant's Signature</label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                {participantSignature ? (
                  <img src={participantSignature && !participantSignature.startsWith('data:') ? `/signatures/${participantSignature}` : participantSignature} alt="participant signature" className="border rounded" style={{ maxHeight: 160, width: '100%', objectFit: 'contain' }} />
                ) : (
                  <div onClick={() => setActivePad('participant')} className="h-40 border rounded flex items-center justify-center text-gray-400 cursor-pointer">Tap to sign</div>
                )}
              </div>
              <div className="w-40">
                <label className="block font-semibold text-sm">Date (Day / Month / Year)</label>
                <input value={participantDate} readOnly placeholder="DD/MM/YYYY" className="w-full border-b border-gray-400 py-1 text-sm" />
              </div>
            </div>
            {/* Inline pad for desktop */}
            {!isMobile && activePad === 'participant' && (
              <div className="mt-3">
                <div className="relative border-2 border-gray-300 rounded-lg shadow bg-white" style={{ padding: '5px' }}>
                  <SignaturePad
                    ref={participantPadRef}
                    onChange={(val) => setLiveParticipant(val)}
                    initialData={participantSignature && !participantSignature.startsWith('data:') ? `/signatures/${participantSignature}` : ''}
                    strokeWidth={3}
                  />
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
                    <button onClick={() => {
                      try { const d = participantPadRef.current.getDataURL(); setLiveParticipant(d) } catch (e) {}
                      saveSignature('participant')
                    }} className="px-3 py-1 bg-green-600 text-white rounded shadow">Save</button>
                    <button onClick={() => { try { participantPadRef.current.clear() } catch (e) {} setLiveParticipant(''); setParticipantSignature(''); setParticipantDate(''); setMessage('Participant signature cleared') }} className="px-3 py-1 bg-gray-200 rounded shadow">Clear</button>
                    <button onClick={() => setActivePad(null)} className="px-3 py-1 bg-gray-100 rounded shadow">Close</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {isUnder18 && (
            <div>
              <label className="block font-semibold mb-2 text-sm">Signature of Parent or Guardian (where applicable)</label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  {guardianSignature ? (
                    <img src={guardianSignature && !guardianSignature.startsWith('data:') ? `/signatures/${guardianSignature}` : guardianSignature} alt="guardian signature" className="border rounded" style={{ maxHeight: 160, width: '100%', objectFit: 'contain' }} />
                  ) : (
                    <div onClick={() => setActivePad('guardian')} className="h-40 border rounded flex items-center justify-center text-gray-400 cursor-pointer">Tap to sign</div>
                  )}
                </div>
                <div className="w-40">
                  <label className="block font-semibold text-sm">Date (Day / Month / Year)</label>
                  <input value={guardianDate} readOnly placeholder="DD/MM/YYYY" className="w-full border-b border-gray-400 py-1 text-sm" />
                </div>
              </div>
              {!isMobile && activePad === 'guardian' && (
                <div className="mt-3">
                  <div className="relative border-2 border-gray-300 rounded-lg shadow bg-white" style={{ padding: '5px' }}>
                    <SignaturePad
                      ref={guardianPadRef}
                      onChange={(val) => setLiveGuardian(val)}
                      initialData={guardianSignature && !guardianSignature.startsWith('data:') ? `/signatures/${guardianSignature}` : ''}
                      strokeWidth={3}
                    />
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
                      <button onClick={() => { try { const d = guardianPadRef.current.getDataURL(); setLiveGuardian(d) } catch (e) {} saveSignature('guardian') }} className="px-3 py-1 bg-green-600 text-white rounded shadow">Save</button>
                      <button onClick={() => { try { guardianPadRef.current.clear() } catch (e) {} setLiveGuardian(''); setGuardianSignature(''); setGuardianDate(''); setMessage('Guardian signature cleared') }} className="px-3 py-1 bg-gray-200 rounded shadow">Clear</button>
                      <button onClick={() => setActivePad(null)} className="px-3 py-1 bg-gray-100 rounded shadow">Close</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {message && <div className="text-sm text-blue-700">{message}</div>}
        </div>

        {/* Product Info Footer */}
        <div className="mt-6 text-xs text-gray-600 flex justify-between items-center border-t pt-2">
          <div>Product No. 10072 (Rev. 10/16) Version 4.03</div>
          <div>© PADI 2016</div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-4">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Draft
          </button>
        </div>
      </div>

      {/* Mobile / fullscreen modal for signature */}
      {isMobile && activePad && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          <div className="flex justify-between items-center p-4 border-b border-gray-300">
            <h3 className="text-lg font-semibold">{activePad === 'participant' ? 'Participant Signature' : 'Parent/Guardian Signature'}</h3>
            <button onClick={() => setActivePad(null)} className="px-3 py-1 text-blue-600">✕</button>
          </div>
          <div className="flex-1 p-4 overflow-hidden">
            <div className="w-full h-full border-4 border-black rounded-lg bg-white" style={{ padding: '10px' }}>
              <SignaturePad
                ref={activePad === 'participant' ? participantPadRef : guardianPadRef}
                fullScreen={false}
                onChange={activePad === 'participant' ? setLiveParticipant : setLiveGuardian}
                initialData={(activePad === 'participant' ? (participantSignature && !participantSignature.startsWith('data:') ? `/signatures/${participantSignature}` : '') : (guardianSignature && !guardianSignature.startsWith('data:') ? `/signatures/${guardianSignature}` : ''))}
                strokeWidth={2}
              />
            </div>
          </div>
          <div className="p-4 border-t border-gray-300 flex justify-center gap-3">
            <button onClick={() => { try { const d = (activePad === 'participant' ? participantPadRef.current.getDataURL() : guardianPadRef.current.getDataURL()); if (activePad === 'participant') setLiveParticipant(d); else setLiveGuardian(d); } catch (e) {} saveSignature(activePad) }} className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-lg font-semibold">Save</button>
            <button onClick={() => { try { if (activePad === 'participant') participantPadRef.current.clear(); else guardianPadRef.current.clear(); } catch (e) {} if (activePad === 'participant') { setParticipantSignature(''); setParticipantDate('') } else { setGuardianSignature(''); setGuardianDate('') } setMessage('Signature cleared') }} className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg shadow-lg font-semibold">Clear</button>
            <button onClick={() => setActivePad(null)} className="px-6 py-3 bg-gray-500 text-white rounded-lg shadow-lg font-semibold">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
