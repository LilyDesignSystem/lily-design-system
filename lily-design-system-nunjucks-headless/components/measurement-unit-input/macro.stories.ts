import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<select
  class="measurement-unit-input"></select>`;

const meta = {
  title: 'Headless/MeasurementUnitInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
