import type { Meta, StoryObj } from '@storybook/vue3-vite';
import IndonesiaNomorIndukKependudukanView from './IndonesiaNomorIndukKependudukanView.vue';

const meta = {
  title: 'Headless/IndonesiaNomorIndukKependudukanView',
  component: IndonesiaNomorIndukKependudukanView,
  tags: ['autodocs']
} satisfies Meta<typeof IndonesiaNomorIndukKependudukanView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'IndonesiaNomorIndukKependudukanView' }
};
