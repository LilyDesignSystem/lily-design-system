import type { Meta, StoryObj } from '@storybook/react-vite';
import NorgeFodselsnummerInput from './NorgeFodselsnummerInput';

const meta = {
  title: 'Headless/NorgeFodselsnummerInput',
  component: NorgeFodselsnummerInput,
  tags: ['autodocs']
} satisfies Meta<typeof NorgeFodselsnummerInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'NorgeFodselsnummerInput' }
};
