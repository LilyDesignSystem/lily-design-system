import type { Meta, StoryObj } from '@storybook/react-vite';
import NorgeFodselsnummerView from './NorgeFodselsnummerView';

const meta = {
  title: 'Headless/NorgeFodselsnummerView',
  component: NorgeFodselsnummerView,
  tags: ['autodocs']
} satisfies Meta<typeof NorgeFodselsnummerView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'NorgeFodselsnummerView' }
};
