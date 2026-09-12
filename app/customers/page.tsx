'use client';
import {BlockStack,Card,EmptyState,InlineGrid,Page,Pagination,Select,SkeletonBodyText,TextField} from '@shopify/polaris';
import {TitleBar} from '@shopify/app-bridge-react';
import {useEffect,useState} from 'react';
import {CustomerTable} from '@/components/CustomerTable';
import {PageError} from '@/components/PageError';
import {useCustomers} from '@/lib/hooks/useCustomers';

export default function CustomersPage(){
  const[input,setInput]=useState(''),[search,setSearch]=useState(''),[tier,setTier]=useState(''),[page,setPage]=useState(1);
  useEffect(()=>{const id=setTimeout(()=>{setSearch(input);setPage(1)},350);return()=>clearTimeout(id)},[input]);
  const result=useCustomers(search,tier,page);
  return <><TitleBar title="Customers"/><Page title="Customers"><BlockStack gap="400">
    {result.error&&<PageError error={result.error} retry={()=>result.mutate()}/>}<Card><BlockStack gap="400">
      <InlineGrid columns={{xs:1,md:2}} gap="300"><TextField label="Search customers" labelHidden placeholder="Search by name or email" value={input} onChange={setInput} clearButton onClearButtonClick={()=>setInput('')} autoComplete="off"/><Select label="Filter by tier" labelHidden value={tier} onChange={v=>{setTier(v);setPage(1)}} options={[{label:'All tiers',value:''},...['Bronze','Silver','Gold','Platinum'].map(v=>({label:v,value:v}))]}/></InlineGrid>
      {result.isLoading?<SkeletonBodyText lines={8}/>:result.data?.items.length?<><CustomerTable customers={result.data.items}/><Pagination hasPrevious={page>1} onPrevious={()=>setPage(p=>p-1)} hasNext={page<(result.data?.pagination.pages||1)} onNext={()=>setPage(p=>p+1)} label={`Page ${page} of ${result.data.pagination.pages||1}`}/></>:<EmptyState image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png" heading="No customers found"><p>Try changing the search or tier filter.</p></EmptyState>}
    </BlockStack></Card>
  </BlockStack></Page></>;
}
