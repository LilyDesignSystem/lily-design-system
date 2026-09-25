import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="bharat-aadhaar-input"
  type="text"
  autocomplete="off"
  spellcheck="false"
  aria-label="India's Aadhaar (आधार)">`;

const meta = {
  title: 'Headless/BharatAadhaarInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
