import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div class=\"coachmark\" role=\"dialog\" aria-modal=\"false\" aria-labelledby=\"coachmark-title-1\" aria-describedby=\"coachmark-desc-1\" x-data=\"lilyCoachmark(true)\" x-bind=\"root\">\n  <h2 class=\"coachmark-title\" id=\"coachmark-title-1\"><!-- Consumer provides title --></h2>\n  <p class=\"coachmark-description\" id=\"coachmark-desc-1\"><!-- Consumer provides description --></p>\n  <button class=\"coachmark-dismiss\" aria-label=\"\" x-bind=\"dismissButton\">×</button>\n</div>";

const meta = {
  title: 'Headless/Coachmark',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
