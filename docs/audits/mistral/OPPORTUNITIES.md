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

**Status**: BLOCKED (waiting on screen-reader matrix)

**Current State**:
```
bin/generate-core --check
# Output: generate-core: 40 candidates; (a) 40, (b) 40, (c) 0; Core 0
```

**Core Criteria** (all 3 must pass):
- (a) ✅ Keyboard and ARIA-state tests in all 8 libraries (40/40 passing)
- (b) ✅ E2E in Chromium, Firefox, and WebKit (40/40 passing)
- (c) ❌ Screen-reader matrix filled for all 6 combinations (0/40 passing)

**Blocker**: Screen-reader matrix (docs/screen-reader-matrix.md) is completely empty

**Action Items**:
- [ ] Fill at least 10 screen-reader matrix cells (immediate goal from audit)
- [ ] Run `bin/generate-core` to promote components to Core
- [ ] Verify Core tier population

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

**Status**: NOT STARTED

**Current State**: 
- `shared/listbox-machine.ts` exists
- Architecture: one state machine + thin framework adapters

**Target Components for Shared Machines**:
- menu
- combobox
- tabs
- disclosure
- dialog-focus
- roving-tabindex

**Action Items**:
- [ ] Extend listbox-machine pattern to menu
- [ ] Extend to combobox
- [ ] Extend to tabs
- [ ] Create single test suite for each machine
- [ ] Create framework adapters for all 8 frameworks

**Benefits**:
- 8× code reduction for behavior logic
- Single test suite for behavior
- Consistency across frameworks
- Easier to maintain and audit

---

### 2.3 Automate Theme Reference Tracking

**Status**: NOT STARTED

**Current State**:
- `bin/check-theme-references` exists
- Need to integrate into CI

**Action Items**:
- [ ] Run `bin/check-theme-references` regularly
- [ ] Add to `bin/test` and CI
- [ ] Create `themes/references.tsv` with upstream versions
- [ ] Set up automated drift detection

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
