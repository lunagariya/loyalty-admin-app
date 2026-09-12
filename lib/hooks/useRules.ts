'use client';import useSWR from 'swr';import {api} from '../api';import {Rule} from '../types';export const useRules=()=>useSWR<Rule[]>('/api/admin/rules',api);
