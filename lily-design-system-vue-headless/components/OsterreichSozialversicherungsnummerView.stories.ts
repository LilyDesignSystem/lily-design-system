import type { Meta, StoryObj } from '@storybook/vue3-vite';
import OsterreichSozialversicherungsnummerView from './OsterreichSozialversicherungsnummerView.vue';

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
