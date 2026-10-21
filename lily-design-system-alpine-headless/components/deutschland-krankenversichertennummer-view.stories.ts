import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"deutschland-krankenversichertennummer-view\"\n  aria-label=\"Health Insurance Number\"\n></span>";

const meta = {
  title: 'Headless/Deutschland Krankenversichertennummer View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
