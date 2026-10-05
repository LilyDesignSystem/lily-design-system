import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<figure
  class="radar-chart"
  role="img"
  aria-label="Example"
  aria-describedby="radar-chart-desc"
>
  <!-- Consumer provides the inline svg; no drawing happens in this component. -->
  <svg data-testid="art" viewBox="0 0 10 10"><circle r="4" cx="5" cy="5"></circle></svg>
</figure>
<!-- Text description or real <table> carrying the same data, referenced by aria-describedby -->
<p id="radar-chart-desc">Example description</p>`;

const meta = {
  title: 'Headless/RadarChart',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
