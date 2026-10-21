import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- ValidationList component -->\n<!--\n  Description: a live-feedback list of input validation rules with pending, passed, and failed states\n\n  HTML tag: <ul>\n  CSS class: validation-list\n  Keyboard: None (passive list)\n  Accessibility:\n    - aria-label is required and typically describes the field being validated\n    - aria-live=\"polite\" makes status changes on child items announced by screen readers\n\n  Usage:\n    <ul class=\"validation-list\" aria-label=\"Password requirements\" aria-live=\"polite\">\n      <li class=\"validation-list-item\" data-status=\"pending\">At least 8 characters</li>\n      <li class=\"validation-list-item\" data-status=\"passed\">Contains a number</li>\n      <li class=\"validation-list-item\" data-status=\"failed\">Contains a symbol</li>\n    </ul>\n-->\n\n<ul\n  class=\"validation-list\"\n  aria-label=\"\"\n  aria-live=\"polite\"\n>\n  <!-- Consumer provides <li class=\"validation-list-item\"> children -->\n</ul>";

const meta = {
  title: 'Headless/Validation List',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
