import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="bulgaria-edinen-grazhdanski-nomer-input"
  type="text"
  aria-label="Uniform Civil Number"
  autocomplete="off"
>`;

const meta = {
  title: 'Headless/BulgariaEdinenGrazhdanskiNomerInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
