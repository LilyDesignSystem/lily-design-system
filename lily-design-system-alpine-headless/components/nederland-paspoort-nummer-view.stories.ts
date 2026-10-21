import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"nederland-paspoort-nummer-view\"\n  aria-label=\"Dutch Passport Number\"\n></span>";

const meta = {
  title: 'Headless/Nederland Paspoort Nummer View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
