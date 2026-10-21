import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"tuaisceart-eireann-health-and-care-number-view\"\n  aria-label=\"H&amp;C Number\"\n></span>";

const meta = {
  title: 'Headless/Tuaisceart Eireann Health And Care Number View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
