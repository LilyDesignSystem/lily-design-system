import type { Meta, StoryObj } from '@storybook/react-vite';
import OsterreichSozialversicherungsnummerInput from './OsterreichSozialversicherungsnummerInput';

const meta = {
  title: 'Headless/OsterreichSozialversicherungsnummerInput',
  component: OsterreichSozialversicherungsnummerInput,
  tags: ['autodocs']
} satisfies Meta<typeof OsterreichSozialversicherungsnummerInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'OsterreichSozialversicherungsnummerInput' }
};
