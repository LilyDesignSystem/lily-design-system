import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="lietuva-asmens-kodas-view"
  aria-label="Personal Code"
>sample-value</span>`;

const meta = {
  title: 'Headless/LietuvaAsmensKodasView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
