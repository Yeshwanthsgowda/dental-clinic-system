import { createGroqModel, formatMessages, cosineSimilarity } from '../aiClient.js';
import { SystemMessage, HumanMessage } from '@langchain/core/messages';
import { getTreatmentsTool } from '../tools/doctorTools.js';

const TREATMENT_PROMPT = `You are a dental treatment advisor. Help patients understand treatments based on their symptoms.

Your tasks:
1. Analyze patient symptoms
2. Match symptoms to appropriate treatments
3. Explain treatment benefits, duration, and pricing
4. Never diagnose - always recommend consulting with a dentist

Be clear and empathetic.`;

const SYMPTOM_KEYWORDS = {
  CLEANING: ['clean', 'plaque', 'tartar', 'stain', 'polish', 'hygiene', 'checkup'],
  FILLING: ['cavity', 'hole', 'decay', 'pain', 'sensitive', 'toothache'],
  ROOT_CANAL: ['severe pain', 'infection', 'abscess', 'swelling', 'pus'],
  EXTRACTION: ['remove', 'pull', 'wisdom', 'broken', 'damaged beyond repair'],
  ORTHODONTICS: ['crooked', 'misaligned', 'braces', 'straighten', 'gap', 'overbite'],
  COSMETIC: ['whitening', 'veneer', 'aesthetic', 'smile', 'appearance', 'discolored'],
  SURGERY: ['implant', 'gum surgery', 'jaw', 'surgical', 'bone graft'],
};

export class TreatmentRecommenderAgent {
  constructor() {
    this.model = createGroqModel(0.6);
  }

  findMatchingTreatments(symptoms, treatments) {
    const symptomsLower = symptoms.toLowerCase();
    const scores = [];

    treatments.forEach(treatment => {
      const keywords = SYMPTOM_KEYWORDS[treatment.category] || [];
      let score = 0;
      
      keywords.forEach(keyword => {
        if (symptomsLower.includes(keyword)) {
          score += 1;
        }
      });

      if (treatment.description && symptomsLower.includes(treatment.description.toLowerCase())) {
        score += 0.5;
      }

      if (score > 0) {
        scores.push({ treatment, score });
      }
    });

    return scores.sort((a, b) => b.score - a.score).slice(0, 3);
  }

  async invoke(input, context = {}) {
    const { doctorId, history = [] } = context;
    
    // Get all treatments
    const treatmentsResult = await getTreatmentsTool.func({ doctorId });
    const treatments = JSON.parse(treatmentsResult);

    // Find matching treatments based on symptoms
    const matches = this.findMatchingTreatments(input, treatments);

    if (matches.length === 0) {
      return {
        content: 'Based on your symptoms, I recommend scheduling a consultation with our dentist for a proper diagnosis. Please describe your symptoms in more detail or book an appointment.',
        recommendedTreatments: [],
      };
    }

    const matchedTreatments = matches.map(m => ({
      name: m.treatment.name,
      category: m.treatment.category,
      description: m.treatment.description,
      duration: m.treatment.duration,
      price: m.treatment.price,
      doctor: m.treatment.doctor.name,
    }));

    const messages = [
      new SystemMessage(TREATMENT_PROMPT),
      new SystemMessage(`Matching treatments: ${JSON.stringify(matchedTreatments)}`),
      new HumanMessage(input),
    ];

    const response = await this.model.invoke(messages);
    
    return {
      content: response.content,
      recommendedTreatments: matches.map(m => m.treatment),
    };
  }
}
