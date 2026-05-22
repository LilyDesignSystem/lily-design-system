import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<select
  class="measurement-system-input"></select>`;

const meta = {
  title: 'Headless/MeasurementSystemInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
