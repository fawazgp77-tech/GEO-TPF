import { basicFields } from './business.js';

export function validateCreationId(value) {
  if (value === undefined) return undefined;
  if (typeof value !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value))
    throw new Error('Invalid business creation request.');
  return value.toLowerCase();
}

export function confirmCreationMatch(existing, fields) {
  if (!basicFields.every(([key]) => String(existing[key] || '') === fields[key]))
    throw new Error('This creation request has different business details. Reopen the saved business before continuing.');
  return existing;
}

export async function createOwnedBusiness(client, userId, fields, creationId) {
  const columns = 'id,name,website,category,country,city,branch,created_at';
  const read = async () => {
    const result = await client.from('businesses').select(columns).eq('id', creationId).eq('user_id', userId).maybeSingle();
    if (result.error) throw new Error(result.error.message);
    return result.data;
  };
  if (creationId) {
    const existing = await read();
    if (existing) return confirmCreationMatch(existing, fields);
  }
  const { data, error } = await client.from('businesses').insert({ ...fields, user_id: userId, ...(creationId ? { id: creationId } : {}) }).select(columns).single();
  if (error?.code === '23505' && creationId) {
    const existing = await read();
    if (existing) return confirmCreationMatch(existing, fields);
    throw new Error('Unable to recover this business creation request. Open your business list and try again.');
  }
  if (error) throw new Error(error.message || 'Business creation failed.');
  return data;
}
