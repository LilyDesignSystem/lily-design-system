import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<fieldset\n  class=\"checkbox-group\"\n  role=\"group\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</fieldset>";

const meta = {
  title: 'Headless/Checkbox Group',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
