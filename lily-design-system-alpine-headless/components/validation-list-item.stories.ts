import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- ValidationListItem component -->\n<!--\n  Description: one validation rule in a validation list with a status of pending, passed, or failed\n\n  HTML tag: <li>\n  CSS class: validation-list-item\n  Keyboard: None (passive list item)\n  Accessibility:\n    - data-status conveys the current validation state (\"pending\" | \"passed\" | \"failed\") for consumer styling\n    - aria-label is optional and overrides the computed accessible name\n    - When inside a <ul class=\"validation-list\" aria-live=\"polite\">, status changes are announced\n\n  Usage:\n    <li class=\"validation-list-item\" data-status=\"pending\" aria-label=\"\">\n      At least 8 characters\n    </li>\n-->\n\n<li\n  class=\"validation-list-item\"\n  data-status=\"pending\"\n  aria-label=\"\"\n>\n  <!-- Consumer-provided rule text (e.g. \"At least 8 characters\") -->\n</li>";

const meta = {
  title: 'Headless/Validation List Item',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
