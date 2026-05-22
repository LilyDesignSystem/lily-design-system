import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ButtonGroup from './ButtonGroup';

const meta = {
  title: 'Examples/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs']
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
