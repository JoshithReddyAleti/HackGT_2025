import emrData from '../mockData/emr.json';

export interface EMR {
  patient_id: string;
  age: number;
  gender: string;
  specialty: string;
  chief_complaint: string;
  symptoms: string[];
  diagnoses: string[];
  medications: string[];
  lab_results: Record<string, number>;
  allergies: string[];
}

export function getEMR(patientId: string): EMR | undefined {
  return (emrData as EMR[]).find(row => row.patient_id === patientId);
}
