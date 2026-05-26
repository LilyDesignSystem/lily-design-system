import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="cesko-cestovni-pas-view"
  aria-label="Czech Passport"
>sample-value</span>`;

const meta = {
  title: 'Headless/CeskoCestovniPasView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
