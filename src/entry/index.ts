import data from './data.json' assert { type: 'json' };
import {generateContactList, processData} from './utilities/preprocessing';

export const contactList = generateContactList(data);
export const processedData = processData(data);