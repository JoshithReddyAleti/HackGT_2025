import payerData from '../mockData/payer.json';

export interface Payer {
  patient_id: string;
  payer: string;
  candidate_codes: string[];
  formulary_status: string;
  estimated_cost: number;
}

export function getPayer(patientId: string): Payer | undefined {
  return (payerData as Payer[]).find(row => row.patient_id === patientId);
}
