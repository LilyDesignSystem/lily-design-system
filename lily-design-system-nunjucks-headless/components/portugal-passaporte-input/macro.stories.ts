import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="portugal-passaporte-input"
  type="text"
  autocomplete="off"
  spellcheck="false"
  aria-label="Portuguese Passport">`;

const meta = {
  title: 'Headless/PortugalPassaporteInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
