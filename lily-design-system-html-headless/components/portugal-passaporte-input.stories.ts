import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="portugal-passaporte-input"
  type="text"
  aria-label="Portuguese Passport"
  autocomplete="off"
>`;

const meta = {
  title: 'Headless/PortugalPassaporteInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
