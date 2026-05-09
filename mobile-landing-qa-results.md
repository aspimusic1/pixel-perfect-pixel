# Mobile Landing Page QA Results

The landing page was validated against the live development preview at a mobile viewport of **390 × 844** using the sandbox Chromium browser.

| Check | Result | Notes |
|---|---|---|
| Mobile header initially collapses role links | Pass | `Promoters` was not visible before opening the mobile drawer (`menuLabelBefore: false`) |
| Mobile drawer exposes the Promoter navigation path | Pass | Drawer content included `Promoters` (`drawerHasPromoters: true`) |
| Promoter drawer link resolves correctly | Pass | Drawer navigation reached `/browse/promoters` (`promoterRouteOk: true`) |
| Waitlist form submits successfully on mobile | Pass | Submission displayed `You are on the list. We will reach out with the next access window.` (`waitlistSuccess: true`) |
