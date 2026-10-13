export const promptCategories = ['DISCOVERY', 'RECOMMENDATION', 'COMMERCIAL', 'LOCAL', 'COMPARISON', 'SERVICE'];

export function validatePrompt(input) {
  const text = input?.text?.trim();
  if (typeof text !== 'string' || text.length < 5 || text.length > 500) throw new Error('Prompt must be 5–500 characters.');
  if (!promptCategories.includes(input?.category)) throw new Error('Choose a valid prompt category.');
  return { text, category: input.category, active: input.active !== false };
}

function discoveryTerms(business) {
  const rawCategory = String(business.category || '').trim().toLowerCase();
  const name = String(business.name || '').trim().toLowerCase();
  const firstNameWord = name.split(/\s+/)[0];
  // A brand may start with its industry noun (for example, "Furniture House").
  // Keep that noun so a furniture store does not collapse into generic "store" prompts.
  const industryNouns = /^(?:furniture|dental|medical|health|fitness|beauty|fashion|clothing|shoe|sports|food|coffee|book|travel|hotel|restaurant|real estate|software|marketing|education|learning|car|auto|pet|home|garden|electronics|jewelry|jewellery)$/i;
  const brandTerms = [name, firstNameWord.length >= 4 && !industryNouns.test(firstNameWord) ? firstNameWord : ''].filter(Boolean);
  const category = (brandTerms.reduce((value, term) => {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return value.replace(new RegExp(`(^|[^\\p{L}\\p{N}])${escaped}(?=$|[^\\p{L}\\p{N}])`, 'giu'), '$1');
  }, rawCategory).replace(/\b(?:by|from)\s*$/i, '').replace(/\s+/g, ' ').trim()) || 'local service';
  const store = category.match(/^(.*?)\s+(?:store|shop|retailer)$/);
  const topic = store ? (store[1] === 'sports' ? 'sports gear' : store[1]) : category
    .replace(/\bacademy$/, 'coaching')
    .replace(/\brestaurant$/, 'food')
    .replace(/\bclinic$/, 'care')
    .replace(/\bagency$/, 'services')
    .replace(/\bsalon$/, 'services')
    .replace(/\bhotel$/, 'hotel stay');
  const countable = category.match(/\b(store|shop|restaurant|academy|clinic|agency|studio|service|provider|company|platform|app|tool|salon|gym|hotel)$/);
  const plural = category.endsWith('y') ? `${category.slice(0, -1)}ies`
    : category.endsWith('s') ? category : `${category}s`;
  const options = store ? `${store[1]} stores` : countable
    ? plural
    : `${category} options`;
  const digital = /\b(software|platform|online|digital|app|website|web tool|saas)\b/.test(category);
  return { topic, options, digital, city: business.city || 'my area', country: business.country || 'my country' };
}

export function generatePrompts(business) {
  const { topic, options, digital, city, country } = discoveryTerms(business);
  const place = digital ? 'online' : `in ${city}`;
  const candidates = [
    ['DISCOVERY', `What are the best ${options} ${digital ? 'available online' : `near me in ${city}`}?`],
    ['DISCOVERY', `Where can I find affordable, good-quality ${topic}${digital ? '' : ` in ${city}`}?`],
    ['DISCOVERY', `What should I look for when choosing ${topic}?`],
    ['DISCOVERY', `Which ${options} have strong customer reviews?`],
    ['RECOMMENDATION', `Which ${options} would you recommend ${place}?`],
    ['RECOMMENDATION', `What is a reliable option for ${topic} ${place}?`],
    ['RECOMMENDATION', `Which ${options} are good for first-time customers?`],
    ['RECOMMENDATION', `Which ${options} offer good value for the money?`],
    ['COMMERCIAL', `How much does ${topic} usually cost ${place}?`],
    ['COMMERCIAL', `Where can I get good value for ${topic} ${place}?`],
    ['COMMERCIAL', `Are there budget-friendly ${options} that still offer good quality?`],
    ['LOCAL', digital ? `Which ${options} are available to customers in ${country}?` : `Which ${options} are near me in ${city}?`],
    ['LOCAL', digital ? `What ${topic} can I use fully online?` : `Where can I find ${topic} in ${city}?`],
    ['LOCAL', `Which ${options} serve customers in ${digital ? country : city}?`],
    ['COMPARISON', `How do popular ${options} ${place} compare on price and quality?`],
    ['COMPARISON', digital ? `What are the trade-offs between free and paid ${topic}?` : `What are the trade-offs between local and larger ${options}?`],
    ['COMPARISON', `What are the main differences among ${options} ${place}?`],
    ['SERVICE', `What service or support should I expect from ${options}?`],
    ['SERVICE', `Which ${options} make it easiest to get started?`],
    ['SERVICE', `What questions should I ask before choosing among ${options}?`],
  ];
  const seen = new Set();
  return candidates.filter(([, text]) => {
    const key = text.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).map(([category, text]) => ({ category, text: text.slice(0, 500), active: true }));
}

// Additional customer questions remain generic; suggestions are never saved until added.
export function generatePromptSuggestions(business) {
  const starter = generatePrompts(business);
  const { topic, options, digital, city } = discoveryTerms(business);
  const where = digital ? 'online' : `in ${city}`;
  const extra = [
    ['DISCOVERY', `Which ${options} are easiest to compare ${where}?`],
    ['DISCOVERY', `How can I check whether ${options} are trustworthy?`],
    ['RECOMMENDATION', `Which ${options} suit someone on a tight budget?`],
    ['RECOMMENDATION', `What are good alternatives for ${topic} ${where}?`],
    ['COMMERCIAL', `What hidden costs should I ask about for ${topic}?`],
    ['COMMERCIAL', `Which ${options} have transparent pricing?`],
    ['LOCAL', `Which ${options} can help customers quickly ${where}?`],
    ['LOCAL', `Are there well-reviewed ${options} ${where}?`],
    ['COMPARISON', `How should I compare quality among ${options}?`],
    ['COMPARISON', `Which ${options} offer the best support after purchase?`],
    ['SERVICE', `What do customers say about service from ${options}?`],
    ['SERVICE', `What should I ask ${options} about availability?`],
  ];
  return [...starter, ...extra.map(([category, text]) => ({ category, text, active: true }))];
}
