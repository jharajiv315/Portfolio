export const INQUIRY_STATUSES = ['new', 'in_discussion', 'closed'];
export function updateInquiry(data, id, input) {
  const row = (data.messages || []).find(m => String(m.id) === String(id));
  if (!row) throw Object.assign(new Error('Inquiry not found.'), { status: 404 });
  if (input.status !== undefined && !INQUIRY_STATUSES.includes(input.status)) throw Object.assign(new Error('Invalid inquiry status.'), { status: 400 });
  if (input.read !== undefined && typeof input.read !== 'boolean') throw Object.assign(new Error('Read must be true or false.'), { status: 400 });
  if (input.status !== undefined) row.status = input.status;
  if (input.read !== undefined) row.readAt = input.read ? new Date().toISOString() : null;
  return { ...row, _id: row.id };
}
