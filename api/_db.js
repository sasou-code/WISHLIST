const U=process.env.KV_REST_API_URL||process.env.UPSTASH_REDIS_REST_URL;
const T=process.env.KV_REST_API_TOKEN||process.env.UPSTASH_REDIS_REST_TOKEN;
exports.cmd=async c=>{const r=await fetch(U,{method:"POST",headers:{Authorization:"Bearer "+T},body:JSON.stringify(c)});const j=await r.json();if(j.error)throw new Error(j.error);return j.result};
exports.isOwner=req=>!!process.env.OWNER_PASSWORD&&req.headers["x-owner"]===process.env.OWNER_PASSWORD;
exports.pairs=a=>{const o={};for(let i=0;i<(a||[]).length;i+=2)o[a[i]]=a[i+1];return o};
