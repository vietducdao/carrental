import SiteSetting from "../models/SiteSetting.js";

// Always return a single (existing or newly-created empty) settings document.
const getOrCreate = async () => {
  let doc = await SiteSetting.findOne();
  if (!doc) doc = await SiteSetting.create({});
  return doc;
};

export const getSiteSettings = async (req, res) => {
  try {
    const doc = await getOrCreate();
    res.json({ settings: doc });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const TOP_FIELDS = [
  "companyName", "email", "phone", "address", "hours",
  "heroPremium", "heroTitle", "heroSubtitle", "heroDesc",
  "aboutTitle1", "aboutTitle2", "aboutDesc", "aboutFeature1", "aboutFeature2",
  "footerTagline", "copyright",
  "mapEmbedSrc",
];

const SOCIAL_FIELDS = ["facebook", "twitter", "instagram", "tiktok", "messenger", "zalo"];

export const updateSiteSettings = async (req, res) => {
  try {
    const doc = await getOrCreate();
    const body = req.body || {};

    TOP_FIELDS.forEach((k) => {
      if (body[k] !== undefined) doc[k] = body[k];
    });

    if (body.socials && typeof body.socials === "object") {
      SOCIAL_FIELDS.forEach((k) => {
        if (body.socials[k] !== undefined) doc.socials[k] = body.socials[k];
      });
    }

    await doc.save();
    res.json({ settings: doc });
  } catch (err) {
    if (err.name === "ValidationError") {
      const detail = Object.values(err.errors).map((e) => e.message).join("; ");
      return res.status(400).json({ message: detail || "Dữ liệu không hợp lệ" });
    }
    res.status(500).json({ message: err.message });
  }
};
