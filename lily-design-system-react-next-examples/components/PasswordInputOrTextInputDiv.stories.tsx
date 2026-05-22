import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import PasswordInputOrTextInputDiv from './PasswordInputOrTextInputDiv';

const meta = {
  title: 'Examples/PasswordInputOrTextInputDiv',
  component: PasswordInputOrTextInputDiv,
  tags: ['autodocs']
} satisfies Meta<typeof PasswordInputOrTextInputDiv>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
