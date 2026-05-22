import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<ul
  class="listbox"
  role="listbox" aria-label="Listbox"></ul>`;

const meta = {
  title: 'Headless/Listbox',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
