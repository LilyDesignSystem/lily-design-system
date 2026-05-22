import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Container from './Container';

const meta = {
  title: 'Examples/Container',
  component: Container,
  tags: ['autodocs']
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
