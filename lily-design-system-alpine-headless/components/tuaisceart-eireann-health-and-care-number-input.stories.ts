import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"tuaisceart-eireann-health-and-care-number-input\"\n  type=\"text\"\n  aria-label=\"\"\n  inputmode=\"numeric\"\n  pattern=\"[0-9]{3} [0-9]{3} [0-9]{4}\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Tuaisceart Eireann Health And Care Number Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
