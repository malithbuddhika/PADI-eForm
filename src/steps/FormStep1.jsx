import { useEffect, useState } from 'react'
import SignaturePad from '../SignaturePad.jsx'

export default function FormStep1 ({ user, draft, onDraft }) {
  const [fieldA, setFieldA] = useState(draft?.fieldA || '')
  const [signature, setSignature] = useState(draft?.signature || '')

  useEffect(() => {
    setFieldA(draft?.fieldA || '')
    setSignature(draft?.signature || '')
  }, [draft])

  return (
    <div>
      <h2 className="text-lg font-semibold">Personal Info</h2>
      <p className="text-sm text-gray-600">Please confirm your personal information.</p>

      <div className="mt-3">
        <label className="block text-sm">Full name</label>
        <input className="w-full border p-2 rounded bg-gray-100" value={user?.name || ''} readOnly />
      </div>

      <div class="max-w-3xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-md">
        <h1 class="text-2xl md:text-3xl font-bold text-center mb-6 text-blue-800">Standard Safe Diving Practices Statement of Understanding</h1>
        <h2 class="text-xl font-semibold text-center mb-8">PADI</h2>

        <div class="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700">
            <p class="font-bold">Please read carefully before signing.</p>
        </div>

        <p class="mb-6">
            The purpose of this statement is to inform you of the established safe diving practices for snorkeling and scuba diving. These practices have been compiled for your review and acknowledgment to enhance your comfort and safety while diving. You must sign this statement to acknowledge that you understand these safe diving practices. Please read and discuss the contents of this statement before signing. If you are a minor, a parent or guardian must also sign this statement.
        </p>

        <p class="mb-6">
            I, <span class="font-bold underline">(Please print full name)</span> ______, understand that as a diver, I should:
        </p>

        <ol class="list-decimal pl-5 mb-6 space-y-4">
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

        <p class="mb-8">
            <strong>I understand the importance and purpose of these established practices. I understand that they are for my safety and health, and that failure to adhere to these practices while diving could pose a risk to me.</strong>
        </p>

        <table class="w-full mb-8">
            <tr>
                <td class="py-2 pr-4 align-top font-semibold">Participant Signature</td>
                <td class="py-2 border-b border-gray-400 w-3/5"></td>
                <td class="py-2 px-4 align-top font-semibold">Date (DD/MM/YYYY)</td>
                <td class="py-2 border-b border-gray-400 w-2/5"></td>
            </tr>
            <tr>
                <td class="py-2 pr-4 align-top font-semibold">Parent/Guardian Signature (if applicable)</td>
                <td class="py-2 border-b border-gray-400 w-3/5"></td>
                <td class="py-2 px-4 align-top font-semibold">Date (DD/MM/YYYY)</td>
                <td class="py-2 border-b border-gray-400 w-2/5"></td>
            </tr>
        </table>

        <div class="text-center text-sm text-gray-600">
            <p>Product No. 100605C (Rev. 02/19) Version 2.01 © PADI 2015</p>
        </div>
    </div>

      <div className="mt-3">
        <label className="block text-sm">Signature</label>
        <SignaturePad
          onChange={setSignature}
          initialData={signature && !signature.startsWith('data:') ? `/signatures/${signature}` : signature}
        />
      </div>

      <div className="mt-3 flex justify-end gap-2">
        <button onClick={() => onDraft({ fieldA }, signature)} className="px-4 py-2 bg-blue-600 text-white rounded">Next</button>
      </div>
    </div>
  )
}

