import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="eire-individual-health-identifier-view"></span>`;

const meta = {
  title: 'Headless/EireIndividualHealthIdentifierView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
