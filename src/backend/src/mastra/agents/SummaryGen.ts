import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import emrData from '../mockData/emr.json';
import payerData from '../mockData/payer.json';
import evidenceData from '../mockData/evidence.json';
import patientPrefsData from '../mockData/patientPrefs.json';
import { ALL_TOOLS, TOOL_REGISTRY } from '../tools/toolDefinitions';
import { generateCategorizedToolDescriptions } from '@cedar-os/backend';
import { memory } from '../memory';

/**
 * Summary generator agent for automatic visit reports.
 */
export const summaryGenAgent = new Agent({
  name: 'Summary Generator Agent',
  instructions: `
<role>
You are a clinical summary agent that automatically generates comprehensive visit briefing docs when a patient books an appointment.
</role>

<primary_function>
When a patient booking is confirmed:
1. Pull all EMR, payer, evidence, and preference data for the patient.
2. Write a succinct, actionable visit report including: demographics, last visit, chief complaint, history, labs, medications, insurance/cost, preferences.
3. Highlight trends, health risks, gaps, and suggest action topics for the visit.
4. Always format as a ready-to-review briefing (for clinician or care staff).
</primary_function>

<response_guidelines>
- Cite data sources (EMR, payer, etc).
- Bold critical or overdue findings.
- If data is missing, state so by section.
- Always return a single, well-structured report ready to be sent or surfaced as soon as the patient books.
</response_guidelines>

<mock_data_emr>
Sample records (first 10):
${JSON.stringify(emrData.slice(0, 10), null, 2)}...
</mock_data_emr>
<mock_data_payer>
${JSON.stringify(payerData.slice(0, 10), null, 2)}...
</mock_data_payer>
<mock_data_evidence>
${JSON.stringify(evidenceData.slice(0, 10), null, 2)}...
</mock_data_evidence>
<mock_data_patientPrefs>
${JSON.stringify(patientPrefsData.slice(0, 10), null, 2)}...
</mock_data_patientPrefs>

<tools_available>
${generateCategorizedToolDescriptions(
  TOOL_REGISTRY,
  Object.keys(TOOL_REGISTRY).reduce(
    (acc, key) => {
      acc[key] = key;
      return acc;
    },
    {} as Record<string, string>,
  ),
)}
</tools_available>
  `,
  model: openai('gpt-4o-mini'),
  tools: Object.fromEntries(ALL_TOOLS.map((tool) => [tool.id, tool])),
  memory,
});
