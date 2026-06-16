export interface StaffDraftField {
  label: string;
  placeholder: string;
}

export interface StaffTask {
  title: string;
  note?: string;
}

export interface StaffMember {
  name: string;
  wallet: string;
  role: string;
  limitedAccess: boolean;
}
