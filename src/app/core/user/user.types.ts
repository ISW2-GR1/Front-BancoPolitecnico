export interface User {
  name: string;
  last_name: string;
  username: string;
  email: string;
  cedula: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  birthday: Date | null;
  role: string;
  avatar: string;
  balance?: number;
  transactions?: number;
}
