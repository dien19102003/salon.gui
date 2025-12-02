
'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { salonApi, authUser } from '@/lib/api-client';

type Customer = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  code?: string | null;
};

type CustomerContextType = {
  customer: Customer | null;
  loading: boolean;
  error: string | null;
  loadCustomer: () => Promise<void>;
  clearCustomer: () => void;
};

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

const CUSTOMER_STORAGE_KEY = 'customerData';
const isBrowser = typeof window !== 'undefined';

// Customer storage helper
const customerStorage = {
  get: (): Customer | null => {
    if (!isBrowser || !window.localStorage) {
      return null;
    }
    try {
      const stored = window.localStorage.getItem(CUSTOMER_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as Customer;
      }
    } catch (err) {
      console.error('Failed to parse customer from localStorage:', err);
    }
    return null;
  },
  set: (customer: Customer | null) => {
    if (!isBrowser || !window.localStorage) {
      return;
    }
    try {
      if (customer) {
        window.localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customer));
      } else {
        window.localStorage.removeItem(CUSTOMER_STORAGE_KEY);
      }
    } catch (err) {
      console.error('Failed to save customer to localStorage:', err);
    }
  },
  clear: () => {
    if (!isBrowser || !window.localStorage) {
      return;
    }
    try {
      window.localStorage.removeItem(CUSTOMER_STORAGE_KEY);
    } catch (err) {
      console.error('Failed to clear customer from localStorage:', err);
    }
  },
};

export function CustomerProvider({ children }: { children: ReactNode }) {
  // Load từ localStorage khi khởi tạo, nhưng chỉ nếu user đã đăng nhập
  const [customer, setCustomer] = useState<Customer | null>(() => {
    if (isBrowser) {
      const currentUser = authUser.getCurrentUser();
      // Chỉ restore từ localStorage nếu user đã đăng nhập
      if (currentUser?.id) {
        return customerStorage.get();
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCustomer = useCallback(async () => {
    const currentUser = authUser.getCurrentUser();
    if (!currentUser?.id) {
      setCustomer(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Try without encoding first, as GUIDs don't need encoding
      const accountId = currentUser.id;
      console.log('Loading customer for accountId:', accountId);
      const response = await salonApi.get<any>(
        `/Customer/GetDetailByAccountId/${accountId}`
      );
      console.log('Customer API response:', response);
      
      // Handle different response structures
      let customerData: any = null;
      if (response) {
        if (response.data) {
          customerData = response.data;
        } else if (response.id) {
          // Response is the customer data directly
          customerData = response;
        }
      }

      if (customerData && customerData.id) {
        console.log('Setting customer data:', customerData);
        const customerInfo: Customer = {
          id: customerData.id,
          name: customerData.name || '',
          email: customerData.email || null,
          phone: customerData.phone || null,
          code: customerData.code || null,
        };
        setCustomer(customerInfo);
        // Lưu vào localStorage
        customerStorage.set(customerInfo);
      } else {
        console.warn('No customer data found in response');
        setCustomer(null);
        customerStorage.clear();
      }
    } catch (err: any) {
      // 404 means customer doesn't exist yet, which is OK
      if (err?.status === 404 || err?.response?.status === 404) {
        setCustomer(null);
        customerStorage.clear();
        setError(null); // Don't show error for 404
      } else {
        console.error('Failed to load customer:', err);
        setError('Không thể tải thông tin khách hàng');
        // Giữ lại customer từ localStorage nếu có, chỉ clear nếu lỗi nghiêm trọng
        const storedCustomer = customerStorage.get();
        if (!storedCustomer) {
          setCustomer(null);
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const clearCustomer = () => {
    setCustomer(null);
    customerStorage.clear();
    setError(null);
  };

  // Auto-load customer when user is logged in
  useEffect(() => {
    const checkAndLoadCustomer = () => {
      const currentUser = authUser.getCurrentUser();
      if (currentUser?.id) {
        // Nếu đã có customer trong localStorage và state, không cần load lại ngay
        const storedCustomer = customerStorage.get();
        if (storedCustomer && !customer) {
          // Restore từ localStorage trước
          setCustomer(storedCustomer);
        }
        
        // Chỉ load từ API nếu chưa có customer hoặc đang không loading
        if (!customer && !loading) {
          loadCustomer();
        }
      } else {
        // User đã logout, clear customer
        clearCustomer();
      }
    };

    // Check immediately
    checkAndLoadCustomer();

    // Check periodically (every 5 seconds) to catch login/logout events
    // Tăng interval lên 5 giây vì đã có localStorage
    const interval = setInterval(checkAndLoadCustomer, 5000);

    return () => clearInterval(interval);
  }, [loadCustomer, customer, loading]);

  return (
    <CustomerContext.Provider
      value={{
        customer,
        loading,
        error,
        loadCustomer,
        clearCustomer,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  const context = useContext(CustomerContext);
  if (context === undefined) {
    throw new Error('useCustomer must be used within a CustomerProvider');
  }
  return context;
}

