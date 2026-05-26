import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="latvija-personas-kods-input"
  type="text"
  autocomplete="off"
  spellcheck="false"
  aria-label="Personal Code">`;

const meta = {
  title: 'Headless/LatvijaPersonasKodsInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
