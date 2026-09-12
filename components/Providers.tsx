'use client';
import {AppProvider,Banner,BlockStack,Button,Frame,InlineStack,Page,TextField,Toast} from '@shopify/polaris';
import en from '@shopify/polaris/locales/en.json';
import {NavMenu} from '@shopify/app-bridge-react';
import {SWRConfig} from 'swr';
import {createContext,useContext,useEffect,useState} from 'react';

type ThemeContextValue={dark:boolean;toggle:()=>void;notify:(message:string,error?:boolean)=>void};
const ThemeContext=createContext<ThemeContextValue>({dark:false,toggle:()=>{},notify:()=>{}});
export const useUi=()=>useContext(ThemeContext);

function InstallPrompt(){
  const[shop,setShop]=useState('');
  const install=()=>{if(/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/i.test(shop))location.assign(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth?shop=${encodeURIComponent(shop.toLowerCase())}`)};
  return <Page title="Install Loyalty & Rewards"><Banner title="Open this app through Shopify Admin" tone="warning"><BlockStack gap="300"><p>Enter your development store domain to start Shopify OAuth.</p><TextField label="Shop domain" placeholder="store.myshopify.com" value={shop} onChange={setShop} autoComplete="off"/><div><Button variant="primary" onClick={install} disabled={!shop.endsWith('.myshopify.com')}>Install app</Button></div></BlockStack></Banner></Page>;
}

export function Providers({children}:{children:React.ReactNode}){
  const[dark,setDark]=useState(false),[ready,setReady]=useState(false),[needsInstall,setNeedsInstall]=useState(false),[toast,setToast]=useState<{message:string;error:boolean}|null>(null);
  useEffect(()=>{
    const params=new URLSearchParams(location.search),shop=params.get('shop'),host=params.get('host');
    if(shop)localStorage.setItem('loyalty-shop',shop);if(host)localStorage.setItem('loyalty-host',host);
    const rememberedShop=localStorage.getItem('loyalty-shop'),rememberedHost=localStorage.getItem('loyalty-host');
    if((!shop||!host)&&window.top===window){if(rememberedShop)location.replace(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth?shop=${encodeURIComponent(rememberedShop)}`);else setNeedsInstall(true)}
    else if(!((shop&&host)||(rememberedShop&&rememberedHost)))setNeedsInstall(true);
    setDark(localStorage.getItem('loyalty-theme')==='dark');setReady(true);
  },[]);
  useEffect(()=>{document.documentElement.dataset.theme=dark?'dark':'light';if(ready)localStorage.setItem('loyalty-theme',dark?'dark':'light')},[dark,ready]);
  const notify=(message:string,error=false)=>setToast({message,error}),value={dark,toggle:()=>setDark(v=>!v),notify};
  return <AppProvider i18n={en}><SWRConfig value={{revalidateOnFocus:false,shouldRetryOnError:false}}><ThemeContext.Provider value={value}><Frame>
    <NavMenu><a href="/" rel="home">Dashboard</a><a href="/customers">Customers</a><a href="/rules">Rules</a><a href="/rewards">Rewards</a><a href="/analytics">Analytics</a></NavMenu>
    <div className="theme-bar"><InlineStack align="end"><Button onClick={()=>setDark(v=>!v)}>{dark?'Light mode':'Dark mode'}</Button></InlineStack></div>
    {ready&&(needsInstall?<InstallPrompt/>:children)}
    {toast&&<Toast content={toast.message} error={toast.error} onDismiss={()=>setToast(null)}/>}</Frame>
  </ThemeContext.Provider></SWRConfig></AppProvider>;
}
