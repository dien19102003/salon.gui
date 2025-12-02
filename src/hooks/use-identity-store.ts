"use client";

import { useEffect, useState } from "react";
import type { AuthUser } from "@/lib/api-client";
import { authUser } from "@/lib/api-client";

type IdentityState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

export const useIdentityStore = (): IdentityState => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const current = authUser.getCurrentUser();
    setUser(current);
    setIsLoading(false);
  }, []);

  return {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
  };
};


