import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="bulgaria-edinen-grazhdanski-nomer-view"
  aria-label="Uniform Civil Number">sample-value</span>`;

const meta = {
  title: 'Headless/BulgariaEdinenGrazhdanskiNomerView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
