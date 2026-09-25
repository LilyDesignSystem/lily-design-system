import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="south-africa-identity-number-input"
  type="text"
  autocomplete="off"
  spellcheck="false"
  aria-label="South Africa's Identity Number">`;

const meta = {
  title: 'Headless/SouthAfricaIdentityNumberInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
