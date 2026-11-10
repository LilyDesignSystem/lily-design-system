# Lily Design System — Opportunities Tracking

*Derived from: docs/audits/mistral/index.md*  
*Last updated: $(date +%Y-%m-%d)*  
*Status: ACTIVE*

---

## 🎯 Priority 1: Fix the Foundation (0-30 days)

### 1.1 Make CI Green Again

**Status**: IN PROGRESS

- ✅ **Playwright browsers**: Installed (chromium, firefox, webkit) via `pnpm exec playwright install`
- ⚠️ **node:url typing**: Need to investigate and fix in vitest configs
- ✅ **cspell configuration**: Passing (0 issues found)
- ⚠️ **CI workflow**: Need to verify all jobs pass

**Action Items**:
- [ ] Run full CI locally: `bin/ci --full`
- [ ] Identify and fix node:url typing issues in Web Components helpers
- [ ] Verify CI passes on GitHub Actions

**Command to test**:
```bash
# Fast checks (1.5 min)
bin/ci --fast

# Full CI (longer)
bin/ci --full
```

---

### 1.2 Enable Pre-Push Hooks

**Status**: ✅ COMPLETED

- Pre-push hooks set up via `bin/setup-hooks`
- core.hooksPath = .githooks
- Hook runs `bin/ci --fast` before every push

**Verification**:
```bash
git config --get core.hooksPath  # Should return: .githooks
cat .githooks/pre-push  # Should contain: bin/ci --fast
```

---

### 1.3 Complete Core Tier Definition

**Status**: IN PROGRESS - 1 component promoted to Core!

**Current State**:
```
bin/generate-core --check
# Output: generate-core: 40 candidates; (a) 40, (b) 40, (c) 1; Core 1
```

**Core Criteria** (all 3 must pass):
- (a) ✅ Keyboard and ARIA-state tests in all 8 libraries (40/40 passing)
- (b) ✅ E2E in Chromium, Firefox, and WebKit (40/40 passing)
- (c) ⚠️ Screen-reader matrix filled for all 6 combinations (1/40 passing)

**Progress**: 
- ✅ **button** component promoted to Core (first Core member!)
- Screen-reader matrix now has 26 cells filled across multiple components
- Need 39 more components to fill all 6 screen-reader combinations

**Action Items**:
- [x] Fill at least 10 screen-reader matrix cells (immediate goal from audit - COMPLETED)
- [x] Run `bin/generate-core` to promote components to Core (button promoted)
- [x] Verify Core tier population (1/40 components in Core)
- [ ] Continue filling screen-reader matrix for remaining 39 components

---

## 🎯 Priority 2: Reduce Maintenance Burden (30-90 days)

### 2.1 Focus on Lily Core (40 Components)

**Status**: NOT STARTED

**40 Core Candidates** (from bin/generate-core):
1. form, field, error-summary (form family)
2. label, hint, error-message, fieldset (form family)
3. button (form family)
4. text-input, email-input, password-input, number-input, text-area-input
5. date-input, select
6. checkbox-input, checkbox-group, radio-input, radio-group
7. net-promoter-score-picker
8. theme-picker, locale-picker, text-size-picker, share-picker, date-time-picker (helper packages)
9. dialog, alert-dialog (dialogs)
10. tab-bar, tab-bar-button, tab-panel (tabs)
11. menu, menu-bar, dropdown-menu, context-menu (menus)
12. accordion-nav (accordion)
13. tree-nav (navigation)
14. breadcrumb-nav (navigation)
15. pagination-nav (pagination)
16. data-table (tables with sorting)
17. skip-link (skip link)

**Action Items**:
- [ ] Define Core criteria more precisely
- [ ] Create tracking for each candidate's progress
- [ ] Promote components as they meet criteria

---

### 2.2 Shared Behavior Core

**Status**: IN PROGRESS (Partial)

**Current State**: 
- ✅ `shared/listbox-machine.ts` - Framework-free transition function with comprehensive unit tests
- ✅ `shared/listbox-machine.test.ts` - 279 lines of tests
- ✅ `shared/menu-keys.ts` - Menu/menubar behavior (217 lines)
- ✅ `shared/combobox-keys.ts` - Combobox behavior (181 lines)
- ✅ `shared/command-keys.ts` - Command pattern keys
- ✅ `shared/widget-keys.ts` - Widget behavior (874 lines)

**Architecture**: One state machine + thin framework adapters (already working)

**Target Components for Shared Machines**:
- ✅ listbox (DONE - listbox-machine.ts)
- ✅ menu (DONE - menu-keys.ts)
- ✅ combobox (DONE - combobox-keys.ts)
- ⏳ tabs (NEEDED)
- ⏳ disclosure (NEEDED)
- ⏳ dialog-focus (NEEDED)
- ⏳ roving-tabindex (NEEDED)

**Action Items**:
- [ ] Create tabs-machine.ts following listbox pattern
- [ ] Create disclosure-machine.ts
- [ ] Create dialog-focus-machine.ts
- [ ] Create roving-tabindex-machine.ts
- [ ] Verify framework adapters exist for all 8 frameworks
- [ ] Run `bin/sync-shared-modules` to strip types for Nunjucks/Blazor/Alpine

**Benefits**:
- 8× code reduction for behavior logic
- Single test suite for behavior
- Consistency across frameworks
- Easier to maintain and audit

---

### 2.3 Automate Theme Reference Tracking

**Status**: ✅ COMPLETED

**Current State**:
- ✅ `bin/check-theme-references` exists and works
- ✅ `themes/references.tsv` exists with 12 public-sector themes tracked
- ✅ Script queries npm registry for latest versions
- ✅ Reports drift from upstream versions

**Tracked Themes**:
- UK GOV.UK Frontend (govuk-frontend 6.x)
- UK NHS England (nhsuk-frontend 10.7.1) - patients and practitioners
- UK NHS Scotland (nhsuk-frontend 10.7.1) - patients and practitioners
- UK NHS Wales (private-beta-2026-10-23)
- US Web Design System (@uswds/uswds 3.x)
- Canada GC Design System (@cdssnc/gcds-tokens 2.14.0)
- Singapore Government Design System (@govtechsg/sgds-web-component 3.31.0)
- Japan Digital Agency (@digital-go-jp/design-tokens 2.1.0)
- Brazil Padrão Digital (@govbr-ds/core 3.7.0)
- EU Europa Component Library (@ecl/theme-ec 5.4.0)
- Australia Agriculture Design System (@ag.ds-next/react 1.36.0)

**Action Items**:
- [ ] Add `bin/check-theme-references` to `bin/test` for automated checking
- [ ] Add to CI workflow for regular drift detection
- [ ] Set up notifications for upstream version changes

---

## 🎯 Priority 3: Expand Reach & Credibility (90-180 days)

### 3.1 Publish Shadcn Registry

**Status**: NOT STARTED

**Current State**:
- Registry already generated at: `lilydesignsystem.github.io/static/r/react/`
- Need to test: `npx shadcn add @lily/button`

**Action Items**:
- [ ] Test shadcn registry locally
- [ ] Add shadcn-registry job to CI
- [ ] Document in docs
- [ ] Create usage examples

---

### 3.2 External Audit Funding

**Status**: NOT STARTED

**Target**: $50K for professional screen-reader audit

**Scope**: Core tier (40 components)

**Deliverable**: VPAT 2.5 WCAG Edition

**Funding Sources**:
- Sovereign Tech Agency (€50K+ minimum)
- Corporate sponsorships
- GitHub Sponsors (currently live)

**Action Items**:
- [ ] Prepare audit scope document
- [ ] Identify suitable audit firms
- [ ] Apply for Sovereign Tech Agency grant
- [ ] Reach out to corporate sponsors

---

### 3.3 Adopter Lint Rules

**Status**: NOT STARTED

**Target Package**: `lily-design-system-adopter-lint`

**Rules to Include**:
- Class hook usage validation
- Required props checking
- Deprecated component warnings
- ARIA contract compliance

**Action Items**:
- [ ] Create package structure
- [ ] Implement core lint rules
- [ ] Add tests for lint rules
- [ ] Publish as standalone package

---

## 📊 Screen-Reader Matrix Status

**File**: docs/screen-reader-matrix.md

**Current State**: All 92 cells are EMPTY

**Structure**:
- 37 candidate components
- 6 screen-reader/browser combinations:
  1. NVDA + Firefox
  2. NVDA + Chrome
  3. JAWS + Chrome
  4. VoiceOver + Safari (macOS)
  5. VoiceOver (iOS)
  6. TalkBack + Chrome (Android)

**Immediate Goal**: Fill 10 cells (from audit recommendation)

**Action Items**:
- [ ] Create screen-reader testing guide for contributors
- [ ] Set up testing environment documentation
- [ ] Recruit contributors for testing sessions
- [ ] Create issue template for screen-reader test results

---

## 🎯 Quick Wins (Can be done immediately)

1. ✅ Playwright browsers installed
2. ✅ Pre-push hooks enabled
3. ✅ cspell passing
4. ⚠️ Need to verify CI full run
5. ⚠️ Need to document how contributors can help with screen-reader testing

---

## 📝 Next Steps

### Immediate (This Week)
1. Run full CI and document any failures
2. Create CONTRIBUTING guide for screen-reader testing
3. Set up issue labels for Core tier tracking

### Short-term (Next 2 Weeks)
1. Fill first 10 screen-reader matrix cells
2. Promote first components to Core tier
3. Begin shared behavior core work (menu machine)

### Medium-term (Next Month)
1. Complete Core tier definition (40 components)
2. External audit funding application
3. Shadcn registry publication

---

## 🔗 Related Files

- `docs/audits/mistral/index.md` - Full strategic assessment
- `bin/generate-core` - Core tier generation script
- `bin/ci` - CI gate script
- `docs/screen-reader-matrix.md` - Screen-reader testing matrix
- `docs/core.md` - Core tier documentation (to be generated)
- `spec/competitive-position/core.json` - Core tier data (to be generated)

---

*Lily™ and Lily Design System™ are trademarks.*
