import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="sheet"
  role="dialog" aria-modal="true"
  aria-label="Sheet" hidden></div>`;

const meta = {
  title: 'Headless/Sheet',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
