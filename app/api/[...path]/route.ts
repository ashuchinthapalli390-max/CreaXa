import {handle} from '../../../lib/server';
export const dynamic='force-dynamic';
async function route(req:Request,ctx:{params:Promise<{path:string[]}>}){const p=await ctx.params;return handle(req,p.path)}
export {route as GET,route as POST,route as DELETE};
