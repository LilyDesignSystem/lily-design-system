import type { Meta, StoryObj } from '@storybook/react-vite';
import IndonesiaNomorIndukKependudukanView from './IndonesiaNomorIndukKependudukanView';

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
