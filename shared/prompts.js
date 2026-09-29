export const promptCategories = ['DISCOVERY', 'RECOMMENDATION', 'COMMERCIAL', 'LOCAL', 'COMPARISON', 'SERVICE'];

export function validatePrompt(input) {
  const text = input?.text?.trim();
  if (typeof text !== 'string' || text.length < 5 || text.length > 500) throw new Error('Prompt must be 5–500 characters.');
  if (!promptCategories.includes(input?.category)) throw new Error('Choose a valid prompt category.');
  return { text, category: input.category, active: input.active !== false };
}

function firstItem(value, fallback) {
  return (value || '').split(/[\n,;]/).map(item => item.trim()).find(Boolean) || fallback;
}

export function generatePrompts(business, truth) {
  const name = truth.officialName || business.name;
  const city = business.city;
  const category = business.category;
  const service = firstItem(truth.services, category);
  const audience = firstItem(truth.audience, 'customers');
  const area = firstItem(truth.areasServed, city);
  const competitor = firstItem(truth.competitors, 'other local providers');
  const candidates = [
    ['DISCOVERY', `What ${category.toLowerCase()} options are available in ${city}?`],
    ['DISCOVERY', `Where can I find ${service.toLowerCase()} in ${city}?`],
    ['DISCOVERY', `What should I look for when choosing a ${category.toLowerCase()} provider?`],
    ['DISCOVERY', `Which businesses serve ${audience.toLowerCase()} in ${area}?`],
    ['RECOMMENDATION', `Which ${category.toLowerCase()} businesses would you recommend in ${city}?`],
    ['RECOMMENDATION', `What is a reliable place for ${service.toLowerCase()} in ${city}?`],
    ['RECOMMENDATION', `Who offers good ${service.toLowerCase()} for ${audience.toLowerCase()}?`],
    ['RECOMMENDATION', `Is ${name} a good choice for ${service.toLowerCase()}?`],
    ['COMMERCIAL', `How much does ${service.toLowerCase()} usually cost in ${city}?`],
    ['COMMERCIAL', `Which ${category.toLowerCase()} providers offer good value in ${city}?`],
    ['COMMERCIAL', `What are the pricing options at ${name}?`],
    ['LOCAL', `What ${category.toLowerCase()} businesses are near ${area}?`],
    ['LOCAL', `Is ${name} open, and where is it located?`],
    ['LOCAL', `Which ${service.toLowerCase()} providers serve ${area}?`],
    ['COMPARISON', `How does ${name} compare with ${competitor}?`],
    ['COMPARISON', `What are the main differences between ${name} and other ${category.toLowerCase()} providers in ${city}?`],
    ['COMPARISON', `Which is better for ${audience.toLowerCase()}: ${name} or ${competitor}?`],
    ['SERVICE', `What products or services does ${name} offer?`],
    ['SERVICE', `Does ${name} provide ${service.toLowerCase()} in ${area}?`],
    ['SERVICE', `Who is ${name} best suited for?`],
  ];
  const seen = new Set();
  return candidates.filter(([, text]) => {
    const key = text.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).map(([category, text]) => ({ category, text: text.slice(0, 500), active: true }));
}
