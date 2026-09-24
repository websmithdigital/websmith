"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export interface UsePersistedTabOptions<T extends string> {
  paramName?: string; // Query param name, default "tab"
  allowedTabs?: readonly T[]; // Optional list of allowed tab IDs for strict validation
  storageKeyPrefix?: string; // Custom prefix, default "wsd_tab"
}

/**
 * Universal hook to synchronize and persist active tab state across page refreshes.
 *
 * Priority on mount:
 * 1. URL search param (?paramName=...)
 * 2. sessionStorage (keyed by pathname + paramName)
 * 3. Default initial value
 *
 * On change:
 * - Updates local React state
 * - Syncs to sessionStorage
 * - Syncs to URL search params via window.history.replaceState (no scroll jump, no re-mount)
 * - Supports browser Back/Forward (popstate)
 */
export function usePersistedTab<T extends string>(
  defaultTab: T,
  options?: UsePersistedTabOptions<T>
): [T, (newTab: T) => void] {
  const paramName = options?.paramName || "tab";
  const allowedTabs = options?.allowedTabs;
  const storagePrefix = options?.storageKeyPrefix || "wsd_tab";

  const getStorageKey = useCallback(() => {
    if (typeof window === "undefined") return "";
    return `${storagePrefix}:${window.location.pathname}:${paramName}`;
  }, [storagePrefix, paramName]);

  const isValidTab = useCallback(
    (tab: any): tab is T => {
      if (typeof tab !== "string" || !tab) return false;
      if (allowedTabs && allowedTabs.length > 0) {
        return (allowedTabs as readonly string[]).includes(tab);
      }
      return true;
    },
    [allowedTabs]
  );

  // Initialize state with defaultTab (safe for SSR)
  const [activeTab, setActiveTabState] = useState<T>(defaultTab);
  const isInitializedRef = useRef(false);

  // Read initial tab from URL or sessionStorage once mounted on client
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const url = new URL(window.location.href);
      const urlTab = url.searchParams.get(paramName);

      if (urlTab && isValidTab(urlTab)) {
        setActiveTabState(urlTab);
        sessionStorage.setItem(getStorageKey(), urlTab);
        isInitializedRef.current = true;
        return;
      }

      // Fallback to sessionStorage
      const savedTab = sessionStorage.getItem(getStorageKey());
      if (savedTab && isValidTab(savedTab)) {
        setActiveTabState(savedTab);
        // Sync URL quietly
        url.searchParams.set(paramName, savedTab);
        window.history.replaceState(null, "", url.toString());
        isInitializedRef.current = true;
        return;
      }

      // Default tab
      if (defaultTab) {
        sessionStorage.setItem(getStorageKey(), defaultTab);
      }
    } catch {
      // In case of restricted storage
    } finally {
      isInitializedRef.current = true;
    }
  }, [paramName, isValidTab, getStorageKey, defaultTab]);

  // Listen for browser back/forward buttons
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handlePopState = () => {
      try {
        const url = new URL(window.location.href);
        const urlTab = url.searchParams.get(paramName);
        if (urlTab && isValidTab(urlTab)) {
          setActiveTabState(urlTab);
          sessionStorage.setItem(getStorageKey(), urlTab);
        } else if (isValidTab(defaultTab)) {
          setActiveTabState(defaultTab);
        }
      } catch {
        // Safe fallback
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [paramName, isValidTab, defaultTab, getStorageKey]);

  // Set tab handler
  const setTab = useCallback(
    (newTab: T) => {
      setActiveTabState(newTab);

      if (typeof window === "undefined") return;

      try {
        // Save to session storage
        sessionStorage.setItem(getStorageKey(), newTab);

        // Update URL search param
        const url = new URL(window.location.href);
        url.searchParams.set(paramName, newTab);
        window.history.replaceState(null, "", url.toString());
      } catch {
        // Safe fallback
      }
    },
    [getStorageKey, paramName]
  );

  return [activeTab, setTab];
}
