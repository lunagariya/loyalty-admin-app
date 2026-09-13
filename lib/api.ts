'use client';
const API_ORIGIN='/backend-api';
export class ApiError extends Error {constructor(public status:number,message:string,public code='API_ERROR'){super(message);}}
export async function api<T>(path:string,init:RequestInit={}):Promise<T>{const headers=new Headers(init.headers);if(init.body&&!headers.has('Content-Type'))headers.set('Content-Type','application/json');const response=await fetch(`${API_ORIGIN}${path}`,{...init,headers});if(!response.ok){let payload:{error?:{message?:string;code?:string}}={};try{payload=await response.json();}catch{}throw new ApiError(response.status,payload.error?.message||`Request failed (${response.status})`,payload.error?.code);}const payload=await response.json();return payload.data as T;}
export async function downloadCsv(type:'customers'|'transactions'|'redemptions'){
  const response=await fetch(`${API_ORIGIN}/api/admin/analytics/export/csv?type=${type}`);
  if(!response.ok)throw new ApiError(response.status,'Unable to export CSV');

  // File System Access APIs such as showSaveFilePicker() can only be used by a
  // top-level browsing context. Shopify renders embedded apps in a
  // cross-origin iframe, so using that API throws a SecurityError. Fetch the
  // protected export in the iframe, then download the resulting Blob instead.
  const blob=await response.blob();
  const objectUrl=URL.createObjectURL(blob);
  const disposition=response.headers.get('content-disposition');
  const encodedFilename=disposition?.match(/filename\*=UTF-8''([^;]+)/i)?.[1];
  const plainFilename=disposition?.match(/filename="?([^";]+)"?/i)?.[1];
  let filename=`${type}.csv`;

  try {
    filename=decodeURIComponent(encodedFilename||plainFilename||filename);
  } catch {
    // Keep the safe fallback when a malformed Content-Disposition is returned.
  }

  const link=document.createElement('a');
  link.href=objectUrl;
  link.download=filename;
  // Keep the anchor detached so App Bridge's document-level navigation
  // handler cannot mistake this Blob download for an embedded-app route.
  // A separate browsing context also prevents Shopify Admin's parent frame
  // from being read or navigated by the app iframe.
  link.target='_blank';
  link.rel='noopener';
  link.click();

  // Revoking immediately can cancel downloads in some browsers.
  window.setTimeout(()=>URL.revokeObjectURL(objectUrl),1000);
}
export const jsonBody=(value:unknown):RequestInit=>({headers:{'Content-Type':'application/json'},body:JSON.stringify(value)});
