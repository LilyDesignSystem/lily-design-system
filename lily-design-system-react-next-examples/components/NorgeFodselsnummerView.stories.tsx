import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import NorgeFodselsnummerView from './NorgeFodselsnummerView';

const meta = {
  title: 'Examples/NorgeFodselsnummerView',
  component: NorgeFodselsnummerView,
  tags: ['autodocs']
} satisfies Meta<typeof NorgeFodselsnummerView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'NorgeFodselsnummerView' }
};
