import { readFile } from 'node:fs/promises';
export async function validateUploads(req,res,next) {
  try {
    for (const [field,file] of Object.entries(req.files || {})) {
      if (!['avatar','projectBanner','resume'].includes(field)) continue;
      if (Array.isArray(file)) return res.status(400).json({message:'Select one file per upload field.'});
      const bytes = await readFile(file.tempFilePath);
      const png = bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
      const jpeg = bytes[0]===255 && bytes[1]===216 && bytes[2]===255;
      const webp = bytes.toString('ascii',0,4)==='RIFF' && bytes.toString('ascii',8,12)==='WEBP';
      const valid = field === 'resume'
        ? (/\.pdf$/i.test(file.name) && bytes.toString('ascii',0,5)==='%PDF-') || (/\.docx$/i.test(file.name) && bytes[0]===80 && bytes[1]===75)
        : png || jpeg || webp;
      if (!valid) return res.status(400).json({message: field === 'resume' ? 'Upload a PDF or DOCX resume.' : 'Upload a JPG, PNG or WebP image.'});
    }
    next();
  } catch(error) { next(error); }
}
