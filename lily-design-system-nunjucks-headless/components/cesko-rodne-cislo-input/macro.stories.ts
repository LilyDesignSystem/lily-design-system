import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="cesko-rodne-cislo-input"
  type="text"
  autocomplete="off"
  spellcheck="false"
  aria-label="Czech Personal Number">`;

const meta = {
  title: 'Headless/CeskoRodneCisloInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
