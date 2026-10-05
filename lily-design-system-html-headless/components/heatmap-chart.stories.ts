import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<figure
  class="heatmap-chart"
  role="img"
  aria-label="Example"
  aria-describedby="heatmap-chart-desc"
>
  <!-- Consumer provides the inline svg; no drawing happens in this component. -->
  <svg data-testid="art" viewBox="0 0 10 10"><circle r="4" cx="5" cy="5"></circle></svg>
</figure>
<!-- Text description or real <table> carrying the same data, referenced by aria-describedby -->
<p id="heatmap-chart-desc">Example description</p>`;

const meta = {
  title: 'Headless/HeatmapChart',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
