#!/usr/bin/node 

//To do:
//IMPORTANT: DO NOT COMMIT UNTIL YOU REMOVE THE TOKEN AND URL FROM THE CODE BELOW.
//1. Remove shebang once file moved to production.
//2. Convert to TS.


//Function to retrieve affiliate data once the user has been authenticated.

export const getAffiliateData = async (affiliate_id: string, initial_year: number) => {
    /**
     * @param affiliate_id: string - the affiliate id that the 
     * user is associated with.
     * @param initial_year: number - the year that past year's data will be pulled from.
     */


    //Query to retrieve the data from the database.
    const query = `query {
        query GetInitialData($affiliate_id: String!, $initial_year: Int!) {
            affiliate_agreements(where: {affiliate_id: {_eq: $affiliate_id}, agreement_eff_date: {_gte: $initial_year}}) {
                agr_id
                master
                master_id
                master_name
                unit_id
                unit_name
                name
                state
                local
                council
                chapter
                subunit
                contact
                number_of_members
                agreement_eff_date
                agreement_exp_date
                in_negotiation
                increase_type
                effective_date_of_inc
                percent_wage_inc
                cents_per_hour_base
                cents_per_hour_inc
                dollar_lump_sum_base
                dollar_lump_sum_inc
        }`


    //put url and token in .env file before committing.
    const response = await fetch('{url}', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-hasura-admin-secret': '{token}',
        },
        body: JSON.stringify({query, variables: {affiliate_id, initial_year}})
    }).then(response => response.json())
      .then(data => console.log(data)) 

}

