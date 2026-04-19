# TabBar

A tab bar is a container for tab buttons using the ARIA tablist role. It provides ArrowLeft/ArrowRight keyboard navigation between tabs with Home/End keys to jump to first/last tabs, implementing the roving focus pattern. Each tab button controls a corresponding tabpanel.

Compound component: use with TabBarButton.

## Props

- `label`: string (required) -- accessible name applied via `aria-label`
- `children`: ReactNode (required) -- TabBarButton elements
- `...restProps`: unknown -- additional attributes spread onto the `<div>`

## Usage

```tsx
const [activeTab, setActiveTab] = useState("general");

<TabBar label="Settings">
  <TabBarButton selected={activeTab === "general"} controls="panel-general"
    onClick={() => setActiveTab("general")}>General</TabBarButton>
  <TabBarButton selected={activeTab === "advanced"} controls="panel-advanced"
    onClick={() => setActiveTab("advanced")}>Advanced</TabBarButton>
</TabBar>
{activeTab === "general" && <div id="panel-general">General settings</div>}
{activeTab === "advanced" && <div id="panel-advanced">Advanced settings</div>}
```

## Keyboard Interactions

- ArrowRight: Move focus to next tab (wraps to first)
- ArrowLeft: Move focus to previous tab (wraps to last)
- Home: Move focus to first tab
- End: Move focus to last tab

## ARIA

- `role="tablist"` -- identifies the container as a tab list widget
- `aria-label` -- provides the accessible name for the tab bar

## References

- WAI-ARIA Tabs Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
