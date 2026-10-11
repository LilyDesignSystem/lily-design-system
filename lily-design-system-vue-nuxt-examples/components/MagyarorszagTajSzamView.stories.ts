import type { Meta, StoryObj } from '@storybook/vue3-vite';
import MagyarorszagTajSzamView from './MagyarorszagTajSzamView.vue';

const meta = {
  title: 'Headless/MagyarorszagTajSzamView',
  component: MagyarorszagTajSzamView,
  tags: ['autodocs']
} satisfies Meta<typeof MagyarorszagTajSzamView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'MagyarorszagTajSzamView' }
};
