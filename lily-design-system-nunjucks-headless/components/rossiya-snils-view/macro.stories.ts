import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="rossiya-snils-view"
  aria-label="СНИЛС (Strakhovoy Nomer Individualnogo Litsevogo Scheta)">sample-value</span>`;

const meta = {
  title: 'Headless/RossiyaSnilsView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
