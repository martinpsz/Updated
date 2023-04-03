export interface Contact {
    name: string | null;
    email: string | null;
    phone: string | null;
}

export interface Unit {
    agr_id: number;
    agreement_eff_date: string | null;
    agreement_exp_date: string | null;
    chapter: number | null;
    council: number | null;
    local: number | null;
    subunit: number | string | null;
    master_id: number | null;
    master_name: string | null;
    number_of_members: number | null;
    report_individually: boolean | null;
    state: string;
    contact: Contact | null;
    unit_name: string | null;
    unit_id: number | null;
}

export interface UnitList extends Array<Unit> {}

export interface ProcessedData {
    [key: string]: Unit | UnitList
}

export interface WageEvent {
    wage_event: 'Regular' | 'Special';
    effective_date: string;
    wage_event_type: '% increase' | '% decrease' | 'hourly increase' | 'hourly decrease' | 'lump sum/bonus';
    wage_event_value: number | string;
    starting_hourly: number | null;
    starting_annual: number | null;
    num_affected: number | null;
    description: string | null;
    supporting_doc: File | null;
}

export interface FormPayload {
    unit_id: number | null;
    unit_name: string | null;
    local: number | null;
    subunit: number | string | null;
    council: number | null;
    state: string;
    contact: Contact | null;

    inactive_status: 'Yes' | 'No';
    number_of_members: number | null;
    agreement_eff_date: string | null;
    agreement_exp_date: string | null;
    cba: File | null;
    wage_status: 'Yes' | 'No';
    bargaining_status: 'Yes' | 'No';

    wage_events: WageEvent | WageEvent[] | [];

    comment: string | null;

    status: 'NEEDS REVIEW' | 'SUBMITTED' | 'APPROVED';
    notes: string | null; 
}
