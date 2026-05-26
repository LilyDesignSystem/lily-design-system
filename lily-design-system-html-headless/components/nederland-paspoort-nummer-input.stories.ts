import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="nederland-paspoort-nummer-input"
  type="text"
  aria-label="Dutch Passport Number"
  autocomplete="off"
>`;

const meta = {
  title: 'Headless/NederlandPaspoortNummerInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
