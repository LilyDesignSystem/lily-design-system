import type { Meta, StoryObj } from '@storybook/vue3-vite';
import FileUpload from './FileUpload.vue';

const meta = {
  title: 'Headless/FileUpload',
  component: FileUpload,
  tags: ['autodocs']
} satisfies Meta<typeof FileUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
