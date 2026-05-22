import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="ireland-individual-health-identifier-view"></span>`;

const meta = {
  title: 'Headless/IrelandIndividualHealthIdentifierView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
