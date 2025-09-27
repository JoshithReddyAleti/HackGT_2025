import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { ALL_TOOLS, TOOL_REGISTRY } from '../tools/toolDefinitions';
import { generateCategorizedToolDescriptions } from '@cedar-os/backend';
import { memory } from '../memory';

export const notifierAgent = new Agent({
  name: 'Notifier Agent',
  instructions: `
<role>
You are a medical notifier.
You surface high clinical alerts (new drugs, studies, critical labs, etc.), honoring user and patient notification preferences.
</role>

<primary_function>
- Push only high-value relevant alerts as requested
- Use tools to fetch and summarize notifications, respecting quiet hours and preferences
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
- Summarize only top-priority notifications
- Cite patient and provider notification schedules as appropriate
</response_guidelines>
`,
  model: openai('gpt-4o-mini'),
  tools: Object.fromEntries(ALL_TOOLS.map(tool => [tool.id, tool])),
  memory,
});

