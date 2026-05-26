import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="polska-pesel-view"
  aria-label="PESEL">sample-value</span>`;

const meta = {
  title: 'Headless/PolskaPeselView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
