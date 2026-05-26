import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="latvija-personas-kods-input"
  type="text"
  aria-label="Personal Code"
  autocomplete="off"
>`;

const meta = {
  title: 'Headless/LatvijaPersonasKodsInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
