import type { Meta, StoryObj } from '@storybook/react-vite';
import Editable from './Editable';

const meta = {
  title: 'Headless/Editable',
  component: Editable,
  tags: ['autodocs']
} satisfies Meta<typeof Editable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
