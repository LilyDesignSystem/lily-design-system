import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="bharat-aadhaar-view"
  aria-label="Aadhaar (आधार)"
>sample-value</span>`;

const meta = {
  title: 'Headless/BharatAadhaarView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
