import { v4 as uuidv4 } from 'uuid';
import {
  PropertyType,
  Property,
  Tenant,
  Lease,
  Transaction,
  TransactionSplit,
  PaymentMethod,
  TransactionTypeConfig,
  UtilityConfig,
  UtilityBill,
  SecurityDeposit,
  User,
  DashboardStats,
  CumulativeBalance,
  CSVTransaction,
  TransactionCategory
} from '../types';

class StorageService {
  private readonly STORAGE_KEYS = {
    PROPERTY_TYPES: 'rent_budy_property_types',
    PROPERTIES: 'rent_budy_properties',
    TENANTS: 'rent_budy_tenants',
    LEASES: 'rent_budy_leases',
    TRANSACTIONS: 'rent_budy_transactions',
    TRANSACTION_SPLITS: 'rent_budy_transaction_splits',
    PAYMENT_METHODS: 'rent_budy_payment_methods',
    TRANSACTION_TYPE_CONFIGS: 'rent_budy_transaction_type_configs',
    UTILITY_CONFIGS: 'rent_budy_utility_configs',
    UTILITY_BILLS: 'rent_budy_utility_bills',
    SECURITY_DEPOSITS: 'rent_budy_security_deposits',
    CUMULATIVE_BALANCES: 'rent_budy_cumulative_balances',
    USER: 'rent_budy_user'
  };

  constructor() {
    this.initializeData();
  }

  private initializeData(): void {
    // Initialize property types if they don't exist
    if (!localStorage.getItem(this.STORAGE_KEYS.PROPERTY_TYPES)) {
      const defaultPropertyTypes: PropertyType[] = [
        {
          id: uuidv4(),
          name: 'Apartment',
          description: 'Residential apartment unit',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: uuidv4(),
          name: 'House',
          description: 'Independent house or villa',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: uuidv4(),
          name: 'Commercial',
          description: 'Commercial property or office space',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      localStorage.setItem(this.STORAGE_KEYS.PROPERTY_TYPES, JSON.stringify(defaultPropertyTypes));
    }

    // Initialize default user if not exists
    if (!localStorage.getItem(this.STORAGE_KEYS.USER)) {
      const defaultUser: User = {
        username: 'admin',
        password: 'admin123'
      };
      localStorage.setItem(this.STORAGE_KEYS.USER, JSON.stringify(defaultUser));
    }

    // Initialize payment methods
    if (!localStorage.getItem(this.STORAGE_KEYS.PAYMENT_METHODS)) {
      const defaultPaymentMethods: PaymentMethod[] = [
        {
          id: uuidv4(),
          name: 'UPI',
          type: 'UPI',
          destination_account: 'hemaarkasali9@okicici',
          is_default: true,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: uuidv4(),
          name: 'Net Banking',
          type: 'Net Banking',
          destination_account: 'ICICI Bank',
          is_default: false,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: uuidv4(),
          name: 'PhonePe',
          type: 'UPI',
          destination_account: 'Harish PhonePe',
          is_default: false,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: uuidv4(),
          name: 'Cash',
          type: 'Cash',
          is_default: false,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      localStorage.setItem(this.STORAGE_KEYS.PAYMENT_METHODS, JSON.stringify(defaultPaymentMethods));
    }

    // Initialize transaction type configurations
    if (!localStorage.getItem(this.STORAGE_KEYS.TRANSACTION_TYPE_CONFIGS)) {
      const defaultTransactionTypes: TransactionTypeConfig[] = [
        {
          id: uuidv4(),
          name: 'Advance Payment',
          category: 'Advance Payment',
          requires_property: true,
          requires_lease: true,
          allows_splits: false,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: uuidv4(),
          name: 'Advance Return',
          category: 'Advance Return',
          requires_property: true,
          requires_lease: true,
          allows_splits: false,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: uuidv4(),
          name: 'Rent Payment',
          category: 'Rent Payment',
          requires_property: true,
          requires_lease: true,
          allows_splits: true,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: uuidv4(),
          name: 'Water Bill',
          category: 'Water Bill',
          requires_property: true,
          requires_lease: false,
          allows_splits: false,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: uuidv4(),
          name: 'Electricity Bill',
          category: 'Electricity Bill',
          requires_property: true,
          requires_lease: false,
          allows_splits: false,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: uuidv4(),
          name: 'Maintenance Payment',
          category: 'Maintenance Payment',
          requires_property: true,
          requires_lease: false,
          allows_splits: false,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: uuidv4(),
          name: 'Cleaning Payment',
          category: 'Cleaning Payment',
          requires_property: false,
          requires_lease: false,
          allows_splits: false,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: uuidv4(),
          name: 'Split Payment',
          category: 'Split Payment',
          requires_property: true,
          requires_lease: true,
          allows_splits: true,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      localStorage.setItem(this.STORAGE_KEYS.TRANSACTION_TYPE_CONFIGS, JSON.stringify(defaultTransactionTypes));
    }

    // Initialize utility configurations
    if (!localStorage.getItem(this.STORAGE_KEYS.UTILITY_CONFIGS)) {
      const defaultUtilityConfigs: UtilityConfig[] = [
        {
          id: uuidv4(),
          name: 'Water',
          type: 'Water',
          unit: 'liters',
          default_rate: 0.25,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: uuidv4(),
          name: 'Electricity',
          type: 'Electricity',
          unit: 'units',
          default_rate: 8.0,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      localStorage.setItem(this.STORAGE_KEYS.UTILITY_CONFIGS, JSON.stringify(defaultUtilityConfigs));
    }

    // Initialize empty arrays for other entities
    const keys = [
      this.STORAGE_KEYS.PROPERTIES,
      this.STORAGE_KEYS.TENANTS,
      this.STORAGE_KEYS.LEASES,
      this.STORAGE_KEYS.TRANSACTIONS,
      this.STORAGE_KEYS.TRANSACTION_SPLITS,
      this.STORAGE_KEYS.UTILITY_BILLS,
      this.STORAGE_KEYS.SECURITY_DEPOSITS,
      this.STORAGE_KEYS.CUMULATIVE_BALANCES
    ];

    keys.forEach(key => {
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify([]));
      }
    });
  }

  // Property Types
  getPropertyTypes(): PropertyType[] {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.PROPERTY_TYPES) || '[]');
  }

  // Properties
  getProperties(): Property[] {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.PROPERTIES) || '[]');
  }

  addProperty(property: Omit<Property, 'id' | 'created_at' | 'updated_at'>): Property {
    const properties = this.getProperties();
    const newProperty: Property = {
      ...property,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    properties.push(newProperty);
    localStorage.setItem(this.STORAGE_KEYS.PROPERTIES, JSON.stringify(properties));
    return newProperty;
  }

  updateProperty(id: string, updates: Partial<Property>): Property | null {
    const properties = this.getProperties();
    const index = properties.findIndex(p => p.id === id);
    if (index === -1) return null;

    properties[index] = {
      ...properties[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    localStorage.setItem(this.STORAGE_KEYS.PROPERTIES, JSON.stringify(properties));
    return properties[index];
  }

  deleteProperty(id: string): boolean {
    const properties = this.getProperties();
    const filtered = properties.filter(p => p.id !== id);
    if (filtered.length === properties.length) return false;
    
    localStorage.setItem(this.STORAGE_KEYS.PROPERTIES, JSON.stringify(filtered));
    return true;
  }

  getPropertyById(id: string): Property | null {
    const properties = this.getProperties();
    return properties.find(p => p.id === id) || null;
  }

  // Tenants
  getTenants(): Tenant[] {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.TENANTS) || '[]');
  }

  addTenant(tenant: Omit<Tenant, 'id' | 'created_at' | 'updated_at'>): Tenant {
    const tenants = this.getTenants();
    const newTenant: Tenant = {
      ...tenant,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    tenants.push(newTenant);
    localStorage.setItem(this.STORAGE_KEYS.TENANTS, JSON.stringify(tenants));
    return newTenant;
  }

  updateTenant(id: string, updates: Partial<Tenant>): Tenant | null {
    const tenants = this.getTenants();
    const index = tenants.findIndex(t => t.id === id);
    if (index === -1) return null;

    tenants[index] = {
      ...tenants[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    localStorage.setItem(this.STORAGE_KEYS.TENANTS, JSON.stringify(tenants));
    return tenants[index];
  }

  deleteTenant(id: string): boolean {
    const tenants = this.getTenants();
    const filtered = tenants.filter(t => t.id !== id);
    if (filtered.length === tenants.length) return false;
    
    localStorage.setItem(this.STORAGE_KEYS.TENANTS, JSON.stringify(filtered));
    return true;
  }

  getTenantById(id: string): Tenant | null {
    const tenants = this.getTenants();
    return tenants.find(t => t.id === id) || null;
  }

  // Leases
  getLeases(): Lease[] {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.LEASES) || '[]');
  }

  addLease(lease: Omit<Lease, 'id' | 'created_at' | 'updated_at'>): Lease {
    const leases = this.getLeases();
    const newLease: Lease = {
      ...lease,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    leases.push(newLease);
    localStorage.setItem(this.STORAGE_KEYS.LEASES, JSON.stringify(leases));
    return newLease;
  }

  updateLease(id: string, updates: Partial<Lease>): Lease | null {
    const leases = this.getLeases();
    const index = leases.findIndex(l => l.id === id);
    if (index === -1) return null;

    leases[index] = {
      ...leases[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    localStorage.setItem(this.STORAGE_KEYS.LEASES, JSON.stringify(leases));
    return leases[index];
  }

  getActiveLeases(): Lease[] {
    const leases = this.getLeases();
    return leases.filter(l => l.is_active && l.status === 'active');
  }

  getLeaseByPropertyId(propertyId: string): Lease | null {
    const leases = this.getActiveLeases();
    return leases.find(l => l.property_id === propertyId) || null;
  }

  // Transactions
  getTransactions(): Transaction[] {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.TRANSACTIONS) || '[]');
  }

  addTransaction(transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>): Transaction {
    const transactions = this.getTransactions();
    const newTransaction: Transaction = {
      ...transaction,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    transactions.push(newTransaction);
    localStorage.setItem(this.STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    return newTransaction;
  }

  getTransactionsByPropertyId(propertyId: string): Transaction[] {
    const transactions = this.getTransactions();
    return transactions.filter(t => t.property_id === propertyId);
  }

  // Transaction Splits
  getTransactionSplits(): TransactionSplit[] {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.TRANSACTION_SPLITS) || '[]');
  }

  addTransactionSplit(split: Omit<TransactionSplit, 'id' | 'created_at' | 'updated_at'>): TransactionSplit {
    const splits = this.getTransactionSplits();
    const newSplit: TransactionSplit = {
      ...split,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    splits.push(newSplit);
    localStorage.setItem(this.STORAGE_KEYS.TRANSACTION_SPLITS, JSON.stringify(splits));
    return newSplit;
  }

  getSplitsByTransactionId(transactionId: string): TransactionSplit[] {
    const splits = this.getTransactionSplits();
    return splits.filter(s => s.transaction_id === transactionId);
  }

  // Authentication
  authenticateUser(username: string, password: string): boolean {
    const user = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.USER) || '{}');
    return user.username === username && user.password === password;
  }

  // Dashboard Stats
  getDashboardStats(): DashboardStats {
    const properties = this.getProperties();
    const leases = this.getActiveLeases();
    const transactions = this.getTransactions();
    
    const totalIncome = transactions
      .filter(t => ['Rent Payment', 'Maintenance Payment', 'Advance Payment', 'Security Deposit'].includes(t.category))
      .reduce((sum, t) => sum + t.amount, 0);
    
    const occupiedProperties = leases.filter(l => l.status === 'active').length;
    const vacantProperties = properties.length - occupiedProperties;
    
    const totalSecurityDeposits = leases
      .filter(l => l.status === 'active')
      .reduce((sum, l) => sum + l.security_deposit, 0);
    
    const pendingRenewals = leases.filter(l => {
      const endDate = new Date(l.end_date);
      const today = new Date();
      const daysUntilExpiry = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
    }).length;
    
    const overdueBills = 0; // TODO: Implement utility bill tracking
    
    return {
      totalIncome,
      totalProperties: properties.length,
      occupiedProperties,
      vacantProperties,
      totalTenants: this.getTenants().length,
      totalSecurityDeposits,
      pendingRenewals,
      overdueBills
    };
  }

  // Payment Methods
  getPaymentMethods(): PaymentMethod[] {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.PAYMENT_METHODS) || '[]');
  }

  addPaymentMethod(method: Omit<PaymentMethod, 'id' | 'created_at' | 'updated_at'>): PaymentMethod {
    const methods = this.getPaymentMethods();
    const newMethod: PaymentMethod = {
      ...method,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    methods.push(newMethod);
    localStorage.setItem(this.STORAGE_KEYS.PAYMENT_METHODS, JSON.stringify(methods));
    return newMethod;
  }

  updatePaymentMethod(id: string, updates: Partial<PaymentMethod>): PaymentMethod | null {
    const methods = this.getPaymentMethods();
    const index = methods.findIndex(m => m.id === id);
    if (index === -1) return null;

    methods[index] = {
      ...methods[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    localStorage.setItem(this.STORAGE_KEYS.PAYMENT_METHODS, JSON.stringify(methods));
    return methods[index];
  }

  getDefaultPaymentMethod(): PaymentMethod | null {
    const methods = this.getPaymentMethods();
    return methods.find(m => m.is_default && m.is_active) || null;
  }

  // Transaction Type Configs
  getTransactionTypeConfigs(): TransactionTypeConfig[] {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.TRANSACTION_TYPE_CONFIGS) || '[]');
  }

  addTransactionTypeConfig(config: Omit<TransactionTypeConfig, 'id' | 'created_at' | 'updated_at'>): TransactionTypeConfig {
    const configs = this.getTransactionTypeConfigs();
    const newConfig: TransactionTypeConfig = {
      ...config,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    configs.push(newConfig);
    localStorage.setItem(this.STORAGE_KEYS.TRANSACTION_TYPE_CONFIGS, JSON.stringify(configs));
    return newConfig;
  }

  updateTransactionTypeConfig(id: string, updates: Partial<TransactionTypeConfig>): TransactionTypeConfig | null {
    const configs = this.getTransactionTypeConfigs();
    const index = configs.findIndex(c => c.id === id);
    if (index === -1) return null;

    configs[index] = {
      ...configs[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    localStorage.setItem(this.STORAGE_KEYS.TRANSACTION_TYPE_CONFIGS, JSON.stringify(configs));
    return configs[index];
  }

  // Utility Configs
  getUtilityConfigs(): UtilityConfig[] {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.UTILITY_CONFIGS) || '[]');
  }

  addUtilityConfig(config: Omit<UtilityConfig, 'id' | 'created_at' | 'updated_at'>): UtilityConfig {
    const configs = this.getUtilityConfigs();
    const newConfig: UtilityConfig = {
      ...config,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    configs.push(newConfig);
    localStorage.setItem(this.STORAGE_KEYS.UTILITY_CONFIGS, JSON.stringify(configs));
    return newConfig;
  }

  updateUtilityConfig(id: string, updates: Partial<UtilityConfig>): UtilityConfig | null {
    const configs = this.getUtilityConfigs();
    const index = configs.findIndex(c => c.id === id);
    if (index === -1) return null;

    configs[index] = {
      ...configs[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    localStorage.setItem(this.STORAGE_KEYS.UTILITY_CONFIGS, JSON.stringify(configs));
    return configs[index];
  }

  // Utility Bills
  getUtilityBills(): UtilityBill[] {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.UTILITY_BILLS) || '[]');
  }

  addUtilityBill(bill: Omit<UtilityBill, 'id' | 'created_at' | 'updated_at'>): UtilityBill {
    const bills = this.getUtilityBills();
    const newBill: UtilityBill = {
      ...bill,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    bills.push(newBill);
    localStorage.setItem(this.STORAGE_KEYS.UTILITY_BILLS, JSON.stringify(bills));
    return newBill;
  }

  updateUtilityBill(id: string, updates: Partial<UtilityBill>): UtilityBill | null {
    const bills = this.getUtilityBills();
    const index = bills.findIndex(b => b.id === id);
    if (index === -1) return null;

    bills[index] = {
      ...bills[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    localStorage.setItem(this.STORAGE_KEYS.UTILITY_BILLS, JSON.stringify(bills));
    return bills[index];
  }

  // Security Deposits
  getSecurityDeposits(): SecurityDeposit[] {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.SECURITY_DEPOSITS) || '[]');
  }

  addSecurityDeposit(deposit: Omit<SecurityDeposit, 'id' | 'created_at' | 'updated_at'>): SecurityDeposit {
    const deposits = this.getSecurityDeposits();
    const newDeposit: SecurityDeposit = {
      ...deposit,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    deposits.push(newDeposit);
    localStorage.setItem(this.STORAGE_KEYS.SECURITY_DEPOSITS, JSON.stringify(deposits));
    return newDeposit;
  }

  getSecurityDepositsByLeaseId(leaseId: string): SecurityDeposit[] {
    const deposits = this.getSecurityDeposits();
    return deposits.filter(d => d.lease_id === leaseId);
  }

  getSecurityDepositBalance(leaseId: string): number {
    const deposits = this.getSecurityDepositsByLeaseId(leaseId);
    const payments = deposits.filter(d => d.type === 'payment').reduce((sum, d) => sum + d.amount, 0);
    const returns = deposits.filter(d => d.type === 'return').reduce((sum, d) => sum + d.amount, 0);
    return payments - returns;
  }

  // Cumulative Balances
  getCumulativeBalances(): CumulativeBalance[] {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.CUMULATIVE_BALANCES) || '[]');
  }

  updateCumulativeBalance(propertyId: string): CumulativeBalance {
    const balances = this.getCumulativeBalances();
    const transactions = this.getTransactionsByPropertyId(propertyId);

    // Calculate totals
    const total_advance = transactions
      .filter(t => t.category === 'Advance Payment')
      .reduce((sum, t) => sum + t.amount, 0);

    const total_advance_returned = transactions
      .filter(t => t.category === 'Advance Return')
      .reduce((sum, t) => sum + t.amount, 0);

    const total_rent_collected = transactions
      .filter(t => t.category === 'Rent Payment')
      .reduce((sum, t) => sum + t.amount, 0);

    const total_utilities_collected = transactions
      .filter(t => ['Water Bill', 'Electricity Bill'].includes(t.category))
      .reduce((sum, t) => sum + t.amount, 0);

    const total_maintenance_collected = transactions
      .filter(t => t.category === 'Maintenance Payment')
      .reduce((sum, t) => sum + t.amount, 0);

    const total_expenses = transactions
      .filter(t => t.transaction_type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const net_advance_balance = total_advance - total_advance_returned;
    const net_balance = total_rent_collected + total_utilities_collected + total_maintenance_collected - total_expenses;

    const balance: CumulativeBalance = {
      property_id: propertyId,
      total_advance,
      total_advance_returned,
      net_advance_balance,
      total_rent_collected,
      total_utilities_collected,
      total_maintenance_collected,
      total_expenses,
      net_balance,
      last_updated: new Date().toISOString()
    };

    const existingIndex = balances.findIndex(b => b.property_id === propertyId);
    if (existingIndex >= 0) {
      balances[existingIndex] = balance;
    } else {
      balances.push(balance);
    }

    localStorage.setItem(this.STORAGE_KEYS.CUMULATIVE_BALANCES, JSON.stringify(balances));
    return balance;
  }

  // CSV Import
  importCSVData(csvData: CSVTransaction[]): void {
    // Clear existing data first
    this.clearAllData();
    this.initializeData();

    // Create properties from CSV data
    const propertyMap = new Map<string, string>();
    const tenantMap = new Map<string, string>();

    csvData.forEach(row => {
      if (row.house && !propertyMap.has(row.house)) {
        const property = this.addProperty({
          name: `House ${row.house}`,
          address_line1: `House ${row.house}`,
          city: 'Bangalore',
          state: 'Karnataka',
          postal_code: '560001',
          country: 'India',
          property_type_id: this.getPropertyTypes()[0].id,
          is_active: true
        });
        propertyMap.set(row.house, property.id);
      }

      if (row.name && !tenantMap.has(row.name)) {
        const tenant = this.addTenant({
          full_name: row.name,
          contact_phone: '',
          is_active: true
        });
        tenantMap.set(row.name, tenant.id);
      }
    });

    // Create leases and transactions
    csvData.forEach(row => {
      if (row.house && row.name && row.start_date) {
        const propertyId = propertyMap.get(row.house);
        const tenantId = tenantMap.get(row.name);

        if (propertyId && tenantId) {
          // Create lease if not exists
          const existingLease = this.getLeases().find(l => 
            l.property_id === propertyId && l.tenant_id === tenantId
          );

          let leaseId = existingLease?.id;
          if (!leaseId) {
            const lease = this.addLease({
              property_id: propertyId,
              tenant_id: tenantId,
              start_date: row.start_date,
              end_date: new Date(new Date(row.start_date).getFullYear() + 1, 0, 1).toISOString().split('T')[0],
              monthly_rent: row.rent || 0,
              security_deposit: 0, // Will be calculated from transactions
              maintenance_type: 'flexible',
              maintenance_charge: 0,
              is_active: true,
              status: 'active',
              renewal_reminder_days: 15
            });
            leaseId = lease.id;
          }

          // Create transaction
          if (row.total > 0) {
            const transaction = this.addTransaction({
              property_id: propertyId,
              lease_id: leaseId,
              transaction_type: 'income',
              category: this.determineTransactionCategory(row),
              amount: row.total,
              transaction_date: row.date,
              payment_method_id: this.getPaymentMethodByName(row.mode)?.id,
              destination_account: row.destination,
              description: `${row.name} - ${row.house}`,
              status: 'recorded',
              is_split: this.shouldSplitTransaction(row)
            });

            // Create splits if needed
            if (transaction.is_split) {
              this.createTransactionSplits(transaction.id, row);
            }

            // Create security deposit record if advance payment
            if (row.advance > 0) {
              this.addSecurityDeposit({
                lease_id: leaseId,
                transaction_id: transaction.id,
                amount: row.advance,
                type: 'payment',
                description: `Advance payment for ${row.name}`
              });
            }
          }
        }
      }
    });
  }

  private determineTransactionCategory(row: CSVTransaction): TransactionCategory {
    if (row.advance > 0) return 'Advance Payment';
    if (row.advance_return > 0) return 'Advance Return';
    if (row.rent > 0) return 'Rent Payment';
    if (row.water > 0) return 'Water Bill';
    if (row.electricity > 0) return 'Electricity Bill';
    if (row.maintainance > 0) return 'Maintenance Payment';
    return 'Other';
  }

  private shouldSplitTransaction(row: CSVTransaction): boolean {
    return (row.water > 0 && row.electricity > 0) || 
           (row.rent > 0 && (row.water > 0 || row.electricity > 0 || row.maintainance > 0));
  }

  private createTransactionSplits(transactionId: string, row: CSVTransaction): void {
    if (row.rent > 0) {
      this.addTransactionSplit({
        transaction_id: transactionId,
        category: 'Rent',
        amount: row.rent,
        description: 'Rent payment'
      });
    }

    if (row.water > 0) {
      this.addTransactionSplit({
        transaction_id: transactionId,
        category: 'Water',
        amount: row.water,
        description: 'Water bill payment'
      });
    }

    if (row.electricity > 0) {
      this.addTransactionSplit({
        transaction_id: transactionId,
        category: 'Electricity',
        amount: row.electricity,
        description: 'Electricity bill payment'
      });
    }

    if (row.maintainance > 0) {
      this.addTransactionSplit({
        transaction_id: transactionId,
        category: 'Maintenance',
        amount: row.maintainance,
        description: 'Maintenance payment'
      });
    }
  }

  private getPaymentMethodByName(name: string): PaymentMethod | null {
    const methods = this.getPaymentMethods();
    return methods.find(m => m.name.toLowerCase().includes(name.toLowerCase()) || 
                           m.type.toLowerCase().includes(name.toLowerCase())) || null;
  }

  clearAllData(): void {
    Object.values(this.STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}

export const storageService = new StorageService(); 