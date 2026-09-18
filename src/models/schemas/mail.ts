export type CodesSchema = {
  user_id: number;
  code: string;
  expires_at: string;
};

export type TempltesProps = {
  code: string;
  link: {
    base_url: string;
    jwtlink: string;
  };
};

export type Templates = keyof TempltesProps;
