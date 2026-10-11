import type { Meta, StoryObj } from '@storybook/react-vite';
import InputGroup from './InputGroup';

const meta = {
  title: 'Headless/InputGroup',
  component: InputGroup,
  tags: ['autodocs']
} satisfies Meta<typeof InputGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
