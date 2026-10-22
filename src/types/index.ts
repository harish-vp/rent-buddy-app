export interface PropertyType {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Property {
  id: string;
  name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  property_type_id: string;
  number_of_bedrooms?: number;
  number_of_bathrooms?: number;
  area_sq_ft?: number;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Tenant {
  id: string;
  full_name: string;
  contact_email?: string;
  contact_phone?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Lease {
  id: string;
  property_id: string;
  tenant_id: string;
  start_date: string;
  end_date: string;
  monthly_rent: number;
  security_deposit: number;
  maintenance_type: 'fixed' | 'flexible';
  maintenance_charge: number;
  is_active: boolean;
  status: 'active' | 'expired' | 'terminated' | 'renewal_due';
  renewal_reminder_days: number;
  created_at: string;
  updated_at: string;
}

export type TransactionType = 'income' | 'expense' | 'refund';
export type TransactionCategory = 
  | 'Advance Payment'
  | 'Advance Return'
  | 'Rent Payment'
  | 'Water Bill'
  | 'Electricity Bill'
  | 'Maintenance Payment'
  | 'Cleaning Payment'
  | 'Split Payment'
  | 'Other';

export interface Transaction {
  id: string;
  lease_id?: string;
  property_id: string;
  transaction_type: TransactionType;
  category: TransactionCategory;
  amount: number;
  transaction_date: string;
  payment_method_id?: string;
  destination_account?: string;
  transaction_reference?: string;
  description?: string;
  status: 'recorded' | 'pending' | 'cancelled';
  is_split: boolean;
  created_at: string;
  updated_at: string;
}

export interface TransactionSplit {
  id: string;
  transaction_id: string;
  category: 'Rent' | 'Water' | 'Electricity' | 'Maintenance' | 'Advance' | 'Other';
  amount: number;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'UPI' | 'Net Banking' | 'Cash' | 'Cheque' | 'Other';
  destination_account?: string;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TransactionTypeConfig {
  id: string;
  name: string;
  category: TransactionCategory;
  default_payment_method_id?: string;
  requires_property: boolean;
  requires_lease: boolean;
  allows_splits: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UtilityConfig {
  id: string;
  name: string;
  type: 'Water' | 'Electricity' | 'Gas' | 'Other';
  unit: string;
  default_rate?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UtilityBill {
  id: string;
  property_id: string;
  utility_type_id: string;
  bill_date: string;
  due_date: string;
  consumption: number;
  rate_per_unit: number;
  total_amount: number;
  status: 'pending' | 'paid' | 'overdue';
  transaction_id?: string;
  created_at: string;
  updated_at: string;
}

export interface SecurityDeposit {
  id: string;
  lease_id: string;
  transaction_id: string;
  amount: number;
  type: 'payment' | 'return';
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  totalIncome: number;
  totalProperties: number;
  occupiedProperties: number;
  vacantProperties: number;
  totalTenants: number;
  totalSecurityDeposits: number;
  pendingRenewals: number;
  overdueBills: number;
}

export interface CumulativeBalance {
  property_id: string;
  total_advance: number;
  total_advance_returned: number;
  net_advance_balance: number;
  total_rent_collected: number;
  total_utilities_collected: number;
  total_maintenance_collected: number;
  total_expenses: number;
  net_balance: number;
  last_updated: string;
}

export interface User {
  username: string;
  password: string;
}

export interface CSVTransaction {
  date: string;
  name: string;
  house: string;
  mode: string;
  destination: string;
  advance: number;
  advance_return: number;
  advance_balance_cumulative: number;
  rent: number;
  rent_cumulative: number;
  water: number;
  electricity: number;
  maintainance: number;
  maintainance_sum: number;
  maintainance_cumulative: number;
  total: number;
  total_cumulative: number;
  start_date: string;
  actual_spent: number;
  spent_split: number;
  spent_cumulative: number;
  inward_minus_outward: number;
  maintainance_recovery_balance: number;
  account_should_hold: number;
} 