import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<form\n  class=\"form\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides form fields -->\n</form>";

const meta = {
  title: 'Headless/Form',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
