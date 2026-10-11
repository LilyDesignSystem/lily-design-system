import type { Meta, StoryObj } from '@storybook/vue3-vite';
import OsterreichSozialversicherungsnummerInput from './OsterreichSozialversicherungsnummerInput.vue';

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
