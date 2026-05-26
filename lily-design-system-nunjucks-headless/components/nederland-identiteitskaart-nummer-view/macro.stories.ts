import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="nederland-identiteitskaart-nummer-view"
  aria-label="Dutch National Identity Card Number">sample-value</span>`;

const meta = {
  title: 'Headless/NederlandIdentiteitskaartNummerView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
