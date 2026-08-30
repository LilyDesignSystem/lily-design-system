import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import EestiIsikukoodView from './EestiIsikukoodView';

const meta = {
  title: 'Examples/EestiIsikukoodView',
  component: EestiIsikukoodView,
  tags: ['autodocs']
} satisfies Meta<typeof EestiIsikukoodView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'EestiIsikukoodView' }
};
