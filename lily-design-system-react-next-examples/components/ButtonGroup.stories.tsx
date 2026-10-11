import type { Meta, StoryObj } from '@storybook/react-vite';
import ButtonGroup from './ButtonGroup';

const meta = {
  title: 'Headless/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs']
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
