import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="eesti-isikukood-input"
  type="text"
  aria-label="Personal Identification Code"
  autocomplete="off"
>`;

const meta = {
  title: 'Headless/EestiIsikukoodInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
