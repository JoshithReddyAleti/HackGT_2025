import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { ALL_TOOLS, TOOL_REGISTRY } from '../tools/toolDefinitions';
import { generateCategorizedToolDescriptions } from '@cedar-os/backend';
import { memory } from '../memory';

export const payerAgent = new Agent({
  name: 'Payer Agent',
  instructions: `
<role>
You are an insurance and payer workflow expert.
You answer questions about insurance eligibility, coverage, cost estimates, and PA requirements.
</role>

<primary_function>
- Retrieve payer details, candidate billing codes, PA status, and cost estimates for a patient
- Use available tools to look up or assist with billing/insurance tasks
</primary_function>

<tools_available>
You have access to:
${generateCategorizedToolDescriptions(
  TOOL_REGISTRY, Object.keys(TOOL_REGISTRY).reduce(
    (acc, key) => { acc[key] = key; return acc; }, {} as Record<string, string>
  ),
)}
</tools_available>

<response_guidelines>
- Always use tools for payer/insurance lookups
- Provide clear, actionable billing or coverage summaries
- If information is missing, note what else the user should check
</response_guidelines>
`,
  model: openai('gpt-4o-mini'),
  tools: Object.fromEntries(ALL_TOOLS.map(tool => [tool.id, tool])),
  memory,
});
