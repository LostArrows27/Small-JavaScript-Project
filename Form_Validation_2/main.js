function Validator(formSelector) {

    function getParent(element, selector) {
        while(element.parentElement) {
            if(element.parentElement.matches(selector)) {
                return element.parentElement;
            } 
            element = element.parentElement;

        }
    }

    var formRules = {};
    var validatorRules = {
        /**
         * Quy uoc tao rules
         * - Neu co loi thi return 'ErrorMessage'
         * - Neu khong co loi return 'undefined'
         */
        required: function (value) { 
            return value ? undefined : 'Vui lòng nhập trường này';
        },
        email: function(value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined :  'Trường này phải là email';
        },
        min: function (min) { 
            return function(value) {
                return value.length >= min ? undefined : `Vui lòng nhập ít nhất ${min} ký tự`
            }
        },
        max: function (max) { 
            return function(value) {
                return value.length <= max ? undefined : `Vui lòng nhập tối đa ${max} ký tự`
            }
        }
    }

    // Lay ra form Element trong dorm
    var formElement = document.querySelector(formSelector);
    
    // Chi xu ly khi co element trong dorm
    if(formElement) {
        var inputs = formElement.querySelectorAll('[name][rules]');
        for(var input of inputs) {
            var rules = input.getAttribute('rules').split('|');
            for(var rule of rules) {
                var ruleInfo;
                var isRulesHasValue = rule.includes(':')

                if(rule.includes(':')) {
                    ruleInfo = rule.split(':');
                    rule = ruleInfo[0];
                }

                var ruleFunc = validatorRules[rule];

                if(isRulesHasValue) {
                   ruleFunc = ruleFunc(ruleInfo[1]); 
                }

                if(Array.isArray(formRules[input.name])) {
                    formRules[input.name].push(ruleFunc);
                } else {
                    formRules[input.name] = [ruleFunc];
                }
            }
            // lang nghe su kien Validate (blur, change)
            input.onblur = handelValidate;
            input.oninput = handleClearError;
        }
        // sau vong for ta duoc formRules gom ten name + cac ham
        // ham thuoc hien validate
        function handelValidate(event) {
            // lay all rules 1 the input
            var rules = formRules[event.target.name]
            var ErrorMessage

            for(var rule of rules) {
                ErrorMessage = rule(event.target.value);
                if(ErrorMessage) break;
            }

            if(ErrorMessage) {
               var formGroup = getParent(event.target, '.form-group');
               
               if(formGroup) {
                    formGroup.classList.add('invalid')
                    var formMessage = formGroup.querySelector('.form-message')
                    if(formMessage) {
                        formMessage.innerText = ErrorMessage;
                    }
               }
            }

            return !ErrorMessage;
        }

        // ham clear message loi khi input
        function handleClearError(event) {
            var formGroup = getParent(event.target, '.form-group');
            if(formGroup.classList.contains('invalid')) {
                formGroup.classList.remove('invalid');
                var formMessage = formGroup.querySelector('.form-message')
                if(formMessage) {
                    formMessage.innerText = '';
                }
            }
        }
    }

    // Xu li hanh vi submit Form
    formElement.onsubmit = function (event) {  
        event.preventDefault();
        var isFormValid = true;
        var myData = {};
        var inputs = formElement.querySelectorAll('[name][rules]')
        for(var input of inputs) {
            var test = handelValidate({
                target: input
            })
            if(!test) {
                isFormValid = false;
            } else {
                myData[input.name] = input.value;
            }
        }
        if(isFormValid) {
            // lay Data
            fetch('http://localhost:5000/submit', {
                headers: {
                    'Content-type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    name: 1
                })
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
            })
        } 

    }
}
