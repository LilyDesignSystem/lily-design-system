import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="romania-pasaport-input"
  type="text"
  autocomplete="off"
  spellcheck="false"
  aria-label="Romanian Passport">`;

const meta = {
  title: 'Headless/RomaniaPasaportInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
