import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div\n  class=\"action-bar\"\n  role=\"toolbar\"\n  aria-label=\"\"\n  data-selected-count=\"0\"\n>\n  <span class=\"action-bar-count\"></span>\n  <!-- Consumer inserts action-bar-button children here -->\n  <button class=\"action-bar-clear\" type=\"button\" aria-label=\"\">×</button>\n</div>";

const meta = {
  title: 'Headless/Action Bar',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
