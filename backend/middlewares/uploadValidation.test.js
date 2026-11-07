import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {validateUploads} from './uploadValidation.js';
test('upload validation rejects disguised images and multiple files while accepting PNG/PDF',async t=>{
 const dir=await mkdtemp(join(tmpdir(),'portfolio-upload-'));t.after(()=>rm(dir,{recursive:true,force:true}));
 const path=join(dir,'file');let status=200,passed=false;
 const res={status(code){status=code;return this;},json(){}};
 const run=async(field,file)=>{status=200;passed=false;await validateUploads({files:{[field]:file}},res,()=>{passed=true;});};
 await writeFile(path,'<script>bad</script>');await run('avatar',{name:'fake.png',tempFilePath:path});assert.equal(status,400);assert(!passed);
 await writeFile(path,Buffer.from([137,80,78,71,13,10,26,10]));await run('avatar',{name:'photo.png',tempFilePath:path});assert(passed);
 await writeFile(path,'%PDF-1.7');await run('resume',{name:'cv.pdf',tempFilePath:path});assert(passed);
 await run('avatar',[{},{}]);assert.equal(status,400);
});
