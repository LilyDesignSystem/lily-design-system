import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import DanmarkPersonnummerView from './DanmarkPersonnummerView';

const meta = {
  title: 'Examples/DanmarkPersonnummerView',
  component: DanmarkPersonnummerView,
  tags: ['autodocs']
} satisfies Meta<typeof DanmarkPersonnummerView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'DanmarkPersonnummerView' }
};
