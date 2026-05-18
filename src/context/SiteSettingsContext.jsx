import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

const SiteSettingsContext = createContext(null);

const empty = {
  companyName: "",
  email: "",
  phone: "",
  address: "",
  hours: "",
  heroPremium: "",
  heroTitle: "",
  heroSubtitle: "",
  heroDesc: "",
  aboutTitle1: "",
  aboutTitle2: "",
  aboutDesc: "",
  aboutFeature1: "",
  aboutFeature2: "",
  footerTagline: "",
  copyright: "",
  mapEmbedSrc: "",
  socials: { facebook: "", twitter: "", instagram: "", tiktok: "", messenger: "", zalo: "" },
};

export const SiteSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(empty);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/site-settings")
      .then((r) => setSettings({ ...empty, ...r.data.settings, socials: { ...empty.socials, ...(r.data.settings?.socials || {}) } }))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => {
  const ctx = useContext(SiteSettingsContext);
  if (!ctx) throw new Error("useSiteSettings must be used within SiteSettingsProvider");
  return ctx;
};
