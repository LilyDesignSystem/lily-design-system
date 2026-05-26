import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="nederland-identiteitskaart-nummer-input"
  type="text"
  autocomplete="off"
  spellcheck="false"
  aria-label="Dutch National Identity Card Number">`;

const meta = {
  title: 'Headless/NederlandIdentiteitskaartNummerInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
