export type Tier='Bronze'|'Silver'|'Gold'|'Platinum';
export interface Customer {_id:string;name?:string;email:string;tier:Tier;currentPoints:number;lifetimePoints:number;redeemedPoints:number;totalSpend:number;birthday?:string;createdAt:string}
export interface Pagination {page:number;limit:number;total:number;pages:number}
export interface Transaction {_id:string;type:'earn'|'redeem'|'expire'|'adjust';points:number;source:string;referenceId?:string;balanceAfter:number;createdAt:string}
export interface Rule {_id:string;name:string;type:'purchase'|'signup'|'birthday'|'review'|'referral';pointsPerAmount?:number;flatPoints?:number;minSpend?:number;isActive:boolean}
export interface Reward {_id:string;name:string;type:'percentage_discount'|'fixed_discount'|'free_shipping'|'free_product';value?:number;freeProductId?:string;pointsRequired:number;usageLimitPerCustomer?:number|null;isActive:boolean}
export interface DashboardSummary {totalMembers:number;totalPointsIssued:number;totalPointsRedeemed:number;activeCampaigns:number}
export interface MonthlyGrowth {_id:{year:number;month:number};members:number}
export interface Analytics {revenueGenerated:number;pointsIssued:number;pointsRedeemed:number;redemptionRate:number;activeMembers:number;monthlyGrowth:MonthlyGrowth[]}
