import type { Meta, StoryObj } from '@storybook/react-vite';
import IndonesiaNomorIndukKependudukanInput from './IndonesiaNomorIndukKependudukanInput';

const meta = {
  title: 'Headless/IndonesiaNomorIndukKependudukanInput',
  component: IndonesiaNomorIndukKependudukanInput,
  tags: ['autodocs']
} satisfies Meta<typeof IndonesiaNomorIndukKependudukanInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'IndonesiaNomorIndukKependudukanInput' }
};
