// set-env.js (renombrar a .js)
const {writeFile} = require('fs');
const yargs = require('yargs');
require('dotenv').config();

const argv = yargs.argv;
const environment = argv.environment;
const isProduction = environment === 'development';

// TODO: Distinguish between environments
const targetPath = isProduction
    ? `./src/environments/environment.ts`
    : `./src/environments/environment.ts`;

const envConfigFile = `export const environment = {
  UserPoolId: "${process.env.UserPoolId}",
  ClientId: "${process.env.ClientId}",
  gatewayURL: "${process.env.gatewayURL}",
  companyTableName: "${process.env.companyTableName}",
  userTableName: "${process.env.userTableName}",
  candidatesTableName: "${process.env.candidatesTableName}",
  rolesTableName: "${process.env.rolesTableName}",
  teamsTableName: "${process.env.teamsTableName}",
  postHogKey: "${process.env.POSTHOG_KEY}",
  postHogHost: "${process.env.POSTHOG_HOST}",
  cvAnalysisEndpoint: "${process.env.CV_ANALYSIS_ENDPOINT}",
  screeningAnalysisEndpoint: "${process.env.SCREENING_ANALYSIS_ENDPOINT}",
  cvAnalysisBucket: "${process.env.CV_ANALYSIS_BUCKET}",
  createRoleEndpoint: "${process.env.CREATE_ROLE_ENDPOINT}",
  workingPositionEvaluationDetailsEndpoint: "${process.env.WORKING_POSITION_EVALUATION_DETAILS_ENDPOINT}",
  workingPositionSoftTraits: "${process.env.WORKING_POSITION_SOFT_TRAITS}",
};
`;


writeFile(targetPath, envConfigFile, function (err) {
    if (err) {
        console.log(err);
    }
    console.log(`Output generated at ${targetPath}`);
    console.log(`Environment set to ${envConfigFile}`);
});
