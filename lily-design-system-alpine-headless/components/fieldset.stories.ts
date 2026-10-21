import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<fieldset\n  class=\"fieldset\"\n  aria-label=\"\"\n>\n  <legend class=\"fieldset-legend\"><!-- Consumer provides legend text --></legend>\n  <!-- Consumer provides form fields -->\n</fieldset>";

const meta = {
  title: 'Headless/Fieldset',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
