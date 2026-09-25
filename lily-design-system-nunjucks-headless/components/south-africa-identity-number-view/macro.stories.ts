import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="south-africa-identity-number-view"
  aria-label="South Africa's Identity Number">Sample value</span>`;

const meta = {
  title: 'Headless/SouthAfricaIdentityNumberView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
