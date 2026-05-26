import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="suomi-henkilotunnus-view"
  aria-label="Personal Identity Code"
>sample-value</span>`;

const meta = {
  title: 'Headless/SuomiHenkilotunnusView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
