import evidenceData from '../mockData/evidence.json';

export interface DrugAlert {
  drug: string;
  relevance: string;
  pubmed_link: string;
}
export interface StudyAlert {
  condition: string;
  pubmed_link: string;
}
export interface Evidence {
  patient_id: string;
  pubmed_ids: string[];
  study_summaries: string[];
  new_drug_alerts: DrugAlert[];
  new_study_alerts: StudyAlert[];
}

export function getEvidence(patientId: string): Evidence | undefined {
  return (evidenceData as Evidence[]).find(row => row.patient_id === patientId);
}
