import type { Meta, StoryObj } from '@storybook/react-vite';
import RadioInput from './RadioInput';

const meta = {
  title: 'Headless/RadioInput',
  component: RadioInput,
  tags: ['autodocs']
} satisfies Meta<typeof RadioInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
