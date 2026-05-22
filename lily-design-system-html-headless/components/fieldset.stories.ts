import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<fieldset
  class="fieldset"
  aria-label=""
>
  <legend class="fieldset-legend"><!-- Consumer provides legend text --></legend>
  <!-- Consumer provides form fields -->
</fieldset>`;

const meta = {
  title: 'Headless/Fieldset',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
