export const wageValueAdjusted = (wage_event_type: any, wage_event_value: any) => {
    let updated_wage_event_value = '';
    if(wage_event_type === '% increase'){
        updated_wage_event_value = wage_event_value + '%';
    } else if (wage_event_type === '% decrease'){
        updated_wage_event_value = -wage_event_value + '%';
    } else if (wage_event_type === 'hourly increase' || wage_event_type === 'lump sum/bonus'){
        updated_wage_event_value = '$' + wage_event_value;
    }
    else if (wage_event_type === 'hourly decrease'){
        updated_wage_event_value =  '-$' + wage_event_value;
    }

    return updated_wage_event_value;
}