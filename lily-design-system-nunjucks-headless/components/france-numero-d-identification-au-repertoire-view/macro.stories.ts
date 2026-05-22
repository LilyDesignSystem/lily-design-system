import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="france-numero-d-identification-au-repertoire-view"></span>`;

const meta = {
  title: 'Headless/FranceNumeroDIdentificationAuRepertoireView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
