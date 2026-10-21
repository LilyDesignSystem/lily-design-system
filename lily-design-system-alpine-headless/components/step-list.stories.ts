import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- StepList component -->\n<!--\n  Description: an ordered list of step items showing progress through a multi-step process\n\n  HTML tag: <ol>\n  CSS class: step-list\n  Keyboard: None directly (each step item, if interactive, manages its own focus)\n  Accessibility:\n    - <ol> already provides list semantics — a child step is announced as\n      \"1 of N\", \"2 of N\", etc. by screen readers.\n    - aria-label is optional — when present, gives the list an accessible name\n      such as \"Checkout steps\" or \"Onboarding progress\".\n    - data-current is an optional 0-based index hook for consumer styling.\n\n  Behavior:\n    Renders an <ol class=\"step-list\"> with consumer-supplied <li class=\"step-list-item\">\n    children. Purely passive: no script.\n\n  Usage:\n    <ol class=\"step-list\" aria-label=\"Checkout\" data-current=\"1\">\n      <li class=\"step-list-item\" data-status=\"finished\">…</li>\n      <li class=\"step-list-item\" data-status=\"in-progress\" aria-current=\"step\">…</li>\n      <li class=\"step-list-item\" data-status=\"waiting\">…</li>\n    </ol>\n-->\n\n<ol\n  class=\"step-list\"\n  aria-label=\"\"\n  data-current=\"\"\n>\n  <!-- Consumer provides one or more <li class=\"step-list-item\"> children -->\n</ol>";

const meta = {
  title: 'Headless/Step List',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
