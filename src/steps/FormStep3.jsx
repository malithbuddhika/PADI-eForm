import React, { useState } from 'react';

const DiverMedicalForm = () => {
  const [formData, setFormData] = useState({
    // Main questions
    q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: '', q9: '', q10: '',
    // Box questions
    boxA: { q1: '', q2: '', q3: '', q4: '', q5: '' },
    boxB: { q1: '', q2: '', q3: '', q4: '' },
    boxC: { q1: '', q2: '', q3: '', q4: '' },
    boxD: { q1: '', q2: '', q3: '', q4: '', q5: '' },
    boxE: { q1: '', q2: '', q3: '', q4: '' },
    boxF: { q1: '', q2: '', q3: '', q4: '', q5: '' },
    boxG: { q1: '', q2: '', q3: '', q4: '', q5: '', q6: '' },
    // Signature
    participantName: '',
    date: '',
    birthdate: '',
    instructorName: '',
    facilityName: ''
  });

  const handleMainQuestionChange = (question, value) => {
    setFormData(prev => ({
      ...prev,
      [question]: value
    }));
  };

  const handleBoxQuestionChange = (box, question, value) => {
    setFormData(prev => ({
      ...prev,
      [box]: {
        ...prev[box],
        [question]: value
      }
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Check if physician evaluation is required
  const requiresPhysicianEvaluation = 
    formData.q3 === 'yes' || 
    formData.q5 === 'yes' || 
    formData.q10 === 'yes' ||
    Object.values(formData.boxA).includes('yes') ||
    Object.values(formData.boxB).includes('yes') ||
    Object.values(formData.boxC).includes('yes') ||
    Object.values(formData.boxD).includes('yes') ||
    Object.values(formData.boxE).includes('yes') ||
    Object.values(formData.boxF).includes('yes') ||
    Object.values(formData.boxG).includes('yes');

  const allNo = 
    formData.q1 === 'no' && formData.q2 === 'no' && formData.q3 === 'no' && 
    formData.q4 === 'no' && formData.q5 === 'no' && formData.q6 === 'no' && 
    formData.q7 === 'no' && formData.q8 === 'no' && formData.q9 === 'no' && 
    formData.q10 === 'no';

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission logic here
  };

  const renderBoxQuestion = (box, number, question) => (
    <div className="mb-3">
      <label className="block mb-2 text-sm">{question}</label>
      <div className="flex gap-4">
        <label className="flex items-center gap-2">
          <input 
            type="radio" 
            name={`${box}_q${number}`} 
            value="yes" 
            checked={formData[box][`q${number}`] === 'yes'}
            onChange={(e) => handleBoxQuestionChange(box, `q${number}`, e.target.value)}
            className="w-4 h-4"
          />
          Yes ☐*
        </label>
        <label className="flex items-center gap-2">
          <input 
            type="radio" 
            name={`${box}_q${number}`} 
            value="no" 
            checked={formData[box][`q${number}`] === 'no'}
            onChange={(e) => handleBoxQuestionChange(box, `q${number}`, e.target.value)}
            className="w-4 h-4"
          />
          No ☐
        </label>
      </div>
    </div>
  );

  const renderQuestionWithBox = (number, question, box, boxQuestions) => (
    <div className="border-b pb-4">
      <div className="flex items-start gap-4">
        <span className="font-bold min-w-6">{number}</span>
        <div className="flex-1">
          <label className="block mb-2">{question}</label>
          <div className="flex gap-4 mb-3">
            <label className="flex items-center gap-2">
              <input 
                type="radio" 
                name={`q${number}`} 
                value="yes" 
                checked={formData[`q${number}`] === 'yes'}
                onChange={(e) => handleMainQuestionChange(`q${number}`, e.target.value)} 
                className="w-4 h-4"
              />
              Yes ☐ Go to box {box}
            </label>
            <label className="flex items-center gap-2">
              <input 
                type="radio" 
                name={`q${number}`} 
                value="no" 
                checked={formData[`q${number}`] === 'no'}
                onChange={(e) => handleMainQuestionChange(`q${number}`, e.target.value)}
                className="w-4 h-4"
              />
              No ☐
            </label>
          </div>
          
          {/* Box appears right below the question when "Yes" is selected */}
          {formData[`q${number}`] === 'yes' && (
            <div className="mt-4 p-4 border-2 border-blue-500 rounded-lg bg-blue-50">
              <h3 className="font-bold text-lg mb-4">BOX {box} – I HAVE/HAVE HAD:</h3>
              <div className="space-y-3">
                {boxQuestions}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderSimpleQuestion = (number, question) => (
    <div className="border-b pb-4">
      <div className="flex items-start gap-4">
        <span className="font-bold min-w-6">{number}</span>
        <div className="flex-1">
          <label className="block mb-2">{question}</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input 
                type="radio" 
                name={`q${number}`} 
                value="yes" 
                checked={formData[`q${number}`] === 'yes'}
                onChange={(e) => handleMainQuestionChange(`q${number}`, e.target.value)} 
                className="w-4 h-4"
              />
              Yes ☐
            </label>
            <label className="flex items-center gap-2">
              <input 
                type="radio" 
                name={`q${number}`} 
                value="no" 
                checked={formData[`q${number}`] === 'no'}
                onChange={(e) => handleMainQuestionChange(`q${number}`, e.target.value)}
                className="w-4 h-4"
              />
              No ☐
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-800 mb-2">
            Diver Medical | Participant Questionnaire
          </h1>
          <div className="text-sm text-gray-600">
            <span>© 2020</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Header Section */}
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
            <p className="font-bold">Please read carefully before signing.</p>
          </div>

          <div className="prose max-w-none">
            <p>Recreational scuba diving and freediving requires good physical and mental health. There are a few medical conditions which can be hazardous while diving, listed below. Those who have, or are predisposed to, any of these conditions, should be evaluated by a physician.</p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-bold mb-2">Directions</h3>
            <p><strong>Complete this questionnaire as a prerequisite to a recreational scuba diving or freediving course.</strong></p>
            <p><strong>Note to women:</strong> If you are pregnant, or attempting to become pregnant, do not dive.</p>
          </div>

          {/* Main Questions with Boxes Integrated */}
          <div className="space-y-4">
            {/* Question 1 with Box A */}
            {renderQuestionWithBox(1, 
              "I have had problems with my lungs, breathing, heart and/or blood affecting my normal physical or mental performance.", 
              "A",
              <>
                {renderBoxQuestion('boxA', 1, "Chest surgery, heart surgery, heart valve surgery, an implantable medical device (eg, stent, pacemaker, neurostimulator), pneumothorax, and/or chronic lung disease.")}
                {renderBoxQuestion('boxA', 2, "Asthma, wheezing, severe allergies, hay fever or congested airways within the last 12 months that limits my physical activity/exercise.")}
                {renderBoxQuestion('boxA', 3, "A problem or illness involving my heart such as: angina, chest pain on exertion, heart failure, immersion pulmonary edema, heart attack or stroke, OR am taking medication for any heart condition.")}
                {renderBoxQuestion('boxA', 4, "Recurrent bronchitis and currently coughing within the past 12 months, OR have been diagnosed with emphysema.")}
                {renderBoxQuestion('boxA', 5, "Symptoms affecting my lungs, breathing, heart and/or blood in the last 30 days that impair my physical or mental performance.")}
              </>
            )}

            {/* Question 2 with Box B */}
            {renderQuestionWithBox(2, 
              "I am over 45 years of age.", 
              "B",
              <>
                {renderBoxQuestion('boxB', 1, "I currently smoke or inhale nicotine by other means.")}
                {renderBoxQuestion('boxB', 2, "I have a high cholesterol level.")}
                {renderBoxQuestion('boxB', 3, "I have high blood pressure.")}
                {renderBoxQuestion('boxB', 4, "I have had a close blood relative die suddenly or of cardiac disease or stroke before the age of 50, OR have a family history of heart disease before age 50 (including abnormal heart rhythms, coronary artery disease or cardiomyopathy).")}
              </>
            )}

            {/* Question 3 - Simple */}
            {renderSimpleQuestion(3, 
              "I struggle to perform moderate exercise (for example, walk 1.6 kilometer/one mile in 14 minutes or swim 200 meters/yards without resting). OR I have been unable to participate in a normal physical activity due to fitness or health reasons within the past 12 months."
            )}

            {/* Question 4 with Box C */}
            {renderQuestionWithBox(4, 
              "I have had problems with my eyes, ears, or nasal passages/sinuses.", 
              "C",
              <>
                {renderBoxQuestion('boxC', 1, "Sinus surgery within the last 6 months.")}
                {renderBoxQuestion('boxC', 2, "Ear disease or ear surgery, hearing loss, or problems with balance.")}
                {renderBoxQuestion('boxC', 3, "Recurrent sinusitis within the past 12 months.")}
                {renderBoxQuestion('boxC', 4, "Eye surgery within the past 3 months.")}
              </>
            )}

            {/* Question 5 - Simple */}
            {renderSimpleQuestion(5, 
              "I have had surgery within the last 12 months, OR I have ongoing problems related to past surgery."
            )}

            {/* Question 6 with Box D */}
            {renderQuestionWithBox(6, 
              "I have lost consciousness, had migraine headaches, seizures, stroke, significant head injury, or suffer from persistent neurologic injury or disease.", 
              "D",
              <>
                {renderBoxQuestion('boxD', 1, "Head injury with loss of consciousness within the past 5 years.")}
                {renderBoxQuestion('boxD', 2, "Persistent neurologic injury or disease.")}
                {renderBoxQuestion('boxD', 3, "Recurring migraine headaches within the past 12 months, or take medications to prevent them.")}
                {renderBoxQuestion('boxD', 4, "Blackouts or fainting (full/partial loss of consciousness) within the last 5 years.")}
                {renderBoxQuestion('boxD', 5, "Epilepsy, seizures, or convulsions, OR take medications to prevent them.")}
              </>
            )}

            {/* Question 7 with Box E */}
            {renderQuestionWithBox(7, 
              "I am currently undergoing treatment (or have required treatment within the last five years) for psychological problems, personality disorder, panic attacks, or an addiction to drugs or alcohol; or, I have been diagnosed with a learning or developmental disability.", 
              "E",
              <>
                {renderBoxQuestion('boxE', 1, "Behavioral health, mental or psychological problems requiring medical/psychiatric treatment.")}
                {renderBoxQuestion('boxE', 2, "Major depression, suicidal ideation, panic attacks, uncontrolled bipolar disorder requiring medication/psychiatric treatment.")}
                {renderBoxQuestion('boxE', 3, "Been diagnosed with a mental health condition or a learning/developmental disorder that requires ongoing care or special accommodation.")}
                {renderBoxQuestion('boxE', 4, "An addiction to drugs or alcohol requiring treatment within the last 5 years.")}
              </>
            )}

            {/* Question 8 with Box F */}
            {renderQuestionWithBox(8, 
              "I have had back problems, hernia, ulcers, or diabetes.", 
              "F",
              <>
                {renderBoxQuestion('boxF', 1, "Recurrent back problems in the last 6 months that limit my everyday activity.")}
                {renderBoxQuestion('boxF', 2, "Back or spinal surgery within the last 12 months.")}
                {renderBoxQuestion('boxF', 3, "Diabetes, either drug or diet controlled, OR gestational diabetes within the last 12 months.")}
                {renderBoxQuestion('boxF', 4, "An uncorrected hernia that limits my physical abilities.")}
                {renderBoxQuestion('boxF', 5, "Active or untreated ulcers, problem wounds, or ulcer surgery within the last 6 months.")}
              </>
            )}

            {/* Question 9 with Box G */}
            {renderQuestionWithBox(9, 
              "I have had stomach or intestine problems, including recent diarrhea.", 
              "G",
              <>
                {renderBoxQuestion('boxG', 1, "Ostomy surgery and do not have medical clearance to swim or engage in physical activity.")}
                {renderBoxQuestion('boxG', 2, "Dehydration requiring medical intervention within the last 7 days.")}
                {renderBoxQuestion('boxG', 3, "Active or untreated stomach or intestinal ulcers or ulcer surgery within the last 6 months.")}
                {renderBoxQuestion('boxG', 4, "Frequent heartburn, regurgitation, or gastroesophageal reflux disease (GERD).")}
                {renderBoxQuestion('boxG', 5, "Active or uncontrolled ulcerative colitis or Crohn's disease.")}
                {renderBoxQuestion('boxG', 6, "Bariatric surgery within the last 12 months.")}
              </>
            )}

            {/* Question 10 - Simple */}
            {renderSimpleQuestion(10, 
              "I am taking prescription medications (with the exception of birth control or anti-malarial drugs other than mefloquine (Lariam)."
            )}
          </div>

          {/* Signature Section */}
          <div className="mt-8 pt-6 border-t">
            <h2 className="text-xl font-bold mb-4">Participant Signature</h2>

            {allNo && (
              <div className="bg-green-50 p-4 rounded-lg mb-4">
                <p><strong>If you answered NO to all 10 questions above, a medical evaluation is not required.</strong> Please read and agree to the participant statement below by signing and dating it.</p>
              </div>
            )}

            {requiresPhysicianEvaluation && (
              <div className="bg-red-50 p-4 rounded-lg mb-4">
                <p><strong>If you answered YES to questions 3, 5 or 10 above OR to any of the box questions,</strong> please read and agree to the statement above by signing and dating it AND take all three pages of this form (Participant Questionnaire and the Physician's Evaluation Form) to your physician for a medical evaluation. Participation in a diving course requires your physician's approval.</p>
              </div>
            )}

            <div className="prose max-w-none mb-6">
              <p><strong>Participant Statement:</strong> I have answered all questions honestly, and understand that I accept responsibility for any consequences resulting from any questions I may have answered inaccurately or for my failure to disclose any existing or past health conditions.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Participant Signature (or, if a minor, participant's parent/guardian signature required:</label>
                <input 
                  type="text" 
                  className="w-full border-b border-gray-400 focus:border-blue-500 focus:outline-none py-1"
                  value={formData.participantName}
                  onChange={(e) => handleInputChange('participantName', e.target.value)}
                  placeholder="Full name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-2">Date (dd/mm/yyyy)</label>
                  <input 
                    type="text" 
                    className="w-full border-b border-gray-400 focus:border-blue-500 focus:outline-none py-1"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    placeholder="DD/MM/YYYY"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Birthdate (dd/mm/yyyy)</label>
                  <input 
                    type="text" 
                    className="w-full border-b border-gray-400 focus:border-blue-500 focus:outline-none py-1"
                    value={formData.birthdate}
                    onChange={(e) => handleInputChange('birthdate', e.target.value)}
                    placeholder="DD/MM/YYYY"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-2">Instructor Name (Print)</label>
                  <input 
                    type="text" 
                    className="w-full border-b border-gray-400 focus:border-blue-500 focus:outline-none py-1"
                    value={formData.instructorName}
                    onChange={(e) => handleInputChange('instructorName', e.target.value)}
                    placeholder="Instructor name"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Facility Name (Print)</label>
                  <input 
                    type="text" 
                    className="w-full border-b border-gray-400 focus:border-blue-500 focus:outline-none py-1"
                    value={formData.facilityName}
                    onChange={(e) => handleInputChange('facilityName', e.target.value)}
                    placeholder="Facility name"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button 
                type="submit" 
                className="bg-green-600 text-white px-8 py-3 rounded hover:bg-green-700 font-semibold"
              >
                Submit Form
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DiverMedicalForm;