
"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase'
import { doc } from 'firebase/firestore'

type LanguageContextType = {
  currentLanguage: string;
  setLanguage: (lang: string) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState("English");
  const { user } = useUser();
  const db = useFirestore();

  // Load profile to sync language preference from cloud
  const profileRef = useMemoFirebase(() => {
    if (!user || user.isAnonymous) return null;
    return doc(db, 'user_profiles', user.uid);
  }, [db, user]);

  const { data: profile } = useDoc(profileRef);

  useEffect(() => {
    // 1. First priority: Cloud profile
    if (profile?.preferredLanguageId) {
      setCurrentLanguage(profile.preferredLanguageId);
    } 
    // 2. Second priority: Local storage
    else {
      const saved = localStorage.getItem('app-language');
      if (saved) setCurrentLanguage(saved);
    }
  }, [profile]);

  const setLanguage = (lang: string) => {
    setCurrentLanguage(lang);
    localStorage.setItem('app-language', lang);
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useAppLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useAppLanguage must be used within a LanguageProvider');
  }
  return context;
}
