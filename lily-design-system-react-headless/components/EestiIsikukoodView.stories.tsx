import type { Meta, StoryObj } from '@storybook/react-vite';
import EestiIsikukoodView from './EestiIsikukoodView';

const meta = {
  title: 'Headless/EestiIsikukoodView',
  component: EestiIsikukoodView,
  tags: ['autodocs']
} satisfies Meta<typeof EestiIsikukoodView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'EestiIsikukoodView' }
};
