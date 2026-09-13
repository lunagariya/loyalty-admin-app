import {NextRequest,NextResponse} from 'next/server';

const backend=(process.env.NEXT_PUBLIC_BACKEND_URL||'http://localhost:3000').replace(/\/$/,'');

async function proxy(request:NextRequest,{params}:{params:Promise<{path:string[]}>}){
  const {path}=await params;
  const target=new URL(`${backend}/${path.map(encodeURIComponent).join('/')}`);
  request.nextUrl.searchParams.forEach((value,key)=>target.searchParams.append(key,value));
  const headers=new Headers();
  for(const name of ['authorization','content-type','accept','accept-language']){const value=request.headers.get(name);if(value)headers.set(name,value)}
  try{
    const hasBody=!['GET','HEAD'].includes(request.method);
    const response=await fetch(target,{method:request.method,headers,body:hasBody?await request.arrayBuffer():undefined,cache:'no-store',redirect:'manual'});
    const responseHeaders=new Headers();
    for(const name of ['content-type','content-disposition','x-shopify-retry-invalid-session-request']){const value=response.headers.get(name);if(value)responseHeaders.set(name,value)}
    return new NextResponse(response.body,{status:response.status,headers:responseHeaders});
  }catch(error){
    const message=error instanceof Error?error.message:'Backend unavailable';
    return NextResponse.json({success:false,error:{message:`Backend connection failed: ${message}`,code:'BACKEND_UNAVAILABLE'}},{status:502});
  }
}

export const dynamic='force-dynamic';
export const GET=proxy;export const POST=proxy;export const PUT=proxy;export const PATCH=proxy;export const DELETE=proxy;
