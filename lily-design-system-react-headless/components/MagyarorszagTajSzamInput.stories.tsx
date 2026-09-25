import type { Meta, StoryObj } from '@storybook/react-vite';
import MagyarorszagTajSzamInput from './MagyarorszagTajSzamInput';

const meta = {
  title: 'Headless/MagyarorszagTajSzamInput',
  component: MagyarorszagTajSzamInput,
  tags: ['autodocs']
} satisfies Meta<typeof MagyarorszagTajSzamInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'MagyarorszagTajSzamInput' }
};
