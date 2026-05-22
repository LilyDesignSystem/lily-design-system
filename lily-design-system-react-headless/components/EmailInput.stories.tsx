import type { Meta, StoryObj } from '@storybook/react-vite';
import EmailInput from './EmailInput';

const meta = {
  title: 'Headless/EmailInput',
  component: EmailInput,
  tags: ['autodocs']
} satisfies Meta<typeof EmailInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
