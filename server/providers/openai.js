// One provider boundary. Future providers implement the same runPrompt contract.
export function createOpenAIProvider({ apiKey, model, fetchImpl = fetch }) {
  if (!apiKey || !model) throw new Error('OPENAI_API_KEY and OPENAI_MODEL are required.');
  return {
    name: 'openai', model,
    async runPrompt(prompt) {
      const response = await fetchImpl('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model, store: false, max_output_tokens: 800,
          instructions: 'Answer the customer question naturally and independently. Do not assume facts that are not in the question. If uncertain, say so.',
          input: prompt,
        }),
        signal: AbortSignal.timeout(90000),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(`OpenAI request failed (${response.status}): ${payload.error?.message || 'Unknown error'}`);
      if (payload.status !== 'completed') throw new Error(`OpenAI response status: ${payload.status || 'unknown'}`);
      const parts = (payload.output || []).flatMap(item => item.content || []).filter(part => part.type === 'output_text');
      const responseText = parts.map(part => part.text || '').join('\n').trim();
      if (!responseText) throw new Error('OpenAI returned no answer text.');
      const citations = parts.flatMap(part => part.annotations || []).filter(annotation => annotation.url).map(annotation => ({ url: annotation.url, title: annotation.title || '' }));
      return {
        provider: 'openai', model: payload.model || model, prompt, responseText, citations,
        timestamp: new Date().toISOString(),
        metadata: { responseId: payload.id, usage: payload.usage || null, status: payload.status },
        providerPayload: payload,
      };
    },
  };
}
