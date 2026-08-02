export interface Company {
  id?: string;
  name: string;
  logo?: string | null;
  description?: string | null;
  website?: string | null;
  industry?: string | null;
  size?: string | null;
  headquarters?: string | null;
  foundedYear?: number | null;
  email?: string | null;
  phone?: string | null;
  createdAt: unknown;
  createdBy: string;
}
