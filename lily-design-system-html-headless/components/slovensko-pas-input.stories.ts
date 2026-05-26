import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="slovensko-pas-input"
  type="text"
  aria-label="Slovak Passport"
  autocomplete="off"
>`;

const meta = {
  title: 'Headless/SlovenskoPasInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
