import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<abbr
  class="measurement-unit-view"></abbr>`;

const meta = {
  title: 'Headless/MeasurementUnitView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
