import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- StepListItem component -->\n<!--\n  Description: one step in a step list with status of waiting, in progress, finished, or error\n\n  HTML tag: <li>\n  CSS class: step-list-item\n  Keyboard: None directly (consumer-supplied child controls manage focus)\n  Accessibility:\n    - aria-current=\"step\" indicates this is the user's current step\n      (per the WAI-ARIA spec for steppers / multi-step progress).\n    - data-status exposes the discrete step state to consumer CSS:\n        \"waiting\" | \"in-progress\" | \"finished\" | \"error\"\n    - aria-label is optional — overrides the default accessible name from the\n      contained title text.\n\n  Behavior:\n    Renders an <li class=\"step-list-item\" data-status=\"…\">. Purely passive: no script.\n\n  Usage:\n    <li class=\"step-list-item\" data-status=\"in-progress\" aria-current=\"step\" aria-label=\"Step 2: Shipping\">\n      <strong>Shipping</strong>\n      <span>Enter your address</span>\n    </li>\n-->\n\n<li\n  class=\"step-list-item\"\n  data-status=\"waiting\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides the step content (typically title and description) -->\n</li>";

const meta = {
  title: 'Headless/Step List Item',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
