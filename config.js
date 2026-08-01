/* ═══════════════════════════════════════════════════════════════════════════════
   /config.js — iQGen Technologies
   ClearSky-OMEGA EnergyOS · client deployment

   This is the ONLY file that differs between tenants. index.html,
   marketplace.html, projects.html and omega-brand.js are shared verbatim
   across every deployment — do not edit them here.
   ═══════════════════════════════════════════════════════════════════════════════ */
window.CLEARSKY_CONFIG = {

  /* ═════════════════════════════════════════════════════════════════════════
     >>  FIREBASE — THE ONLY THING LEFT TO FILL IN  <<
     ─────────────────────────────────────────────────────────────────────────
     Until these are real, sign-in fails with:
         Firebase: Error (auth/api-key-not-valid.-please-pass-a-valid-api-key.)

     Get them either way:

       A) Copy from a working sibling deployment (same Firebase project, so
          iQGen becomes another tenant in clearsky-portal — almost certainly
          what you want):

            curl -s https://demo.clearskyomega.com/config.js | sed -n '/firebase:/,/}/p'

       B) Firebase Console -> Project settings -> General -> Your apps
          -> Web app -> SDK setup and configuration

     Then: Authentication -> Settings -> Authorized domains
           -> add  iqgen.clearskyomega.com
           (skip this and you trade the API-key error for
            auth/unauthorized-domain on the very next attempt)
     ═════════════════════════════════════════════════════════════════════════ */
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


/* ═══════════════════════════════════════════════════════════════════════════════
   SETUP GUARD
   Catches the two things that break a fresh deployment and says so in plain
   language, instead of leaving a raw Firebase SDK string on the sign-in card.
   Safe to delete once this deployment is live.
   ═══════════════════════════════════════════════════════════════════════════════ */
(function (cfg) {
  var problems = [];

  var fb = cfg.firebase || {};
  var placeholder = false;
  for (var k in fb) {
    if (fb.hasOwnProperty(k) && String(fb[k]).indexOf('REPLACE_ME') >= 0) placeholder = true;
  }
  if (placeholder) {
    problems.push('/config.js still has placeholder Firebase credentials. '
      + 'Copy the firebase block from a working deployment, or from '
      + 'Firebase Console \u2192 Project settings \u2192 Your apps \u2192 Web app.');
  }

  /* Firebase Auth only permits an insecure origin on localhost. */
  var host = location.hostname;
  var localish = (host === 'localhost' || host === '127.0.0.1' || host === '[::1]');
  if (location.protocol === 'http:' && !localish) {
    problems.push('This page is served over HTTP. Firebase Auth requires HTTPS '
      + 'outside localhost \u2014 Google sign-in will fail and passwords are sent '
      + 'in cleartext. Install a certificate for ' + host + '.');
  }

  if (!problems.length) return;

  if (window.console && console.error) {
    for (var i = 0; i < problems.length; i++) {
      console.error('[ClearSky-OMEGA setup] ' + problems[i]);
    }
  }

  /* Replace the raw SDK error on the auth card with something actionable. */
  function show() {
    var el = document.getElementById('auth-err');
    if (!el) { return setTimeout(show, 200); }
    el.textContent = 'Deployment not finished: ' + problems.join(' \u00B7 ');
    el.style.display = 'block';
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', show);
  } else {
    show();
  }
})(window.CLEARSKY_CONFIG);
