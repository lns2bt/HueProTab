# HueProTab Design Spec

## Summary
HueProTab will be a dark-mode Philips Hue control web app that users can open directly in Chrome on Windows 10 or Android without running an always-on application server. The repository will remain modular for development, but the build output will be a single self-contained `dist/index.html` file with all HTML, CSS, and JavaScript inlined.

The product direction is a dashboard-first control center. The landing experience after setup should prioritize quick access tiles and common actions, while still providing clean drill-down views for rooms/zones, lights, and scenes. The setup flow should be zero-install for the user: discover or manually enter the bridge, pair once by pressing the bridge button, store credentials locally per device, and reconnect silently on later visits.

## Goals
- Deliver a single-file web app that can be opened in Chrome on Windows 10 and Android.
- Keep the development codebase modular enough for multiple agents to work on separate responsibilities.
- Make first-run bridge discovery and pairing as easy and robust as possible.
- Provide a clean, balanced-density dark UI with customizable quick-access areas, hidden/collapsible sections, and practical color controls.
- Support direct control of lights, rooms/zones/groups, and scenes without requiring a custom backend server.

## Non-Goals
- Building a cloud relay or remote-outside-the-LAN control path.
- Shipping a multi-page framework app or requiring a local daemon for normal use.
- Implementing every advanced Hue feature in the first shipping version.
- Optimizing for browsers outside Chrome on Windows 10 and Android in the first phase.

## User Experience

### Setup flow
The first-run setup will be a focused three-step wizard:
1. Find a bridge automatically, with immediate fallback to manual IP entry.
2. Test connectivity and guide the user to press the physical bridge button.
3. Save the bridge connection details in browser storage and continue into the dashboard.

The setup experience should explain failures in plain language, retry pairing for a short window after the user presses the bridge button, and avoid exposing advanced fields unless recovery is needed. On future visits, the app should try the saved bridge first, then retry discovery, then offer manual recovery.

### Main dashboard
The dashboard will be customizable and organized around everyday use rather than raw Hue API structure.

The default layout will include:
- a compact top bar with bridge status, refresh, and settings
- a customizable quick-access region for pinned items and quick actions
- separate dashboard sections for rooms/zones, lights, and scenes

Balanced density means the dashboard surfaces the common controls directly—power, brightness, scene shortcuts, and quick color controls—while hiding secondary controls inside expandable card details or settings drawers.

### Controls
Lights, groups/rooms, and scenes should feel visually consistent while exposing the right level of control for each entity.

- **Lights:** on/off, brightness, quick color or temperature shortcut, recent colors, pin/unpin, expandable detail area.
- **Rooms/Zones/Groups:** on/off, brightness, group-level quick color control where supported, member summary, favorite scenes, pin/unpin.
- **Scenes:** one-tap apply, favorite pin, grouped presentation by room/zone, quick visibility from dashboard.

### Personalization
Per-device preferences stored in browser storage will include:
- pinned quick-access items
- hidden or collapsed sections
- sort and section ordering preferences
- favorite scenes
- recent colors and quick presets
- saved bridge metadata and application key

## Technical Approach

### Runtime architecture
HueProTab will be a fully client-side application. The runtime will be a single HTML file containing:
- application shell HTML
- compiled/inlined CSS
- compiled/inlined JavaScript
- static UI templates or rendered view markup

The browser-side architecture will still be split conceptually into services and views:
- bridge discovery service
- pairing/auth service
- Hue API client
- application state store
- preferences store
- UI rendering/controller layer

This gives the project a backend-like structure without requiring a backend process.

### Development architecture
The repository will use a source-first layout that compiles into one final file. Recommended structure:

```text
src/
  html/
    shell.html
    views/
      setup.html
      dashboard.html
      settings.html
    components/
      quick-access.html
      room-card.html
      light-card.html
      scene-card.html
  css/
    tokens.css
    base.css
    layout.css
    components/
      cards.css
      controls.css
      color-picker.css
  js/
    app.js
    config.js
    state/
      store.js
      preferences.js
    services/
      discovery.js
      pairing.js
      hue-client.js
    ui/
      router.js
      render-dashboard.js
      render-setup.js
      components/
        quick-access.js
        room-card.js
        light-card.js
        scene-card.js
        color-picker.js
scripts/
  build-single-html.mjs
  validate-dist.mjs
dist/
  index.html
```

### Build strategy
A small build script will inline the HTML fragments, CSS bundles, and JavaScript modules into a single `dist/index.html` artifact. The build should be deterministic and simple enough that multiple agents can work on isolated source files without editing the generated output directly.

The build layer is essential because it separates developer ergonomics from runtime simplicity:
- developers get small focused files
- users get a single-file app
- integration work happens in one controlled assembly step

## Agent / Team Decomposition
The work should be split into independently owned layers so parallel contributors do not collide.

### Foundation / Build agent
Responsible for:
- repository structure
- build script
- generated artifact contract
- lint/test/build entry points
- output validation

### Hue platform agent
Responsible for:
- bridge discovery
- manual IP fallback
- pairing flow
- Hue API wrapper
- bridge connection error recovery

### Frontend shell agent
Responsible for:
- global layout
- top navigation/status bar
- dark-mode token system
- dashboard section framing
- responsive behavior for desktop and phone

### Domain component agent
Responsible for:
- light cards
- room/group cards
- scene cards
- sliders and quick controls
- color picker integration

### Personalization/state agent
Responsible for:
- local storage schema
- pinned quick-access behavior
- hidden/collapsed sections
- recents/favorites/presets
- hydration/reset behavior

### Integration agent
Responsible for:
- wiring all services to UI
- build output verification
- end-to-end smoke validation
- keeping `dist/index.html` in sync with source modules

## First PR Strategy
The first pull request should establish the rails for future parallel work instead of trying to ship the whole product.

### First PR objective
Create a clean modular skeleton that already builds a single HTML artifact and presents a believable product shell.

### First PR should include
- source tree layout
- single-file build script
- generated `dist/index.html`
- base dark-mode design tokens and shell layout
- placeholder setup wizard
- placeholder dashboard sections for quick access, rooms, lights, and scenes
- browser storage abstraction with stubbed contracts
- service interfaces for discovery/pairing/Hue client with fake data or TODO stubs

### First PR should avoid
- full production Hue integration
- full scene and color control logic
- deep personalization behavior
- premature visual polish everywhere

This keeps the first PR reviewable and unlocks clean follow-up work.

## Delivery Phases
1. **Foundation:** scaffold the modular source tree, build system, shell, storage contract, and placeholder views.
2. **Setup and bridge connectivity:** implement discovery, manual IP fallback, pairing, persistence, and reconnect behavior.
3. **Read-only dashboard data:** load and render real lights, rooms/zones, and scenes with loading/error states.
4. **Interactive control layer:** add power, brightness, scene activation, and quick actions.
5. **Color and personalization:** add recent colors, full color picker, hide/show controls, pins, favorites, and section customization.
6. **Polish and validation:** responsive tuning, accessibility, robustness, build validation, and cross-device smoke checks.

## Risks and mitigations
- **Bridge/browser connectivity quirks:** keep manual IP fallback, clear error states, and conservative retry logic.
- **Single-file output getting messy:** enforce source/generated separation and validate the build artifact automatically.
- **Too much dashboard clutter:** default to balanced density, use collapsible details, and support hidden sections.
- **Multi-agent merge conflicts:** define strict file ownership boundaries and reserve generated output updates for integration/build steps.

## Testing strategy
Testing should exist at multiple layers even in a static app:
- unit tests for storage, mapping, and build helpers
- service-level tests for bridge discovery/auth/client wrappers where feasible
- render-level tests for dashboard sections and entity cards
- build validation to ensure a correct single-file output is produced
- smoke checks on desktop Chrome and Android Chrome against the generated artifact

## Open points for implementation
The design assumes direct browser-to-bridge communication is viable for the user’s environment. The implementation plan should explicitly include validation of the bridge communication path and define graceful fallback messaging if the browser environment blocks some requests.
