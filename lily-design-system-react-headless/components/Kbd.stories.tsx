import type { Meta, StoryObj } from '@storybook/react-vite';
import Kbd from './Kbd';

const meta = {
  title: 'Headless/Kbd',
  component: Kbd,
  tags: ['autodocs']
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
