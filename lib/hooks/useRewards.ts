'use client';import useSWR from 'swr';import {api} from '../api';import {Reward} from '../types';export const useRewards=()=>useSWR<Reward[]>('/api/admin/rewards',api);
