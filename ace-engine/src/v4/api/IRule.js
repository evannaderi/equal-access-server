"use strict";
/******************************************************************************
     Copyright:: 2020- IBM, Inc

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
 *****************************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.eRulesetType = exports.eRuleCategory = exports.eToolkitLevel = exports.eRulePolicy = exports.eRuleConfidence = void 0;
exports.RulePass = RulePass;
exports.RuleRender = RuleRender;
exports.RuleFail = RuleFail;
exports.RulePotential = RulePotential;
exports.RuleManual = RuleManual;
var eRuleConfidence;
(function (eRuleConfidence) {
    eRuleConfidence["PASS"] = "PASS";
    eRuleConfidence["FAIL"] = "FAIL";
    eRuleConfidence["POTENTIAL"] = "POTENTIAL";
    eRuleConfidence["MANUAL"] = "MANUAL";
})(eRuleConfidence || (exports.eRuleConfidence = eRuleConfidence = {}));
var eRulePolicy;
(function (eRulePolicy) {
    eRulePolicy["VIOLATION"] = "VIOLATION";
    eRulePolicy["RECOMMENDATION"] = "RECOMMENDATION";
    eRulePolicy["INFORMATION"] = "INFORMATION";
})(eRulePolicy || (exports.eRulePolicy = eRulePolicy = {}));
function RulePass(reasonId, messageArgs, apiArgs) {
    if (typeof reasonId === "undefined" || reasonId === null)
        throw new Error("Reason ID must be defined");
    return {
        value: [eRulePolicy.INFORMATION, eRuleConfidence.PASS],
        reasonId: reasonId,
        messageArgs: messageArgs || [],
        apiArgs: apiArgs || []
    };
}
function RuleRender(reasonId, messageArgs, apiArgs) {
    if (typeof reasonId === "undefined" || reasonId === null)
        throw new Error("Reason ID must be defined");
    return {
        value: [eRulePolicy.INFORMATION, eRuleConfidence.PASS],
        reasonId: 0,
        messageArgs: messageArgs || [],
        apiArgs: apiArgs || []
    };
}
function RuleFail(reasonId, messageArgs, apiArgs) {
    if (typeof reasonId === "undefined" || reasonId === null)
        throw new Error("Reason ID must be defined");
    return {
        value: [eRulePolicy.INFORMATION, eRuleConfidence.FAIL],
        reasonId: reasonId,
        messageArgs: messageArgs || [],
        apiArgs: apiArgs || []
    };
}
function RulePotential(reasonId, messageArgs, apiArgs) {
    if (typeof reasonId === "undefined" || reasonId === null)
        throw new Error("Reason ID must be defined");
    return {
        value: [eRulePolicy.INFORMATION, eRuleConfidence.POTENTIAL],
        reasonId: reasonId,
        messageArgs: messageArgs || [],
        apiArgs: apiArgs || []
    };
}
function RuleManual(reasonId, messageArgs, apiArgs) {
    if (typeof reasonId === "undefined" || reasonId === null)
        throw new Error("Reason ID must be defined");
    return {
        value: [eRulePolicy.INFORMATION, eRuleConfidence.MANUAL],
        reasonId: reasonId,
        messageArgs: messageArgs || [],
        apiArgs: apiArgs || []
    };
}
/**
 * @deprecated See ./IGuideline
 */
var IGuideline_1 = require("./IGuideline");
Object.defineProperty(exports, "eToolkitLevel", { enumerable: true, get: function () { return IGuideline_1.eToolkitLevel; } });
/**
 * @deprecated See ./IGuideline:eGuidelineCategory
 */
var IGuideline_2 = require("./IGuideline");
Object.defineProperty(exports, "eRuleCategory", { enumerable: true, get: function () { return IGuideline_2.eGuidelineCategory; } });
/**
 * @deprecated See ./IGuideline:eGuidelineType
 */
var IGuideline_3 = require("./IGuideline");
Object.defineProperty(exports, "eRulesetType", { enumerable: true, get: function () { return IGuideline_3.eGuidelineType; } });
