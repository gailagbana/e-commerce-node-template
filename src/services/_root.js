/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
 * */

const appEvent = require('../events/_config');
const { buildQuery } = require('../utilities/query');

class RootService {
    static validateEmail(rawEmail) {
        const email = rawEmail.trim();
        if (email.length < 6) {
            return {
                isValid: false,
                message: 'Email address is too short.',
            };
        }

        const emailPattern =
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const isValid = emailPattern.test(email);

        return {
            isValid,
            message: isValid ? email : 'Invalid email address.',
        };
    }

    static processFailedResponse(message, code = 400) {
        return {
            error: message,
            payload: null,
            status: code,
        };
    }

    static processSuccessfulResponse(
        payload,
        code = 200,
        sendRawResponse = false,
        responseType = 'application/json'
    ) {
        return {
            payload,
            error: null,
            responseType,
            sendRawResponse,
            status: code,
        };
    }

    static async handleDatabaseRead(Controller, queryOptions, extraOptions = {}) {
        const { count, fieldsToReturn, limit, seekConditions, skip, sortCondition } =
            buildQuery(queryOptions);

        const result = await Controller.readRecords(
            { ...seekConditions, ...extraOptions },
            fieldsToReturn,
            sortCondition,
            count || false,
            skip,
            limit
        );
        return result;
    }

    static processSingleRead(result) {
        if (result && result.id) return RootService.processSuccessfulResponse(result);
        return RootService.processFailedResponse('Resource not found', 404);
    }

    static processMultipleReadResults(result) {
        if (result && (result.count || result.length >= 0)) {
            return RootService.processSuccessfulResponse(result);
        }
        return RootService.processFailedResponse('Resources not found', 404);
    }

    static processUpdateResult(result, eventName) {
        if (result && result.ok && result.nModified) {
            if (eventName) {
                appEvent.emit(eventName, result);
            }
            return RootService.processSuccessfulResponse(result);
        }
        if (result && result.ok && !result.nModified) {
            return RootService.processSuccessfulResponse(result, 210);
        }
        return RootService.processFailedResponse('Update failed', 200);
    }

    static processDeleteResult(result) {
        if (result && result.nModified) return RootService.processSuccessfulResponse(result);
        return RootService.processFailedResponse('Deletion failed.', 200);
    }
}

module.exports = RootService;
