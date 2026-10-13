// Dual runtime fallback for Cloudflare Workers imports when running under Next.js / Vercel or Vinext
const procEnv: Record<string, any> = (typeof process !== 'undefined' && process.env) ? process.env : {};
const globEnv: Record<string, any> = (typeof globalThis !== 'undefined' && (globalThis as any).env) ? (globalThis as any).env : {};

export const env: any = {
  ...procEnv,
  ...globEnv,
  DB: (globalThis as any).DB || null,
  MEDIA_BUCKET: (globalThis as any).MEDIA_BUCKET || null,
  OPENAI_API_KEY: procEnv.OPENAI_API_KEY || globEnv.OPENAI_API_KEY || ''
};

export class WorkerEntrypoint {}
export class DurableObject {}
export class WorkflowEntrypoint {}

export default {
  env,
  WorkerEntrypoint,
  DurableObject,
  WorkflowEntrypoint
};
