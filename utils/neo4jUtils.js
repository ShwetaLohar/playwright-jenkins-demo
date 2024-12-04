const neo4j = require('neo4j-driver');
const driver = neo4j.driver('neo4j://103.189.89.121:7687', neo4j.auth.basic('neo4j', 'nNIy176I'));

async function deleteUserByMobile(mobileNumber) {
    const session = driver.session();

    try {
        const result = await session.run(
            `MATCH (n:User {mobileNo: $mobileNumber}) DETACH DELETE n`,
            { mobileNumber }
        );
        console.log("Deleted mobile number");
    } finally {
        await session.close();
    }
}

async function deleteMerchantByCompanyName(companyName) {
    const session = driver.session();

    try {
        const result = await session.run(
            `MATCH (n:Merchant {companyName: $companyName}) DETACH DELETE n`,
            { companyName }
        );

        console.log("Deleted company name");
        // console.log(`Deleted ${result.summary.counters.updates().nodesDeleted()} Merchant nodes`);
    } finally {
        await session.close();
    }
}

async function byPassVerifyOTP(mobileNumber){
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (n:User {mobileNo: $mobileNumber}) set n.mobileVerified=true return n`,
            { mobileNumber }
        );
        console.log("Mobile number Verified");
    } finally {
        await session.close();
    }

}

async function deleteSubmerchants(companyName){

    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (m:Merchant{companyName: $companyName})-[r:HAS_SUBMERCHANT]->(s:SUBMERCHANT) detach delete s`,
            { companyName }
        );
        console.log("Submerchants deleted successfully");
    } finally {
        await session.close();
    }
}

module.exports = {
    deleteUserByMobile,
    deleteMerchantByCompanyName,
    byPassVerifyOTP,
    deleteSubmerchants
};
