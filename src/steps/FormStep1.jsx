import { useEffect, useState, useRef } from 'react'
import SignaturePad from '../SignaturePad.jsx'

export default function FormStep1 ({ user, draft, onDraft }) {
  const [fieldA, setFieldA] = useState(draft?.fieldA || '')

  // Signatures and dates
  const [participantSignature, setParticipantSignature] = useState(draft?.participant_signature || draft?.signature || '')
  const [participantDate, setParticipantDate] = useState(draft?.participant_signature_date || '')
  const [guardianSignature, setGuardianSignature] = useState(draft?.guardian_signature || '')
  const [guardianDate, setGuardianDate] = useState(draft?.guardian_signature_date || '')

  

  // birthdate used to determine age (try user.birthday first)
  const [birthdate, setBirthdate] = useState(draft?.birthdate || user?.birthday || '')

  // UI state
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false)
  const [activePad, setActivePad] = useState(null) // 'participant' | 'guardian' | null
  const [message, setMessage] = useState('')
  // temporary live data while drawing to avoid reloading canvas from props
  const [liveParticipant, setLiveParticipant] = useState('')
  const [liveGuardian, setLiveGuardian] = useState('')
  const participantPadRef = useRef(null)
  const guardianPadRef = useRef(null)

  useEffect(() => {
    setFieldA(draft?.fieldA || '')
    setParticipantSignature(draft?.participant_signature || draft?.signature || '')
    setParticipantDate(draft?.participant_signature_date || '')
    setGuardianSignature(draft?.guardian_signature || '')
    setGuardianDate(draft?.guardian_signature_date || '')
    setBirthdate(draft?.birthdate || user?.birthday || '')
  }, [draft, user])

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // disable body scroll when fullscreen signature modal is open
  useEffect(() => {
    if (isMobile && activePad) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isMobile, activePad])

  const calcAge = (bd) => {
    if (!bd) return null
    // accept YYYY-MM-DD, DD/MM/YYYY or similar; try Date parse first
    let d = new Date(bd)
    if (isNaN(d)) {
      // try DD/MM/YYYY
      const parts = bd.split('/').map(p => parseInt(p, 10))
      if (parts.length === 3) {
        d = new Date(parts[2], (parts[1] || 1) - 1, parts[0])
      }
    }
    if (isNaN(d)) return null
    const diff = Date.now() - d.getTime()
    const age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))
    return age
  }

  const isUnder18 = (() => {
    const age = calcAge(birthdate)
    return age !== null ? age < 18 : false
  })()

  const formatToday = () => {
    const d = new Date()
    const dd = String(d.getDate()).padStart(2, '0')
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const yyyy = d.getFullYear()
    return `${dd}/${mm}/${yyyy}`
  }

  const saveSignature = (which) => {
    // try to read latest data from pad ref if available
    try {
      if (which === 'participant' && participantPadRef.current) {
        const d = participantPadRef.current.getDataURL()
        if (d) setLiveParticipant(d)
      }
      if (which === 'guardian' && guardianPadRef.current) {
        const d = guardianPadRef.current.getDataURL()
        if (d) setLiveGuardian(d)
      }
    } catch (e) {
      // ignore
    }
    if (which === 'participant') {
      const valueToSave = liveParticipant || participantSignature
      if (!valueToSave) {
        setMessage('No participant signature to save.')
        return
      }
      setParticipantSignature(valueToSave)
      setParticipantDate(formatToday())
      setMessage('Participant signature saved successfully')
      // close modal if on mobile
      setActivePad(null)
    } else if (which === 'guardian') {
      const valueToSave = liveGuardian || guardianSignature
      if (!valueToSave) {
        setMessage('No guardian signature to save.')
        return
      }
      setGuardianSignature(valueToSave)
      setGuardianDate(formatToday())
      setMessage('Guardian signature saved successfully')
      setActivePad(null)
    }
    // persist draft immediately with signatures/dates
    const payload = {
      fieldA,
      birthdate,
      participant_signature: (liveParticipant || participantSignature),
      participant_signature_date: which === 'participant' ? formatToday() : participantDate,
      guardian_signature: (liveGuardian || guardianSignature) || null,
      guardian_signature_date: guardianDate || null
    }
    try {
      onDraft(payload)
    } catch (e) {
      // onDraft may be async/optional - ignore errors here but show message
      console.warn('onDraft error', e)
    }
    // clear the message after 3s
    setTimeout(() => setMessage(''), 3000)
  }

  const handleNext = () => {
    // validation
    if (!participantSignature) {
      setMessage('Participant signature is required.')
      return
    }
    if (isUnder18 && !guardianSignature) {
      setMessage('Parent/Guardian signature is required for participants under 18.')
      return
    }

    // include signature data and dates in draft payload
    const payload = {
      fieldA,
      birthdate,
      participant_signature: participantSignature,
      participant_signature_date: participantDate || formatToday(),
      guardian_signature: guardianSignature || null,
      guardian_signature_date: guardianDate || null
    }
    onDraft(payload)
  }

  return (
    <div>
      <div className="max-w-3xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-md">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 text-blue-800">Standard Safe Diving Practices Statement of Understanding</h1>
        <h2 className="text-xl font-semibold text-center mb-8">PADI</h2>

        <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700">
            <p className="font-bold">Please read carefully before signing.</p>
        </div>

        <p className="mb-6">
            The purpose of this statement is to inform you of the established safe diving practices for snorkeling and scuba diving. These practices have been compiled for your review and acknowledgment to enhance your comfort and safety while diving. You must sign this statement to acknowledge that you understand these safe diving practices. Please read and discuss the contents of this statement before signing. If you are a minor, a parent or guardian must also sign this statement.
        </p>

        <p className="mb-6">
            I, <input className=" font-bold underline" value={user?.name || ''} readOnly />, understand that as a diver, I should:
        </p>

        <ol className="list-decimal pl-5 mb-6 space-y-4">
            <li>Maintain good mental and physical fitness for diving. Avoid being under the influence of alcohol or dangerous drugs when diving. Keep skills sharp through continuing education and review skills in controlled conditions after a period of diving inactivity; refer to my course materials to keep important information up to date.</li>
            <li>Familiarize myself with the dive sites I plan to use. If not familiar, obtain a formal orientation from a knowledgeable local source. If diving conditions are worse than those I have experienced, postpone the dive or choose an alternate site with better conditions. Only engage in dives that are within the scope of my training and experience. Do not engage in cave diving or technical diving unless specifically trained.</li>
            <li>Use complete, well-maintained, reliable equipment that I am familiar with. Check that the equipment is properly fitted and functioning before each dive. When scuba diving, always wear a buoyancy control device (BCD) with a low-pressure inflator, a submersible pressure gauge, an alternate air source, and a dive planning/monitoring device (dive computer, RDP/dive tables—whichever you have been trained to use). Refuse to let unqualified divers use my equipment.</li>
            <li>Listen carefully to dive briefings and directions and respect the advice of those supervising the dive activities. Understand that additional training is required for specialty dives, diving in other regions, and returning to diving after an inactivity of 6 months or more.</li>
            <li>Adhere to the buddy system throughout every dive. Plan the dive—including communication procedures and emergency procedures—with my buddy.</li>
            <li>Be proficient in dive planning (using a dive computer or dive tables). Execute dives as no-decompression dives and maintain a safety margin. Maintain awareness of depth and time during the dive. Do not exceed the maximum depth limits of my training and experience level. Maintain an ascent rate no faster than 18 meters/60 feet per minute. Be a SAFE diver—Slowly Ascend From Every dive. A safety stop is an additional precaution, typically a 3-minute or longer stop at 5 meters/15 feet.</li>
            <li>Maintain proper buoyancy control. Adjust weighting at the surface to achieve neutral buoyancy with an empty BCD. Maintain neutral buoyancy while underwater. Be able to float and rest at the surface. Keep weights clear of obstructions for easy removal and to establish buoyancy in an emergency. Carry at least one surface signaling device (e.g., signal tube, whistle, mirror).</li>
            <li>Breathe properly while diving. Never hold my breath or skip-breathe when breathing compressed air, and avoid excessive hyperventilation when breath-hold diving (snorkeling). Avoid excessive exertion while in and under the water and dive within my limits.</li>
            <li>Use a boat, float, or other surface platform whenever feasible.</li>
            <li>Know and obey local diving laws and regulations, including those related to fishing, hunting, and underwater vehicles.</li>
        </ol>

        <p className="mb-8">
            <strong>I understand the importance and purpose of these established practices. I understand that they are for my safety and health, and that failure to adhere to these practices while diving could pose a risk to me.</strong>
        </p>

        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-2">Birthdate (DD/MM/YYYY)</label>
            <input
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              placeholder="DD/MM/YYYY or YYYY-MM-DD"
              className="w-full border-b border-gray-400 focus:border-blue-500 focus:outline-none py-1"
            />
            <div className="text-sm text-gray-500 mt-1">Detected age: {calcAge(birthdate) ?? 'unknown'}</div>
          </div>
          <div>
            <label className="block font-semibold mb-2">Participant Name (as printed)</label>
            <input className="w-full border-b border-gray-400 focus:border-blue-500 focus:outline-none py-1 font-bold" value={user?.name || ''} readOnly />
          </div>
        </div>

        <div className="text-center text-sm text-gray-600 mb-6">
            <p>Product No. 100605C (Rev. 02/19) Version 2.01 © PADI 2015</p>
        </div>

        {/* Signature area previews */}
        <div className="space-y-6">
          <div>
            <label className="block font-semibold mb-2">Participant Signature</label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                {participantSignature ? (
                  <img src={participantSignature && !participantSignature.startsWith('data:') ? `/signatures/${participantSignature}` : participantSignature} alt="participant signature" className="border rounded" style={{ maxHeight: 160, width: '100%', objectFit: 'contain' }} />
                ) : (
                  <div onClick={() => isMobile ? setActivePad('participant') : setActivePad('participant')} className="h-40 border rounded flex items-center justify-center text-gray-400 cursor-pointer">Tap to sign</div>
                )}
              </div>
              <div className="w-40">
                <label className="block font-semibold">Date</label>
                <input value={participantDate} readOnly placeholder="DD/MM/YYYY" className="w-full border-b border-gray-400 py-1" />
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
                      // save from pad ref
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
              <label className="block font-semibold mb-2">Parent / Guardian Signature (required for minors)</label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  {guardianSignature ? (
                    <img src={guardianSignature && !guardianSignature.startsWith('data:') ? `/signatures/${guardianSignature}` : guardianSignature} alt="guardian signature" className="border rounded" style={{ maxHeight: 160, width: '100%', objectFit: 'contain' }} />
                  ) : (
                    <div onClick={() => setActivePad('guardian')} className="h-40 border rounded flex items-center justify-center text-gray-400 cursor-pointer">Tap to sign</div>
                  )}
                </div>
                <div className="w-40">
                  <label className="block font-semibold">Date</label>
                  <input value={guardianDate} readOnly placeholder="DD/MM/YYYY" className="w-full border-b border-gray-400 py-1" />
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

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={handleNext} className="px-4 py-2 bg-blue-600 text-white rounded">Next</button>
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
  )
}

