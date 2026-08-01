# iQGen Technologies — ClearSky-OMEGA Portal

Client deployment of the ClearSky-OMEGA EnergyOS portal for **iQGen Technologies**
([iqgen.energy](https://iqgen.energy)).

---

## Trial account

| | |
|---|---|
| Account tier | **Trial** (`tierLevel: 1`) |
| Starts | **Mon Aug 3, 2026** |
| Length | **30 days** |
| Last full day | **Tue Sep 1, 2026** |
| Expires | **Wed Sep 2, 2026, 00:00** local |
| On expiry | Banner only — access continues (`lockOnExpiry: false`) |

A countdown banner renders at the top of every page and moves through four states:

- **Before Aug 3** — blue, "30 days left in your 30-day trial · starts Aug 3, 2026"
  (the full allotment: no days are consumed before the start date)
- **Aug 3 – Aug 25** — amber, "N days left in your 30-day trial · ends Sep 1, 2026"
- **Final 7 days** — red, same copy with more urgency
- **From Sep 2** — grey, "Trial ended Sep 1, 2026"

### Cutting access off at expiry

`lockOnExpiry: false` is deliberate: the trial lapsing shows a banner but does
**not** lock anyone out. To make expiry hard, set it to `true` in `config.js`:

```js
trial: { startsAt: '2026-08-03', days: 30, lockOnExpiry: true }
```

From Sep 2 every `@iqgen.energy` sign-in is then refused with a message pointing
at `support@iqgen.energy`. Domains in `adminDomains` keep access regardless, so
ClearSky staff can still get in.

### Extending the trial

Change `days`, or move `startsAt`. Both take effect on next page load — no
rebuild. To convert to a paid account, drop the `trial` block entirely and set
`accountTier: 'Enterprise'` with `tierLevel: 3`.

---

## What's in here

| File | Shared? | Notes |
|---|---|---|
| `index.html` | **shared** | Portal dashboard |
| `marketplace.html` | **shared** | App marketplace |
| `projects.html` | **shared** | Project list |
| `omega-brand.js` | **shared** | Tenant resolution + branding |
| `config.js` | **tenant-specific** | The only file to edit |
| `qgen-logo.png` | tenant asset | repo is flat, matching `salesdemo` |
| `omega-logo.png` | platform asset | ClearSky-OMEGA mark |

The four shared files are byte-identical across every ClearSky-OMEGA tenant.
Fixes belong upstream and get copied down — never patch them here, or this repo
silently forks.

---

## Before this goes live

1. **Fill in the Firebase block in `config.js`.** It's `REPLACE_ME` right now, so
   nobody can sign in. Reuse the `clearsky-portal` project if iQGen is a tenant
   inside it; create a separate project if their data must be isolated at the
   Firebase level.
2. **Authorize the domain** in Firebase Console → Authentication → Settings →
   Authorized domains. Google sign-in fails without this.
3. **Confirm Firestore rules scope by `orgId`.** Everything here is scoped to
   `orgId: 'iqgen.energy'`, but the client-side scope is a convenience — the
   rules are the actual boundary.
4. **Seed or import their projects** with `orgId: 'iqgen.energy'`, otherwise the
   portal authenticates fine and shows an empty portfolio.

---

## Access rules

- Only `@iqgen.energy` accounts may sign in.
- `csebuilders.com` and `clearsky-usa.com` may preview (and survive expiry).
- To admit an individual outside address — a consultant's Gmail, say — add it to
  the tenant rather than opening a whole domain:

  ```js
  allowedEmails: ['someone@gmail.com']
  ```

---

## Tools during the trial

The **entire catalog is visible**. Anything this account can't use renders with
an "Upgrade" badge and a mailto to `dev@clearsky-usa.com`.

Unlocked for iQGen:

| Key | Tool | Status |
|---|---|---|
| `editor` | BESS Site Map | confirmed · also pinned via `requiredTools` |
| `financing` | Financing Partners | confirmed |
| `grid_atlas` | Grid Atlas | **key unverified** |

### How the gate actually works

From `omega-tools.js`:

```
unlocked = requiredTools.has(key)
        || unlockedTools.has(key)
        || tierLevel >= (tool.tier ?? 1)
```

Tool tiers are `ALL=0`, `STANDARD=1`, `DELUXE=2`, `ENTERPRISE=3`. That third
clause matters: at `tierLevel: 1` ten of sixteen tools unlock on tier alone.
`tierLevel: -1` sits below `TIER.ALL`, so nothing passes on tier and access
comes only from the two explicit lists.

Set `tierLevel: 3` on conversion to open everything.

### Grid Atlas

Not in the `omega-tools.js` seed catalog. `hydrate()` replaces the seed with the
Firestore `tools` collection when it's non-empty, and that collection has moved
ahead — the live marketplace shows "Interconnection & Grid" and "Operations &
Asset Management" categories the seed doesn't define. Run `OMEGAKeys()` in the
browser console to get the real key and replace the placeholder in `config.js`.

---

## Note on the logo

`images/qgen-logo.png` is the file you supplied, matching the path their own
site uses. It reads "QGEN" while the company writes itself **iQGen** — the
portal shows `clientName` ("iQGen Technologies") as text beside it, so the
distinction is preserved either way. If they have a wordmark with the leading
*i*, swap the file and keep the filename.
