import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="lietuva-pasas-view"
  aria-label="Lithuanian Passport">sample-value</span>`;

const meta = {
  title: 'Headless/LietuvaPasasView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
