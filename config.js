/* ═══════════════════════════════════════════════════════════════════════════════
   /config.js — iQGen Technologies
   ClearSky-OMEGA EnergyOS · client deployment

   This is the ONLY file that differs between tenants. index.html,
   marketplace.html, projects.html and omega-brand.js are shared verbatim
   across every deployment — do not edit them here.
   ═══════════════════════════════════════════════════════════════════════════════ */
window.CLEARSKY_CONFIG = {

  /* ── Firebase ──────────────────────────────────────────────────────────────
     TODO: paste the Firebase web-app credentials for this deployment. Nobody
     can sign in until these are real. Reuse the clearsky-portal project if
     iQGen is a tenant inside it; create a separate project if their data must
     live in its own Firebase instance.                                       */
  firebase: {
    apiKey:            'REPLACE_ME',
    authDomain:        'REPLACE_ME.firebaseapp.com',
    projectId:         'REPLACE_ME',
    storageBucket:     'REPLACE_ME.appspot.com',
    messagingSenderId: 'REPLACE_ME',
    appId:             'REPLACE_ME'
  },

  /* ── The tenant ───────────────────────────────────────────────────────────── */
  tenant: {
    type:          'developer',
    orgId:         'iqgen.energy',        // hard tenant lock — scopes ALL Firestore reads
    clientName:    'iQGen Technologies',
    allowedDomain: 'iqgen.energy',        // only @iqgen.energy may sign in
    logo:          '/images/qgen-logo.png',

    /* ── TRIAL ────────────────────────────────────────────────────────────────
       tierLevel 1 keeps the tier gate ACTIVE, so only the tools listed in
       unlockedTools stay live and everything else shows the Upgrade overlay.
       (tierLevel >= 3 or accountTier 'Enterprise' would unlock everything.) */
    accountTier:   'Trial',
    tierLevel:     1,

    trial: {
      startsAt:     '2026-08-03',   // Monday Aug 3, 2026 — local midnight
      days:         30,             // runs through end of Tue Sep 1, 2026
      lockOnExpiry: false           // see README before flipping this to true
    },

    /* Tools live during the trial. Anything omitted renders locked with an
       upgrade prompt. Catalog keys currently available: editor, investment, sales. */
    requiredTools: ['editor'],
    unlockedTools: ['editor', 'sales'],

    /* Branding for customer-facing exports (proposals, PDFs). */
    exportBrand: {
      logo:              '/images/qgen-logo.png',
      name:              'iQGen Technologies',
      poweredBy:         'Powered by ClearSky-OMEGA',
      platformCopyright: '© 2026 ClearSky Energy Solutions LLC · ClearSky-OMEGA platform'
    }
  },

  /* ── ClearSky staff who may preview this deployment ───────────────────────
     These domains keep access even after the trial expires, so you can always
     get in to demo or troubleshoot.                                          */
  adminDomains: ['csebuilders.com', 'clearsky-usa.com'],

  platformName: 'ClearSky-OMEGA',
  supportEmail: 'support@iqgen.energy'
};
