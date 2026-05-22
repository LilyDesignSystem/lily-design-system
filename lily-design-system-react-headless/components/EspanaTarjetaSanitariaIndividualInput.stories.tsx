import type { Meta, StoryObj } from '@storybook/react-vite';
import EspanaTarjetaSanitariaIndividualInput from './EspanaTarjetaSanitariaIndividualInput';

const meta = {
  title: 'Headless/EspanaTarjetaSanitariaIndividualInput',
  component: EspanaTarjetaSanitariaIndividualInput,
  tags: ['autodocs']
} satisfies Meta<typeof EspanaTarjetaSanitariaIndividualInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
