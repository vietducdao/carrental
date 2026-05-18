import mongoose from "mongoose";

// Singleton document — there is only ever one SiteSetting record.
const siteSettingSchema = new mongoose.Schema(
  {
    // Company info (shared between Contact + Footer)
    companyName: { type: String, default: "Carshops" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    hours: { type: String, default: "" },

    // Hero section (homepage)
    heroPremium: { type: String, default: "" },
    heroTitle: { type: String, default: "" },
    heroSubtitle: { type: String, default: "" },
    heroDesc: { type: String, default: "" },

    // About section
    aboutTitle1: { type: String, default: "" },
    aboutTitle2: { type: String, default: "" },
    aboutDesc: { type: String, default: "" },
    aboutFeature1: { type: String, default: "" },
    aboutFeature2: { type: String, default: "" },

    // Footer
    footerTagline: { type: String, default: "" },
    copyright: { type: String, default: "" },

    // Social links
    socials: {
      facebook: { type: String, default: "" },
      twitter: { type: String, default: "" },
      instagram: { type: String, default: "" },
      tiktok: { type: String, default: "" },
      messenger: { type: String, default: "" },
      zalo: { type: String, default: "" },
    },

    // Contact page map embed (Google Maps iframe src)
    mapEmbedSrc: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("SiteSetting", siteSettingSchema);
