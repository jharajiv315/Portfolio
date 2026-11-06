import { get, put } from '@vercel/blob';
const path = 'portfolio/records.json';
export async function readStore() {
  const result = await get(path, { access: 'private', useCache: false });
  if (!result) throw new Error('Portfolio storage has not been initialized');
  return { data: await new Response(result.stream).json(), etag: result.blob.etag.replace(/^W\//, "") };
}
export async function mutateStore(change) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const { data, etag } = await readStore();
    const result = change(data);
    try {
      await put(path, JSON.stringify(data), { access: 'private', addRandomSuffix: false, allowOverwrite: true, ifMatch: etag, contentType: 'application/json' });
      return result;
    } catch (error) {
      if (error.name !== 'BlobPreconditionFailedError' || attempt === 4) throw error;
    }
  }
}
export function documentModel(collection, Instance) {
  const wrap = row => row ? Object.assign(new Instance(row), { _id: row.id }) : null;
  const model = {
    async find() { return (await readStore()).data[collection].map(wrap); },
    async findById(id) { return wrap((await readStore()).data[collection].find(row => String(row.id) === String(id))); },
    async create(input) {
      return wrap(await mutateStore(data => {
        const rows = data[collection];
        const row = { ...input, id: Math.max(0, ...rows.map(r => Number(r.id))) + 1, createdAt: new Date().toISOString() };
        rows.unshift(row); return row;
      }));
    },
    async findByIdAndUpdate(id, updates) {
      return wrap(await mutateStore(data => {
        const row = data[collection].find(r => String(r.id) === String(id));
        if (!row) return null;
        for (const [key, value] of Object.entries(updates)) if (value !== undefined && !['id', '_id'].includes(key)) row[key] = value;
        return row;
      }));
    },
    async findByIdAndDelete(id) {
      return wrap(await mutateStore(data => {
        const index = data[collection].findIndex(r => String(r.id) === String(id));
        return index < 0 ? null : data[collection].splice(index, 1)[0];
      }));
    },
    async findByIdAndUpdateReply(id, { replyMessage, repliedAt = new Date().toISOString() }) {
      return this.findByIdAndUpdate(id, { replied: true, replyMessage, repliedAt });
    },
  };
  return model;
}
