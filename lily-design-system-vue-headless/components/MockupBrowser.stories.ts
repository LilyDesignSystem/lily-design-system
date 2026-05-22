import type { Meta, StoryObj } from '@storybook/vue3-vite';
import MockupBrowser from './MockupBrowser.vue';

const meta = {
  title: 'Headless/MockupBrowser',
  component: MockupBrowser,
  tags: ['autodocs']
} satisfies Meta<typeof MockupBrowser>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
