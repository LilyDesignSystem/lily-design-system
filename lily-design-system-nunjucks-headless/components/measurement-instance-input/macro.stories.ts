import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="measurement-instance-input">
  <input
    type="number"
    class="measurement-instance-input-value"    value=""  >
  <select
    class="measurement-instance-input-unit"  >  </select>
</div>`;

const meta = {
  title: 'Headless/MeasurementInstanceInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
