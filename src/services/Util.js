const { LogError } = require('../models');
const { LogInfo } = require('../models');

module.exports = {
    saveLogError(action = '', error = '', UserId = 1) {
        error = error.substring(0, 255)

        try {
            LogError.create({
                action, error, UserId
            })
            
        } catch (error) {
            console.log('ERROR LOG ERROR', error.stack || error.message || error);
        }
    },
    saveLogInfo(action = '', UserId = 0) {
        try {
            LogInfo.create({
                action, UserId
            })
        } catch (error) {
            console.log('ERROR LOG INFO', error.stack || error.message || error);
        }
    }
}