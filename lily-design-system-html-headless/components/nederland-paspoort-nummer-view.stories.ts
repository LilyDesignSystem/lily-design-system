import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="nederland-paspoort-nummer-view"
  aria-label="Dutch Passport Number"
>sample-value</span>`;

const meta = {
  title: 'Headless/NederlandPaspoortNummerView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
