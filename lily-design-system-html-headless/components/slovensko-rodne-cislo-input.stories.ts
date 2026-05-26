import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="slovensko-rodne-cislo-input"
  type="text"
  aria-label="Slovak Personal Number"
  autocomplete="off"
>`;

const meta = {
  title: 'Headless/SlovenskoRodneCisloInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
