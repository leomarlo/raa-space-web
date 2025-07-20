

interface MenuItem {
    label: string;
    route: string;
    positions: [number, number][]; // [row, col]
  }

  interface RaaHieroglyphMatrixProps {
    frequency: number; // in milliseconds, 0 means no updates
    initialState: number; // integer seed
  }

  type RegisterFormProps = {
    title: string;
    description: string;
    placeholder: string;
    submit: string;
  };

  type RegisterFormPropsWithLink = {
    registerFormProps: RegisterFormProps;
    link: string;
  };

export type { MenuItem, RaaHieroglyphMatrixProps, RegisterFormProps, RegisterFormPropsWithLink };