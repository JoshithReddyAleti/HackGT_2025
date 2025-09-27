import patientPrefsData from '../mockData/patientPrefs.json';

export interface Questionnaire {
  questions: string[];
  responses: string[];
}

export function getQuestionnaire(patientId: string): Questionnaire {
  const prefs = (patientPrefsData as any[]).find(row => row.patient_id === patientId);
  if (!prefs) return { questions: [], responses: [] };
  return {
    questions: prefs.intake_questions || [],
    responses: prefs.intake_responses || []
  };
}
