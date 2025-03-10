/******************************************************************************
    Copyright:: 2022- IBM, Inc
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

import { ARIADefinitions } from "../../v2/aria/ARIADefinitions";
import { AriaUtil } from "../util/AriaUtil";
import { CommonUtil } from "../util/CommonUtil";
import { Rule, RuleResult, RuleFail, RuleContext, RulePass, RuleContextHierarchy } from "../api/IRule";
import { eRulePolicy, eToolkitLevel } from "../api/IRule";

export const aria_attribute_required: Rule = {
    id: "aria_attribute_required",
    context: "dom:*[role]",
    dependencies: ["aria_role_allowed"],
    refactor: {
        "Rpt_Aria_RequiredProperties": {
            "Pass_0": "pass",
            "Fail_1": "fail_missing"
        }
    },
    help: {
        "en-US": {
            "group": `aria_attribute_required.html`,
            "pass": `aria_attribute_required.html`,
            "fail_missing": `aria_attribute_required.html`
        }
    },
    messages: {
        "en-US": {
            "group": "The required attributes for the element with a role must be defined",
            "pass": "The required attributes for the element with the role are defined",
            "fail_missing": "Element with '{0}' role does not have the required ARIA attribute(s): '{1}'"
        }
    },
    rulesets: [{
        id: [ "IBM_Accessibility", "IBM_Accessibility_next", "WCAG_2_0", "WCAG_2_1", "WCAG_2_2"],
        num: "4.1.2", // num: [ "2.4.4", "x.y.z" ] also allowed
        level: eRulePolicy.VIOLATION,
        toolkitLevel: eToolkitLevel.LEVEL_ONE
    }],
    act: "4e8ab6",
    run: (context: RuleContext, options?: {}, contextHierarchies?: RuleContextHierarchy): RuleResult | RuleResult[] => {
        const ruleContext = context["dom"].node as Element;
        let attrNameArr = new Array();
        let roleNameArr = new Array();
        let designPatterns = ARIADefinitions.designPatterns;
        //let implicitRole = ARIAMapper.elemToImplicitRole(ruleContext);
        //let implicitRole = AriaUtil.getImplicitRole(ruleContext);
        let hasAttribute = CommonUtil.hasAttribute;
        let testedRoles = 0;

        let tagProperty = AriaUtil.getElementAriaProperty(ruleContext);
        let role = AriaUtil.getResolvedRole(ruleContext);
        if (!role) return;
        
        let requiredRoleProps = AriaUtil.getRoleRequiredProperties(role, ruleContext);
        if (designPatterns[role] && requiredRoleProps !== null) {
            let allowedRoleProps = AriaUtil.getAllowedAriaAttributes(ruleContext, role, tagProperty);
            let roleMissingReqProp = false;
            for (let i = 0, propertiesLength = requiredRoleProps.length; i < propertiesLength; i++) {
                if (!allowedRoleProps.includes(requiredRoleProps[i])) continue;
                if (!hasAttribute(ruleContext, requiredRoleProps[i])) {
                    // If an aria-labelledby isn't present, an aria-label will meet the requirement.
                    if (requiredRoleProps[i] == "aria-labelledby") {
                        if ((!hasAttribute(ruleContext, "aria-label")) || (role != "radiogroup")) {
                            attrNameArr.push(requiredRoleProps[i]);
                            roleMissingReqProp = true;
                        }
                    } else if (requiredRoleProps[i] == "aria-valuenow") {
                        if ((!hasAttribute(ruleContext, "aria-valuetext")) || (role != "progressbar")) {
                            attrNameArr.push(requiredRoleProps[i]);
                            roleMissingReqProp = true;
                        }
                    } else if (requiredRoleProps[i] == "aria-controls" && role == "combobox") {
                        // Skip this check since aria-controls in the textbox of a combobox is already handled in rule HAAC_Combobox_Must_have_Text_Input
                    } else {
                        attrNameArr.push(requiredRoleProps[i]);
                        roleMissingReqProp = true;
                    }
                }
            }
            if (roleMissingReqProp == true) {
                roleNameArr.push(role);
            }
        }
        
        let passed = roleNameArr.length == 0 || attrNameArr.length == 0; // only aria attributes so NO OUT OF SCOPE
        if (!passed) {
            let retToken = new Array();
            retToken.push(roleNameArr.join(", "));
            retToken.push(attrNameArr.join(", "));
            return RuleFail("fail_missing", retToken);
        } else {
            return RulePass("pass");
        }
    }
}
