import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="polska-pesel-input"
  type="text"
  aria-label="PESEL"
  autocomplete="off"
>`;

const meta = {
  title: 'Headless/PolskaPeselInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
