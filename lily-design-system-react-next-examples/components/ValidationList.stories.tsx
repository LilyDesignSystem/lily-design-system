import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ValidationList from './ValidationList';

const meta = {
  title: 'Examples/ValidationList',
  component: ValidationList,
  tags: ['autodocs']
} satisfies Meta<typeof ValidationList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
