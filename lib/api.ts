'use client';
const API_ORIGIN='/backend-api';
const BACKEND=(process.env.NEXT_PUBLIC_BACKEND_URL||'http://localhost:3000').replace(/\/$/,'');
export class ApiError extends Error {constructor(public status:number,message:string,public code='API_ERROR'){super(message);}}
export async function api<T>(path:string,init:RequestInit={}):Promise<T>{const headers=new Headers(init.headers);if(init.body&&!headers.has('Content-Type'))headers.set('Content-Type','application/json');const response=await fetch(`${API_ORIGIN}${path}`,{...init,headers});if(!response.ok){let payload:{error?:{message?:string;code?:string}}={};try{payload=await response.json();}catch{}const needsInstall=response.status===401||(response.status===403&&payload.error?.code==='SHOP_NOT_INSTALLED');if(needsInstall){const shop=localStorage.getItem('loyalty-shop');if(shop){window.open(`${BACKEND}/auth?shop=${encodeURIComponent(shop)}`,'_top');throw new ApiError(response.status,'Redirecting to Shopify installation…','REAUTHORIZING')}}throw new ApiError(response.status,payload.error?.message||`Request failed (${response.status})`,payload.error?.code);}const payload=await response.json();return payload.data as T;}
export async function downloadCsv(type:'customers'|'transactions'|'redemptions'){
  type SaveFileHandle={createWritable:()=>Promise<{write:(data:Blob)=>Promise<void>;close:()=>Promise<void>}>};
  const savePicker=(window as typeof window&{showSaveFilePicker?: (options:{suggestedName:string;types:Array<{description:string;accept:Record<string,string[]>}>})=>Promise<SaveFileHandle>}).showSaveFilePicker;
  if(!savePicker)throw new ApiError(400,'CSV export requires a Chromium browser such as Chrome or Edge inside Shopify Admin','FILE_SAVE_UNAVAILABLE');
  const handle=await savePicker.call(window,{suggestedName:`${type}.csv`,types:[{description:'CSV file',accept:{'text/csv':['.csv']}}]});
  const response=await fetch(`${API_ORIGIN}/api/admin/analytics/export/csv?type=${type}`);
  if(!response.ok)throw new ApiError(response.status,'Unable to export CSV');
  const writable=await handle.createWritable();
  await writable.write(await response.blob());
  await writable.close();
}
export const jsonBody=(value:unknown):RequestInit=>({headers:{'Content-Type':'application/json'},body:JSON.stringify(value)});
