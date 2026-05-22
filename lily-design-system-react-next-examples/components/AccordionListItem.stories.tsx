import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import AccordionListItem from './AccordionListItem';

const meta = {
  title: 'Examples/AccordionListItem',
  component: AccordionListItem,
  tags: ['autodocs']
} satisfies Meta<typeof AccordionListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
