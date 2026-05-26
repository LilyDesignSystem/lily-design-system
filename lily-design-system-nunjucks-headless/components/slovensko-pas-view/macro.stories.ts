import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="slovensko-pas-view"
  aria-label="Slovak Passport">sample-value</span>`;

const meta = {
  title: 'Headless/SlovenskoPasView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
