const SUPABASE_URL =
  "https://exbenmxowaqjjucafgqd.supabase.co";

const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4YmVubXhvd2Fxamp1Y2FmZ3FkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2NjIzODcsImV4cCI6MjA5NjIzODM4N30.RLpl_2Q8o8Hk4brGti5-TqyVazNgcKs1EJCHklHOSQc";

const supabaseClient =
  window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);


/* -------------------------
   LINK CONFIG (order = display order)
-------------------------- */
const LINK_CONFIG = {
  "Facebook":    { icon: "fa-brands fa-facebook-f",    class: "facebook" },
  "Instagram":   { icon: "fa-brands fa-instagram",     class: "instagram" },
  "TikTok":      { icon: "fa-brands fa-tiktok",        class: "tiktok" },
  "Website":     { icon: "fa-solid fa-globe",          class: "website" },
  "whatsapp":    { icon: "fa-brands fa-whatsapp",      class: "whatsapp",  label: "WhatsApp" },
  "phone":       { icon: "fa-solid fa-phone",          class: "phone",     label: "Call Us", prefix: "tel:" },
  "google_maps": { icon: "fa-solid fa-location-dot",   class: "maps",      label: "Find Us" }
};


/* -------------------------
   LOAD LINKS FROM SUPABASE
-------------------------- */
async function loadLinks() {

  const { data, error } =
    await supabaseClient
      .from("social_links")
      .select("platform, url");

  if (error) {
    console.error("Failed to load links:", error);
    return;
  }

  const container = document.getElementById("buttons");
  if (!container) return;
  container.classList.add("buttons");

  // Build a map: platform -> url
  const urlMap = {};
  data.forEach(row => {
    urlMap[row.platform] = row.url;
  });

  // Render in defined order
  Object.entries(LINK_CONFIG).forEach(([platform, config]) => {
    const rawUrl = urlMap[platform];
    if (!rawUrl) return;

    const url = config.prefix ? `${config.prefix}${rawUrl}` : rawUrl;
    const label = config.label || platform;

    const btn = document.createElement("a");
    btn.className = `btn ${config.class}`;
    btn.href = url;
    btn.target = "_blank";
    btn.innerHTML = `<i class="${config.icon}"></i> ${label}`;

    btn.addEventListener("click", () => trackClick(platform));

    container.appendChild(btn);
  });
}


/* -------------------------
   TRACK CLICK ANALYTICS
-------------------------- */
async function trackClick(platform) {
  try {
    await supabaseClient
      .from("link_clicks")
      .insert([{ platform }]);
  } catch (err) {
    console.error("Click tracking failed:", err);
  }
}


/* -------------------------
   INIT
-------------------------- */
document.addEventListener("DOMContentLoaded", loadLinks);
