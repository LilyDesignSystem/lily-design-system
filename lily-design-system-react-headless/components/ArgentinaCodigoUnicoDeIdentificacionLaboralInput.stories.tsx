import type { Meta, StoryObj } from '@storybook/react-vite';
import ArgentinaCodigoUnicoDeIdentificacionLaboralInput from './ArgentinaCodigoUnicoDeIdentificacionLaboralInput';

const meta = {
  title: 'Headless/ArgentinaCodigoUnicoDeIdentificacionLaboralInput',
  component: ArgentinaCodigoUnicoDeIdentificacionLaboralInput,
  tags: ['autodocs']
} satisfies Meta<typeof ArgentinaCodigoUnicoDeIdentificacionLaboralInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'ArgentinaCodigoUnicoDeIdentificacionLaboralInput' }
};
