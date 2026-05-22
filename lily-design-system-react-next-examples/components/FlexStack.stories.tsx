import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import FlexStack from './FlexStack';

const meta = {
  title: 'Examples/FlexStack',
  component: FlexStack,
  tags: ['autodocs']
} satisfies Meta<typeof FlexStack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
