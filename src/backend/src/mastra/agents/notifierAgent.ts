import evidenceData from '../mockData/evidence.json';
import patientPrefsData from '../mockData/patientPrefs.json';
import type { DrugAlert } from './evidenceAgent';

export interface PatientPrefs {
  patient_id: string;
  pref_contact: string;
  alert_quiet_hours: string;
  intake_questions: string[];
  intake_responses: string[];
}

function isQuietHour(alertQuietHours: string): boolean {
  // Example: "21:00–06:00"
  const [start, end] = alertQuietHours.split('–').map(t => parseInt(t.split(':')[0], 10));
  const nowHour = new Date().getHours();
  if (start < end) {
    return nowHour >= start && nowHour < end;
  } else {
    return nowHour >= start || nowHour < end;
  }
}

export function getNotifications(patientId: string): DrugAlert[] {
  const evidence = (evidenceData as any[]).find(row => row.patient_id === patientId);
  const prefs = (patientPrefsData as PatientPrefs[]).find(row => row.patient_id === patientId);
  if (!evidence || !prefs) return [];
  if (isQuietHour(prefs.alert_quiet_hours)) return [];
  return (evidence.new_drug_alerts || []).filter((alert: DrugAlert) => alert.relevance === 'high');
}
