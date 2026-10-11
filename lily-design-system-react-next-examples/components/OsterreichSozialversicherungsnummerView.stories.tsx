import type { Meta, StoryObj } from '@storybook/react-vite';
import OsterreichSozialversicherungsnummerView from './OsterreichSozialversicherungsnummerView';

const meta = {
  title: 'Headless/OsterreichSozialversicherungsnummerView',
  component: OsterreichSozialversicherungsnummerView,
  tags: ['autodocs']
} satisfies Meta<typeof OsterreichSozialversicherungsnummerView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'OsterreichSozialversicherungsnummerView' }
};
