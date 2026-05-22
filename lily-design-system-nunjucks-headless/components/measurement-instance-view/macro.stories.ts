import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="measurement-instance-view">
  <span class="measurement-instance-view-value"></span>&nbsp;<abbr class="measurement-instance-view-unit"></abbr>
</span>`;

const meta = {
  title: 'Headless/MeasurementInstanceView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
