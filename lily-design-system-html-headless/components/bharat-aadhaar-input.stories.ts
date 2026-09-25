import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="bharat-aadhaar-input"
  type="text"
  aria-label="Aadhaar (आधार)"
  autocomplete="off"
>`;

const meta = {
  title: 'Headless/BharatAadhaarInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
