import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="information-callout"
  role="note"></div>`;

const meta = {
  title: 'Headless/InformationCallout',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
