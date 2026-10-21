import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"deutschland-krankenversichertennummer-input\"\n  type=\"text\"\n  aria-label=\"Health Insurance Number\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Deutschland Krankenversichertennummer Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
