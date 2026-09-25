import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="schweiz-ahv-nummer-view"
  aria-label="AHV-Nummer / Numéro AVS"
>sample-value</span>`;

const meta = {
  title: 'Headless/SchweizAhvNummerView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
