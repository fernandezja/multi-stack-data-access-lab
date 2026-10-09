export const apiUrls = {
  ts: import.meta.env.PUBLIC_API_TS_URL ?? 'http://localhost:3001',
  net: import.meta.env.PUBLIC_API_NET_URL ?? 'http://localhost:3002'
} as const;
