import Data from '../data.json' assert { type: "json" };

//Function to take data from json file and arrange it by master and unit. Note that the keys for the masters and units are the master_id and unit_id respectively unless a master has only itself and no units...in thise case, the agr_id for the master is used.
export const processData = (data: any) => {
    const updatedData = data.reduce((acc:any, unit: any) => {
        if(unit.report_individually !== null){
            const master = acc.masters[unit.master_name] || {[unit.unit_id !== null ? unit.unit_id : unit.agr_id]: {...unit}};
            const updatedMaster = {...master, [unit.unit_id !== null ? unit.unit_id : unit.agr_id]: {...unit}};
            return {...acc, masters: {...acc.masters, [unit.master_name]: updatedMaster}}
        } else {
            return {...acc, units: {...acc.units, [unit.unit_id] : {...unit}}}
        }

    }, {masters: {}, units: {}});
 
    let masterContracts = {} 
    for(let vals in updatedData.masters){
        masterContracts = {...masterContracts, [vals.trim()]: Object.values(updatedData.masters[vals])}
    }

    let unitContracts = Object.values(updatedData.units);

    return {...masterContracts, unit_contracts: unitContracts}
 
}

export const processedData = processData(Data);
//Function to generate a list of contact information to aid in prepopulating reporter field if the reporter has submitted data in the past.

export const generateContactList = (data: any) => {
    const contactList = data.reduce((acc: any, unit: any) => {
        if(unit.contact !== null && unit.contact.name !== null){
            return {...acc, [unit.contact.name]: {...unit.contact}}
        }
    }, {contactList: {}})

    return contactList;
}

