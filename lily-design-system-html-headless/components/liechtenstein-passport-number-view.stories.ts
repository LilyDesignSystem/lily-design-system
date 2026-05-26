import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="liechtenstein-passport-number-view"
  aria-label="Liechtenstein Passport Number"
>sample-value</span>`;

const meta = {
  title: 'Headless/LiechtensteinPassportNumberView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
