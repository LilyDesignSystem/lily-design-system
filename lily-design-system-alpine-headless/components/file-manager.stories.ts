import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div class=\"file-manager\" role=\"region\" aria-label=\"\">\n  <!-- Consumer provides file listing, folder navigation and actions -->\n</div>";

const meta = {
  title: 'Headless/File Manager',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
