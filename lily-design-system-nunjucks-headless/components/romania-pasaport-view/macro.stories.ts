import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="romania-pasaport-view"
  aria-label="Romanian Passport">sample-value</span>`;

const meta = {
  title: 'Headless/RomaniaPasaportView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
