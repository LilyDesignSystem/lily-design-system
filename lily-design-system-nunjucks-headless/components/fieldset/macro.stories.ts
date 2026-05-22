import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<fieldset
  class="fieldset">
  <legend class="fieldset-legend"></legend></fieldset>`;

const meta = {
  title: 'Headless/Fieldset',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
