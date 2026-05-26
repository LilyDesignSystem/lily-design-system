import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="latvija-personas-kods-view"
  aria-label="Personal Code"
>sample-value</span>`;

const meta = {
  title: 'Headless/LatvijaPersonasKodsView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
