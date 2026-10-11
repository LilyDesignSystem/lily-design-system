import type { Meta, StoryObj } from '@storybook/react-vite';
import Separator from './Separator';

const meta = {
  title: 'Headless/Separator',
  component: Separator,
  tags: ['autodocs']
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
