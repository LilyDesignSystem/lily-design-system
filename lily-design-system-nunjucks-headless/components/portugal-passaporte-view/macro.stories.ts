import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="portugal-passaporte-view"
  aria-label="Portuguese Passport">sample-value</span>`;

const meta = {
  title: 'Headless/PortugalPassaporteView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
