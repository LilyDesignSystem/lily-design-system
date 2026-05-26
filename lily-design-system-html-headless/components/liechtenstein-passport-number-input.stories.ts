import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="liechtenstein-passport-number-input"
  type="text"
  aria-label="Liechtenstein Passport Number"
  autocomplete="off"
>`;

const meta = {
  title: 'Headless/LiechtensteinPassportNumberInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
