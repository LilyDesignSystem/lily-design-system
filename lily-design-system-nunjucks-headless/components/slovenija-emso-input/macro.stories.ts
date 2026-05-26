import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="slovenija-emso-input"
  type="text"
  autocomplete="off"
  spellcheck="false"
  aria-label="Unique Master Citizen Number">`;

const meta = {
  title: 'Headless/SlovenijaEmsoInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
