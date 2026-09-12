'use client';
import {BlockStack,Button,ButtonGroup,Card,EmptyState,IndexTable,Page,SkeletonBodyText,Text} from '@shopify/polaris';
import {TitleBar} from '@shopify/app-bridge-react';
import {useState} from 'react';
import {AnalyticsCharts} from '@/components/AnalyticsCharts';
import {PageError} from '@/components/PageError';
import {TierBadge} from '@/components/CustomerTable';
import {useUi} from '@/components/Providers';
import {downloadCsv} from '@/lib/api';
import {useAnalytics,useTopCustomers} from '@/lib/hooks/useAnalytics';

const message=(error:unknown)=>error instanceof Error?error.message:'Export failed';
export default function AnalyticsPage(){
  const analytics=useAnalytics(),top=useTopCustomers(),{notify}=useUi(),[exporting,setExporting]=useState<string|null>(null),d=analytics.data;
  const exportFile=async(type:'customers'|'transactions'|'redemptions')=>{setExporting(type);try{await downloadCsv(type);notify(`${type} export downloaded`)}catch(error){notify(message(error),true)}finally{setExporting(null)}};
  const current=d?.monthlyGrowth.at(-1)?.members||0,previous=d?.monthlyGrowth.at(-2)?.members||0,growth=previous?((current-previous)/previous)*100:current?100:0;
  const metrics=d?[['Revenue generated',`₹${d.revenueGenerated.toLocaleString()}`],['Points issued',d.pointsIssued.toLocaleString()],['Points redeemed',d.pointsRedeemed.toLocaleString()],['Redemption rate',`${d.redemptionRate}%`],['Active members',d.activeMembers.toLocaleString()],['Monthly growth',`${growth.toFixed(1)}%`]]:[];
  return <><TitleBar title="Analytics"/><Page title="Analytics"><BlockStack gap="500">
    {(analytics.error||top.error)&&<PageError error={analytics.error||top.error} retry={()=>{analytics.mutate();top.mutate()}}/>}
    <ButtonGroup>{(['customers','transactions','redemptions'] as const).map(type=><Button key={type} onClick={()=>exportFile(type)} loading={exporting===type} disabled={Boolean(exporting)}>Export {type} CSV</Button>)}</ButtonGroup>
    {analytics.isLoading?<SkeletonBodyText lines={6}/>:d&&<><div className="metric-grid six">{metrics.map(([label,value])=><Card key={label}><BlockStack gap="200"><Text as="p" tone="subdued">{label}</Text><Text as="p" variant="headingXl">{value}</Text></BlockStack></Card>)}</div><Card><BlockStack gap="400"><Text as="h2" variant="headingMd">New members by month</Text><AnalyticsCharts data={d.monthlyGrowth}/></BlockStack></Card></>}
    <Card><BlockStack gap="300"><Text as="h2" variant="headingMd">Top customers</Text>{top.isLoading?<SkeletonBodyText lines={7}/>:top.data?.length?<IndexTable resourceName={{singular:'customer',plural:'customers'}} itemCount={top.data.length} selectable={false} headings={[{title:'Customer'},{title:'Tier'},{title:'Lifetime points'},{title:'Total spend'}]}>{top.data.map((c,i)=><IndexTable.Row id={c._id} key={c._id} position={i}><IndexTable.Cell>{c.name||c.email}</IndexTable.Cell><IndexTable.Cell><TierBadge tier={c.tier}/></IndexTable.Cell><IndexTable.Cell>{c.lifetimePoints.toLocaleString()}</IndexTable.Cell><IndexTable.Cell>₹{c.totalSpend.toLocaleString()}</IndexTable.Cell></IndexTable.Row>)}</IndexTable>:<EmptyState image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png" heading="No analytics data yet"><p>Customer activity will appear here.</p></EmptyState>}</BlockStack></Card>
  </BlockStack></Page></>;
}
