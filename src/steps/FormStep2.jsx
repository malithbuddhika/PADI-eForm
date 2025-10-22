import { useEffect, useState } from 'react';
import SignaturePad from '../SignaturePad.jsx';

export default function FormStep2({ user, draft, onDraft, onBack }) {
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


 <div className="max-w-4xl mx-auto p-6 bg-white font-sans">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Liability Release and Assumption of Risk Agreement</h1>
        <h2 className="text-xl font-semibold mb-4">Non-Agency Disclosure and Acknowledgment Agreement</h2>
        <div className="text-sm text-gray-600 space-y-1">
          <p>In European Union and European Free Trade Association countries use alternative form.</p>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6 text-sm leading-relaxed">
        <p>
          I HAVE FULLY INFORMED MYSELF AND MY HEIRS OF THE CONTENTS OF THIS NON-AGENCY DISCLOSURE AND ACKNOWLEDGMENT AGREEMENT AND LIABILITY RELEASE AND ASSUMPTION OF RISK AGREEMENT BY READING BOTH BEFORE SIGNING BELOW ON BEHALF OF MYSELF AND MY HEIRS.
        </p>

        <p>
          I, <span className="inline-block w-64 border-b border-gray-400 mx-2"></span>, hereby 
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
          <span className="inline-block w-64 border-b border-gray-400 mx-2"></span>,
          the facility through which I receive my instruction, 
          <span className="inline-block w-64 border-b border-gray-400 mx-2"></span>,
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
          I further release, exempt and hold harmless said program and Released Parties from any claim or lawsuit by me, my family, estate, 
          heirs or assigns, arising out of my enrollment and participation in 
          this program including both claims arising during the program or 
          after I receive my certification.
        </p>

        <p>
          I also understand that skin diving and scuba diving are physically 
          strenuous activities and that I will be exerting myself during this 
          program, and that if I am injured as a result of heart attack, panic, 
          hyperventilation, drowning or any other cause, that I expressly assume the risk of said injuries and that I will not hold the Released 
          Parties responsible for the same. 
        </p>

        <p>
          I further state that I am of lawful age and legally competent to sign 
          this liability release, or that I have acquired the written consent of 
          my parent or guardian. I understand the terms herein are contractual 
          and not a mere recital, and that I have signed this Agreement of my 
          own free act and with the knowledge that I hereby agree to waive 
          my legal rights. I further agree that if any provision of this Agreement is found to be unenforceable or invalid, that provision shall be 
          severed from this Agreement. The remainder of this Agreement will 
          then be construed as though the unenforceable provision had never 
          been contained herein.
        </p>

        <p>
          I understand and agree that I am not only giving up my right to sue 
          the Released Parties but also any rights my heirs, assigns, or beneficiaries may have to sue the Released Parties resulting from my death. 
          I further represent I have the authority to do so and that my heirs, 
          assigns, or beneficiaries will be estopped from claiming otherwise 
          because of my representations to the Released Parties.
        </p>

        {/* Non-Agency Section */}
        <div className="mt-8">
          <p>
            I understand and agree that PADI Members ("Members"), including <span className="inline-block w-64 border-b border-gray-400 mx-2"></span> 
            and/or any individual PADI Instructors and Divemasters associated with the program in which I am participating, are licensed to use various PADI Trademarks and to conduct PADI training, but are not agents, employees or franchisees of PADI 
            Americas, Inc, or its parent, subsidiary and affiliated corporations ("PADI"). I further understand that Member business activities 
            are independent, and are neither owned nor operated by PADI, and that while PADI establishes the standards for PADI diver training programs, it is not responsible for, nor does it have the right to control, the operation of the Members' business activities and 
            the day-to day conduct of PADI programs and supervision of divers by the Members or their associated staff. I further understand 
            and agree on behalf of myself, my heirs and my estate that in the event of an injury or death during this activity, neither I nor my estate shall seek to hold PADI liable for the actions, inactions or negligence of <span className="inline-block w-64 border-b border-gray-400 mx-2"></span>
            and/or the instructors and divemasters associated with the activity.
          </p>
        </div>

        {/* Final Agreement Section */}
        <div className="mt-8">
          <p>
            I, <span className="inline-block w-64 border-b border-gray-400 mx-2"></span>,
            BY THIS INSTRUMENT AGREE TO EXEMPT AND RELEASE MY 
            INSTRUCTORS, <span className="inline-block w-64 border-b border-gray-400 mx-2"></span>, 
            THE FACILITY THROUGH WHICH I RECEIVE MY INSTRUCTION, 
            <span className="inline-block w-64 border-b border-gray-400 mx-2"></span>, AND 
            PADI AMERICAS, INC., AND ALL RELATED ENTITIES AS DEFINED 
            ABOVE, FROM ALL LIABILITY OR RESPONSIBILITY WHATSOEVER 
            FOR PERSONAL INJURY, PROPERTY DAMAGE OR WRONGFUL DEATH 
            HOWEVER CAUSED, INCLUDING, BUT NOT LIMITED TO, THE NEGLIGENCE OF THE RELEASED PARTIES, WHETHER PASSIVE OR ACTIVE.
          </p>
        </div>

        {/* Signature Sections */}
        <div className="mt-12 space-y-8">
          <div>
            <div className="border-t border-gray-800 mb-2 pt-2">
              <p className="text-sm">Participant's Signature</p>
            </div>
            <div className="border-t border-gray-800 mb-2 pt-2">
              <p className="text-sm">Date (Day / Month / Year)</p>
            </div>
          </div>

          <div>
            <div className="border-t border-gray-800 mb-2 pt-2">
              <p className="text-sm">Signature of Parent or Guardian (where applicable)</p>
            </div>
            <div className="border-t border-gray-800 mb-2 pt-2">
              <p className="text-sm">Date (Day / Month / Year)</p>
            </div>
          </div>

          <div className="flex justify-between items-center mt-8 text-xs text-gray-600">
            <div>
              <p>Participant Name</p>
              <p>Participant Name</p>
            </div>
            <div className="text-right">
              <p>Product No. 10072 (Rev. 10/16) Version 4.03</p>
              <p>© PADI 2016</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Notice */}
      <div className="mt-8 text-center text-sm text-gray-600 border-t border-gray-300 pt-4">
        <p>Please read carefully and fill in all blanks before signing.</p>
        <p>Please read carefully and fill in all blanks before signing.</p>
      </div>
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
        <button onClick={() => onDraft({ fieldB }, signature)} className="px-4 py-2 bg-blue-600 text-white rounded">Next</button>
      </div>
    </div>
  );
}
