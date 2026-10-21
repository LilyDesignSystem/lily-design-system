import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div class=\"calendar-range-picker\" role=\"application\" aria-label=\"\">\n  <!-- Consumer provides the calendar grid, date selection and range highlighting -->\n</div>";

const meta = {
  title: 'Headless/Calendar Range Picker',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
