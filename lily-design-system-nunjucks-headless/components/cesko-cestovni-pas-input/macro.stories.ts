import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="cesko-cestovni-pas-input"
  type="text"
  autocomplete="off"
  spellcheck="false"
  aria-label="Czech Passport">`;

const meta = {
  title: 'Headless/CeskoCestovniPasInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
