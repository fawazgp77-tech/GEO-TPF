export const basicFields = [
  ['name', 'Business name', true], ['website', 'Website', true],
  ['category', 'Category / industry', true], ['country', 'Country', true],
  ['city', 'City', true], ['branch', 'Location / branch', false],
];
export const truthFields = [
  ['officialName', 'Official business name', true], ['description', 'Business description', true],
  ['address', 'Address', true], ['phone', 'Phone', false], ['website', 'Official website', true],
  ['openingHours', 'Opening hours', false], ['services', 'Products / services', true],
  ['audience', 'Primary target audience', true], ['areasServed', 'Areas / cities served', true],
  ['priceRange', 'Price range', false], ['differentiators', 'Important features / differentiators', false],
  ['competitors', 'Known competitors', false], ['otherFacts', 'Other verified facts', false],
];

export function validateFields(input, fields) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Expected an object.');
  const result = {};
  for (const [key, label, required] of fields) {
    const value = input[key] ?? '';
    if (typeof value !== 'string' || value.length > 4000) throw new Error(`${label} must be text of at most 4,000 characters.`);
    result[key] = value.trim();
    if (required && !result[key]) throw new Error(`${label} is required.`);
    if (key === 'website' && result[key]) {
      let url;
      try { url = new URL(result[key]); } catch { throw new Error('Website must be a complete http or https URL.'); }
      if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) throw new Error('Website must be a public http or https URL without credentials.');
    }
  }
  return result;
}
