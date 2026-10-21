import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- TuaisceartEireannHealthAndCareNumberView component -->\n<!--\n  Description: a read-only display of Tuaisceart Eireann H&C Number\n  HTML tag: <span>\n  CSS class: tuaisceart-eireann-health-and-care-number-view\n  Usage:\n    <span class=\"tuaisceart-eireann-health-and-care-number-view\" aria-label=\"H&C Number\">320 000 0001</span>\n-->\n\n<span\n  class=\"tuaisceart-eireann-health-and-care-number-view\"\n  aria-label=\"H&amp;C Number\"\n></span>";

const meta = {
  title: 'Headless/Tuaisceart Eireann Health And Care Number View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
