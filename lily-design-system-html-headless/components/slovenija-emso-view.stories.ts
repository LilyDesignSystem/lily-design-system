import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="slovenija-emso-view"
  aria-label="Unique Master Citizen Number"
>sample-value</span>`;

const meta = {
  title: 'Headless/SlovenijaEmsoView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
