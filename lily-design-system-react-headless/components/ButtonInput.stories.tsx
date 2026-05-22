import type { Meta, StoryObj } from '@storybook/react-vite';
import ButtonInput from './ButtonInput';

const meta = {
  title: 'Headless/ButtonInput',
  component: ButtonInput,
  tags: ['autodocs']
} satisfies Meta<typeof ButtonInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
