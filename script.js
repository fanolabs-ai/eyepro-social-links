const SUPABASE_URL =
  "https://exbenmxowaqjjucafgqd.supabase.co";

const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4YmVubXhvd2Fxamp1Y2FmZ3FkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2NjIzODcsImV4cCI6MjA5NjIzODM4N30.RLpl_2Q8o8Hk4brGti5-TqyVazNgcKs1EJCHklHOSQc";

const supabaseClient =
  window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);


/* -------------------------
   LOAD LINKS FROM SUPABASE
-------------------------- */
async function loadLinks() {

  const { data, error } =
    await supabaseClient
      .from("social_links")
      .select("*")
      .limit(1)
      .single();

  if (error) {
    console.error("Failed to load links:", error);
    return;
  }

  const container = document.getElementById("buttons");

  if (!container) {
    console.error("Buttons container not found");
    return;
  }

  container.classList.add("buttons");

  const links = [
    { name: "Facebook", url: data.facebook, icon: "fa-brands fa-facebook-f", class: "facebook" },
    { name: "Instagram", url: data.instagram, icon: "fa-brands fa-instagram", class: "instagram" },
    { name: "TikTok", url: data.tiktok, icon: "fa-brands fa-tiktok", class: "tiktok" },
    { name: "Website", url: data.website, icon: "fa-solid fa-globe", class: "website" },
    { name: "WhatsApp", url: data.whatsapp, icon: "fa-brands fa-whatsapp", class: "whatsapp" },
    { name: "Call Us", url: `tel:${data.phone}`, icon: "fa-solid fa-phone", class: "phone" },
    { name: "Find Us", url: data.google_maps, icon: "fa-solid fa-location-dot", class: "maps" }
  ];

  links.forEach(link => {

    if (!link.url) return;

    const btn = document.createElement("a");
    btn.className = `btn ${link.class}`;
    btn.href = link.url;
    btn.target = "_blank";

    btn.innerHTML = `<i class="${link.icon}"></i> ${link.name}`;

    btn.addEventListener("click", () => {
      trackClick(link.name);
    });

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
      .insert([
        { platform: platform }
      ]);
  } catch (err) {
    console.error("Click tracking failed:", err);
  }
}


/* -------------------------
   INIT APP (SAFE LOAD)
-------------------------- */
document.addEventListener("DOMContentLoaded", loadLinks);
