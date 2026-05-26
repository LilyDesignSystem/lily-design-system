import type { Meta, StoryObj } from '@storybook/vue3-vite';
import NederlandPaspoortNummerInput from './NederlandPaspoortNummerInput.vue';

const meta = {
  title: 'Headless/NederlandPaspoortNummerInput',
  component: NederlandPaspoortNummerInput,
  tags: ['autodocs']
} satisfies Meta<typeof NederlandPaspoortNummerInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'NederlandPaspoortNummerInput' }
};
