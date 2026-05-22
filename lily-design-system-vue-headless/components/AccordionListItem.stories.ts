import type { Meta, StoryObj } from '@storybook/vue3-vite';
import AccordionListItem from './AccordionListItem.vue';

const meta = {
  title: 'Headless/AccordionListItem',
  component: AccordionListItem,
  tags: ['autodocs']
} satisfies Meta<typeof AccordionListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
