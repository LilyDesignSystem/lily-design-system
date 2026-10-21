import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"status-light\"\n  data-variant=\"neutral\"\n  role=\"status\"\n>\n  <span class=\"status-light-dot\" aria-hidden=\"true\"></span>\n  <span class=\"status-light-label\"></span>\n</span>";

const meta = {
  title: 'Headless/Status Light',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
