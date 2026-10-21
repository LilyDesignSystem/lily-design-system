import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div class=\"date-time-now-input\" role=\"group\" aria-label=\"\" x-data=\"lilyDateTimeNow()\">\n  <input class=\"date-time-now-input-date\" type=\"date\" aria-label=\"\" x-model=\"date\">\n  <input class=\"date-time-now-input-time\" type=\"time\" aria-label=\"\" x-model=\"time\">\n  <button class=\"date-time-now-input-now\" aria-label=\"\" x-bind=\"nowButton\"><!-- Consumer provides button text --></button>\n</div>";

const meta = {
  title: 'Headless/Date Time Now Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
