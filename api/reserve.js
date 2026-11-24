const {cmd}=require("./_db");
module.exports=async(req,res)=>{
 try{
  const b=req.body||{};const me=String(b.me||"");if(!me)return res.status(400).json({error:"me"});
  if(req.method==="POST"){
   const name=String(b.name||"Un invité").slice(0,30),ok=[],fail=[];
   for(const id of (b.ids||[]).slice(0,50)){
    const r=await cmd(["HSETNX","taken",id,JSON.stringify({by:me,name})]);
    (r===1?ok:fail).push(id);
   }
   return res.json({ok,fail});
  }
  if(req.method==="DELETE"){
   const v=await cmd(["HGET","taken",b.id]);
   if(v&&JSON.parse(v).by===me)await cmd(["HDEL","taken",b.id]);
   return res.json({ok:1});
  }
  res.status(405).end();
 }catch(e){res.status(500).json({error:e.message})}
};
