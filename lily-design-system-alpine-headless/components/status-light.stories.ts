import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- StatusLight component -->\n<!--\n  Description: a small colored dot status indicator paired with a status label\n\n  HTML tag: <span>\n  CSS class: status-light\n  Keyboard: None (passive element)\n  Accessibility: role=\"status\" announces dynamic updates; the dot is\n                 aria-hidden=\"true\" because it conveys no extra information\n                 beyond the label text. The variant is exposed via data-variant\n                 so consumers can style without changing semantics.\n\n  Usage:\n    <span class=\"status-light\" data-variant=\"positive\" role=\"status\">\n      <span class=\"status-light-dot\" aria-hidden=\"true\"></span>\n      <span class=\"status-light-label\">Active</span>\n    </span>\n-->\n\n<span\n  class=\"status-light\"\n  data-variant=\"neutral\"\n  role=\"status\"\n>\n  <span class=\"status-light-dot\" aria-hidden=\"true\"></span>\n  <span class=\"status-light-label\"></span>\n</span>";

const meta = {
  title: 'Headless/Status Light',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
