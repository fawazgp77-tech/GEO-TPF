// The scan service stores the normalized answer and the untouched provider payload.
export function createGeminiProvider({ apiKey, model = 'gemini-3.5-flash-lite', fetchImpl = fetch }) {
  if (!apiKey) throw new Error('GEMINI_API_KEY is required.');
  if (!/^gemini-[a-z0-9.-]+$/.test(model)) throw new Error('GEMINI_MODEL must be a Gemini model ID.');

  return {
    name: 'gemini', model,
    async analyzeResponses(items) {
      const evidence = items.map((item, index) => ({ number: item.number || index + 1, question: item.prompt,
        answer: item.answer.slice(0, 5000) }));
      const response = await fetchImpl(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: 'POST',
        headers: { 'x-goog-api-key': apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: 'Analyze only the provided AI answers as evidence. Summarize patterns across them. Do not treat claims as verified facts about the business. Do not invent evidence or imply a recommendation was made unless it appears in an answer. Return concise JSON with summary (string), themes (array of objects with title, finding, promptNumbers), and limitations (string). Cite prompt numbers in each theme.' }] },
          contents: [{ role: 'user', parts: [{ text: JSON.stringify(evidence) }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
        signal: AbortSignal.timeout(90000),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        const error = new Error(`Gemini analysis failed (${response.status}): ${payload.error?.message || 'Unknown error'}`);
        error.status = response.status;
        throw error;
      }
      const candidate = payload.candidates?.[0];
      if (candidate?.finishReason && candidate.finishReason !== 'STOP') throw new Error(`Gemini analysis stopped: ${candidate.finishReason}`);
      const content = (candidate?.content?.parts || []).map(part => part.text || '').join('');
      let report;
      try { report = JSON.parse(content); } catch { throw new Error('Gemini analysis was not valid JSON.'); }
      if (typeof report.summary !== 'string' || !Array.isArray(report.themes) || typeof report.limitations !== 'string')
        throw new Error('Gemini analysis was missing required fields.');
      const validNumbers = new Set(evidence.map(item => item.number));
      report = { summary: report.summary.slice(0, 4000), limitations: report.limitations.slice(0, 2000),
        themes: report.themes.slice(0, 8).filter(theme => typeof theme.title === 'string' && typeof theme.finding === 'string')
          .map(theme => ({ title: theme.title.slice(0, 150), finding: theme.finding.slice(0, 1000),
            promptNumbers: (Array.isArray(theme.promptNumbers) ? theme.promptNumbers : [])
              .filter(number => Number.isInteger(number) && validNumbers.has(number)) })) };
      return { report, providerPayload: payload };
    },
    async runPrompt(prompt) {
      const response = await fetchImpl(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: 'POST',
        headers: { 'x-goog-api-key': apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: 'Answer the customer question naturally and independently. Do not assume facts that are not in the question. If uncertain, say so.' }] },
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
        }),
        signal: AbortSignal.timeout(90000),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        const error = new Error(`Gemini request failed (${response.status}): ${payload.error?.message || 'Unknown error'}`);
        error.status = response.status;
        throw error;
      }

      const candidate = payload.candidates?.[0];
      if (candidate?.finishReason && candidate.finishReason !== 'STOP') {
        throw new Error(`Gemini response stopped: ${candidate.finishReason}`);
      }
      const responseText = (candidate?.content?.parts || [])
        .map(part => part.text || '').filter(Boolean).join('').trim();
      if (!responseText) throw new Error(`Gemini returned no answer text${payload.promptFeedback?.blockReason ? ` (${payload.promptFeedback.blockReason})` : ''}.`);

      const citations = (candidate.groundingMetadata?.groundingChunks || [])
        .filter(chunk => chunk.web?.uri)
        .map(chunk => ({ url: chunk.web.uri, title: chunk.web.title || '' }));
      return {
        provider: 'gemini', model: payload.modelVersion || model, prompt, responseText, citations,
        timestamp: new Date().toISOString(),
        metadata: { responseId: payload.responseId || null, usage: payload.usageMetadata || null, finishReason: candidate.finishReason || null },
        providerPayload: payload,
      };
    },
  };
}
