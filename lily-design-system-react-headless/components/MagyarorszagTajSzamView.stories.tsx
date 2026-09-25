import type { Meta, StoryObj } from '@storybook/react-vite';
import MagyarorszagTajSzamView from './MagyarorszagTajSzamView';

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
