export interface Login {
  email: string;
  password: string;
}

export interface Register extends Login {
  name: string;
}

export interface User extends Omit<Register, 'password' & 'name'> {
  user_name: string | null;
  image_url?: string;
}
