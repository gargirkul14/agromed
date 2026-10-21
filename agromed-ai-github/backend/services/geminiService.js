import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_PROMPT = `You are AgroMed AI, a specialized farmer health and safety awareness assistant.
Your mission is to help agricultural workers and farmers understand occupational health risks, pesticide safety, proper PPE usage, heatstroke prevention, hydration, and first aid awareness.

Strict Safety & Medical Rules:
1. Provide general safety and occupational health awareness information only.
2. DO NOT diagnose diseases or prescribe medications.
3. DO NOT claim certainty about any medical condition.
4. Use simple, warm, empathetic, and farmer-friendly language. Avoid complex academic medical jargon.
5. If the user mentions SEVERE symptoms (e.g. difficulty breathing, chest pain, loss of consciousness, seizures, severe chemical ingestion, blurred vision, or uncontrollable vomiting), immediately and prominently instruct them to CEASE work, move to fresh air, and call an ambulance or rush to the nearest emergency medical hospital.
6. Clearly include the disclaimer: "This information is for general educational awareness and does not replace professional medical diagnosis or doctor consultation."
7. Stay focused on farmer occupational health and safety. Politely decline unrelated non-agricultural queries.`;

// Intelligent fallback safety knowledge base if GEMINI_API_KEY is not set or network fails
function getIntelligentFallbackResponse(userMessage) {
  const msg = userMessage.toLowerCase();

  // Severe symptoms emergency check
  if (msg.includes('breathing') || msg.includes('breath') || msg.includes('chest pain') || msg.includes('unconscious') || msg.includes('passed out') || msg.includes('swallowed') || msg.includes('ingested') || msg.includes('seizure')) {
    return `🚨 **URGENT MEDICAL ALERT**:
Please STOP what you are doing immediately and seek emergency medical care.

1. **Move to Fresh Air**: Get away from the chemical field or spraying zone right now.
2. **Sit Upright**: Loosen your collar, buttons, and belt to help your lungs breathe.
3. **Call for Help**: Contact family members or call your local emergency medical service / ambulance.
4. **Bring the Chemical Label**: Take the pesticide or chemical bottle/label with you to the hospital so doctors know the exact active ingredient.

⚠️ *AgroMed AI Disclaimer: This is an emergency safety guideline and cannot replace immediate doctor or hospital care.*`;
  }

  // Dizziness / Nausea post spraying
  if (msg.includes('dizzy') || msg.includes('dizziness') || msg.includes('nausea') || msg.includes('vomit') || msg.includes('headache')) {
    return `Hello! If you are feeling dizzy, nauseous, or have a headache after handling or spraying chemicals, here are immediate safety steps to protect yourself:

1. **Stop Working**: Step away from the treated crops immediately into an open, shaded, well-ventilated area.
2. **Remove Contaminated Clothes**: Take off your outer spraying clothes, boots, and gloves. Wash your face, neck, hands, and arms thoroughly with clean water and soap.
3. **Hydrate**: Drink small sips of clean, cool water or electrolyte water. Do NOT force vomiting.
4. **Rest**: Sit or lie down in a cool spot with your legs slightly raised.
5. **Monitor Closely**: If dizziness does not subside within 30 minutes, or if you develop blurred vision or breathing trouble, please go to a primary health center immediately.

⚠️ *Disclaimer: This information is for general awareness and does not replace professional medical advice.*`;
  }

  // Skin or eye contact
  if (msg.includes('skin') || msg.includes('touch') || msg.includes('rash') || msg.includes('itch') || msg.includes('eye') || msg.includes('burn')) {
    return `If agricultural chemicals or fertilizers have touched your skin or splashed in your eyes:

• **For Eye Splashes**: Flush your eyes immediately with clean, gentle running water for at least 15 continuous minutes. Keep eyelids open. Do not rub your eyes.
• **For Skin Contact**: Remove chemical-soaked clothing immediately. Wash the affected skin area with copious amounts of cool water and mild soap. Avoid harsh scrubbing that can cause micro-tears.
• **Avoid Self-Medication**: Do not apply unapproved ointments, kerosene, or oil over chemical burns.

If redness, burning, or vision blur persists, visit a doctor right away with the chemical name.

⚠️ *Disclaimer: AgroMed AI provides educational first-aid awareness and does not replace clinical medical evaluation.*`;
  }

  // PPE questions
  if (msg.includes('ppe') || msg.includes('glove') || msg.includes('mask') || msg.includes('wear') || msg.includes('protect')) {
    return `Proper Personal Protective Equipment (PPE) is your first shield against farming chemicals:

1. **Chemical Gloves**: Always use chemical-resistant Nitrile or Neoprene gloves. Never use cloth or leather gloves, as they absorb poison.
2. **Respirator Mask**: Wear an organic vapor or N95 mask to prevent inhaling chemical spray mists.
3. **Safety Goggles**: Use non-vented or indirect-vent eye goggles to protect against splashback and wind-blown mist.
4. **Protective Clothing**: Long-sleeved cotton shirts, full pants, or a waterproof chemical apron over workwear.
5. **Rubber Boots**: Knee-high rubber or PVC boots prevent chemicals on wet crops from soaking through your socks.

*Tip: Wash your PPE separately with soap after every single use, and store it away from pesticide storage lockers.*

⚠️ *Disclaimer: AgroMed AI safety guidelines are for education and occupational hazard mitigation.*`;
  }

  // Heatstroke and Hydration
  if (msg.includes('heat') || msg.includes('sun') || msg.includes('hydrat') || msg.includes('water') || msg.includes('sweat')) {
    return `Working under intense sun and high humidity can lead to heat exhaustion or dangerous heatstroke:

1. **Drink Frequently**: Drink 1 glass (200-250 ml) of clean water every 20 minutes, even before you feel thirsty.
2. **Rest in Shade**: Take 10 to 15-minute breaks in natural tree shade or covered shelters during peak heat hours (12:00 PM – 3:00 PM).
3. **Head Protection**: Wear a wide-brimmed cotton or straw hat that covers your neck and scalp.
4. **Electrolyte Replenishment**: Include a pinch of salt and lemon or coconut water during intense sweat sessions to avoid muscle cramps.
5. **Warning Signs**: Rapid heartbeat, confusion, lack of sweat in extreme heat, or fainting means you need immediate shade, cooling fans, and medical attention.

⚠️ *Disclaimer: This information is for occupational health awareness.*`;
  }

  // General pesticide spraying precautions
  if (msg.includes('spray') || msg.includes('precaution') || msg.includes('mix') || msg.includes('chemical')) {
    return `Key Safety Precautions for Handling & Spraying Agrochemicals:

1. **Wind Direction**: Always spray with the wind blowing away from your back. Never walk into your own spray drift.
2. **Check Equipment**: Inspect sprayer tanks, hoses, and nozzles with clean water first to ensure there are no leaks before adding chemicals.
3. **Safe Mixing**: Always mix chemicals outdoors in a well-ventilated spot using measuring sticks or dedicated jugs—never use bare hands.
4. **No Eating or Smoking**: Never eat, drink, chew tobacco, or smoke while handling or spraying chemicals.
5. **Post-Spray Hygiene**: Bathe with soap and change into clean clothing immediately after finishing the spraying session. Wash work clothes separately from family clothes.

⚠️ *Disclaimer: AgroMed AI provides occupational safety education. Always read and follow specific manufacturer label instructions on the chemical container.*`;
  }

  // Default supportive response
  return `Hello! I am AgroMed AI, your farmer health and safety awareness assistant.

I can assist you with:
• Safe handling and spraying of pesticides and fertilizers
• Recommended PPE (gloves, masks, goggles, boots) for farm activities
• Recognizing symptoms of chemical exposure and first-aid steps
• Heatstroke prevention, sun protection, and hydration schedules
• Safe storage and disposal of agrochemicals

How can I assist you with your health and farm safety today?

⚠️ *Disclaimer: AgroMed AI is an educational platform and does not provide medical diagnoses or replace consultations with licensed physicians.*`;
}

/**
 * Generate AI response using Google Gemini API or intelligent safety fallback
 */
export async function generateChatResponse(userMessage, conversationHistory = []) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey.startsWith('your_')) {
    // Graceful intelligent fallback
    return getIntelligentFallbackResponse(userMessage);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_PROMPT
    });

    // Format chat history for context
    const chat = model.startChat({
      history: conversationHistory.map(item => ({
        role: item.sender === 'user' ? 'user' : 'model',
        parts: [{ text: item.text || item.userMessage || item.aiResponse || '' }]
      }))
    });

    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    return response.text();
  } catch (err) {
    console.error('Gemini API request failed, utilizing safety fallback:', err.message);
    return getIntelligentFallbackResponse(userMessage);
  }
}
