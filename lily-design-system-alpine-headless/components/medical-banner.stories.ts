import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div class=\"medical-banner\" role=\"region\" aria-live=\"polite\" aria-label=\"\" data-type=\"info\" data-context=\"medical\"\n     x-data=\"lilyDismissible(true)\" x-bind=\"root\">\n  <!-- Consumer provides content -->\n  <button data-dismiss x-bind=\"dismiss\" aria-label=\"\"><!-- Consumer provides label --></button>\n</div>";

const meta = {
  title: 'Headless/Medical Banner',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
