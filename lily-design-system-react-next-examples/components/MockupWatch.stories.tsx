import type { Meta, StoryObj } from '@storybook/react-vite';
import MockupWatch from './MockupWatch';

const meta = {
  title: 'Headless/MockupWatch',
  component: MockupWatch,
  tags: ['autodocs']
} satisfies Meta<typeof MockupWatch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
