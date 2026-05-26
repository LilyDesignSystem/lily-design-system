import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="suomi-henkilotunnus-input"
  type="text"
  aria-label="Personal Identity Code"
  autocomplete="off"
>`;

const meta = {
  title: 'Headless/SuomiHenkilotunnusInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
