import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import InputGroup from './InputGroup';

const meta = {
  title: 'Examples/InputGroup',
  component: InputGroup,
  tags: ['autodocs']
} satisfies Meta<typeof InputGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
