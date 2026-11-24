const {cmd,isOwner,pairs}=require("./_db");
module.exports=async(req,res)=>{
 try{
  const owner=isOwner(req);
  if(req.method==="GET"){
   const g=pairs(await cmd(["HGETALL","gifts"])),t=pairs(await cmd(["HGETALL","taken"])),hero=await cmd(["GET","hero"]);
   const me=req.query.me||"";
   const list=Object.values(g).map(s=>JSON.parse(s)).sort((a,b)=>a.at-b.at).map(x=>{
    if(owner)return x;
    const k=t[x.id]?JSON.parse(t[x.id]):null;
    return {...x,taken:!!k,name2:k?k.name:null,mine:!!k&&k.by===me}});
   return res.json({gifts:list,hero,owner:owner||undefined});
  }
  if(!owner)return res.status(401).json({error:"mot de passe incorrect"});
  const b=req.body||{};
  if(req.method==="POST"){
   if(b.hero){await cmd(["SET","hero",b.hero]);return res.json({ok:1})}
   const id=Date.now().toString(36)+Math.random().toString(36).slice(2,6);
   await cmd(["HSET","gifts",id,JSON.stringify({id,title:String(b.title||"").slice(0,120),url:String(b.url||"").slice(0,500),img:b.img||null,at:Date.now()})]);
   return res.json({ok:1});
  }
  if(req.method==="DELETE"){await cmd(["HDEL","gifts",b.id]);await cmd(["HDEL","taken",b.id]);return res.json({ok:1})}
  res.status(405).end();
 }catch(e){res.status(500).json({error:e.message})}
};
