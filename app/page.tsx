'use client';
import {BlockStack,Card,EmptyState,IndexTable,Layout,Page,SkeletonBodyText,Text} from '@shopify/polaris';
import {TitleBar} from '@shopify/app-bridge-react';
import {DashboardCards} from '@/components/DashboardCards';
import {PageError} from '@/components/PageError';
import {TierBadge} from '@/components/CustomerTable';
import {useDashboardSummary,useDashboardTopCustomers} from '@/lib/hooks/useDashboardSummary';

export default function Dashboard(){
  const summary=useDashboardSummary(),top=useDashboardTopCustomers(),error=summary.error||top.error;
  return <><TitleBar title="Loyalty dashboard"/><Page title="Loyalty dashboard"><BlockStack gap="500">
    {error?<PageError error={error} retry={()=>{summary.mutate();top.mutate()}}/>:<>
      <DashboardCards data={summary.data} loading={summary.isLoading}/>
      <Layout><Layout.Section><Card><BlockStack gap="400"><Text as="h2" variant="headingMd">Top customers</Text>
        {top.isLoading?<SkeletonBodyText lines={5}/>:top.data?.length?<IndexTable resourceName={{singular:'customer',plural:'customers'}} itemCount={top.data.length} selectable={false} headings={[{title:'Customer'},{title:'Tier'},{title:'Lifetime points'}]}>{top.data.map((c,i)=><IndexTable.Row id={c._id} key={c._id} position={i}><IndexTable.Cell>{c.name||c.email}</IndexTable.Cell><IndexTable.Cell><TierBadge tier={c.tier}/></IndexTable.Cell><IndexTable.Cell>{c.lifetimePoints.toLocaleString()}</IndexTable.Cell></IndexTable.Row>)}</IndexTable>:<EmptyState image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png" heading="No loyalty members yet"><p>Members will appear after customers join your loyalty program.</p></EmptyState>}
      </BlockStack></Card></Layout.Section></Layout>
    </>}
  </BlockStack></Page></>;
}
