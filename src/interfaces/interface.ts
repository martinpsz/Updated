export interface Contact {
    name: string | null;
    email: string | null;
    phone: string | null;
}

export interface Unit {
    affiliate_id: number;
    master: boolean | null;
    master_id: number | null;
    master_name: string | null;
    unit_id: number | null;
    unit_name: string | null;
    state: string;
    local: number | null;
    council: number | null;
    subunit: number | string | null;
    contact: Contact | null;
    number_of_members: number | null;
    agreement_eff_date: string | null;
    agreement_exp_date: string | null;
    report_individually: boolean | null;
}

export interface UnitList extends Array<Unit> {}

export interface ProcessedData {
    [key: string]: Unit | UnitList
}

export interface WageEventInterface {
    key: string;
    effective_date: string | '';
    wage_event_type: '% increase' | '% decrease' | 'hourly increase' | 'hourly decrease' | 'lump sum/bonus';
    wage_event_value: string | null;
    starting_value: string | null;
    num_affected?: number | null;
    description?: string | null;
    supporting_doc?: File;
}

export interface WageEventList extends Array<WageEventInterface> {}

export interface FormPayload {
    affiliate_id: number;
    unit_id: number | null;
    unit_name: string | null;
    local: number | null;
    subunit: number | string | null;
    contact: Contact | null;
    council: number | null;
    inactive_status: 'Yes' | 'No';
    number_of_members: number | null;
    agreement_eff_date: string | null;
    agreement_exp_date: string | null;
    cba_file: File;
    wage_status: 'Yes' | 'No';
    bargaining_status: 'Yes' | 'No' | null;

    regular_wage_events: WageEventList;
    special_wage_events: WageEventList;

    comment: string | null;

    filing_status: 'NEEDS REVIEW' | 'SUBMITTED' | 'APPROVED';
    notes: string | null; 
}

