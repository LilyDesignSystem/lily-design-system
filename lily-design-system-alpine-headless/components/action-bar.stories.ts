import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- ActionBar component -->\n<!--\n  Description: a contextual action bar that appears when items are selected,\n               showing the selection count and bulk action buttons\n\n  HTML tag: <div> with role=\"toolbar\"\n  CSS class: action-bar\n  Keyboard: Tab to focus the contained action buttons, Enter or Space to activate\n  Accessibility: role=\"toolbar\" with required aria-label; the count is announced\n                 via a visible span and the optional clear button has an aria-label.\n\n  Usage:\n    <div class=\"action-bar\" role=\"toolbar\" aria-label=\"Bulk actions\" data-selected-count=\"3\">\n      <span class=\"action-bar-count\">3 selected</span>\n      … consumer inserts action-bar-button children here …\n      <button class=\"action-bar-clear\" type=\"button\" aria-label=\"Clear selection\">×</button>\n    </div>\n-->\n\n<div\n  class=\"action-bar\"\n  role=\"toolbar\"\n  aria-label=\"\"\n  data-selected-count=\"0\"\n>\n  <span class=\"action-bar-count\"></span>\n  <!-- Consumer inserts action-bar-button children here -->\n  <button class=\"action-bar-clear\" type=\"button\" aria-label=\"\">×</button>\n</div>";

const meta = {
  title: 'Headless/Action Bar',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
