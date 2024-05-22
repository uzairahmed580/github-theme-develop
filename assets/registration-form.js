class registrationForm extends HTMLElement {
    constructor() {
      super();
      this.node = document.querySelector("#registration_page");
      this.node.addEventListener('keydown', this.onkeydown.bind(this));  
      this.input = this.querySelector('.SendEmail');
      this.input.disabled = true;
      this.sendOtp = 'https://oyr2io95dd.execute-api.us-east-2.amazonaws.com/PROD/registration/send_otp';
      this.input.addEventListener('click', this.onSendOTPButtonClick.bind(this)); 
      this.name = this.querySelector('#RegisterForm-FirstName');
      this.ResetOTp = this.querySelector('.resentOTP');
      this.ResetOTp.addEventListener('click', this.onRestButtonClick.bind(this));  
      this.ResetOTPApi = 'https://oyr2io95dd.execute-api.us-east-2.amazonaws.com/PROD/registration/send_otp';
      this.firstNameInput = document.getElementById('RegisterForm-FirstName');
        this.lastNameInput = document.getElementById('RegisterForm-LastName');
        this.genderSelect = document.querySelector('select[name="gender"]');
        this.mobileNumInput = document.getElementById('mobile-num');
        this.emailAddressInput = document.getElementById('RegisterForm-email')
        this.passwordInput = document.getElementById('RegisterForm-password')
        this.ConformPassword = document.getElementById('RegisterForm-conform-password');

        this.firstNameInput.addEventListener('input', this. onInsertValue.bind(this));
        this.lastNameInput.addEventListener('input', this. onInsertValue.bind(this));
        this.genderSelect.addEventListener('change', this. onInsertValue.bind(this));
        this.mobileNumInput.addEventListener('input', this. onInsertValue.bind(this));
        this.emailAddressInput.addEventListener('input', this. onInsertValue.bind(this));
        this.ConformPassword.addEventListener('input', this. onInsertValue.bind(this));
        this.passwordInput.addEventListener('input', this. onInsertValue.bind(this));
    }
  
    connectedCallback() {
    }
    onSendOTPButtonClick() {
        this.sendOTP();       
    }
    onInsertValue(){    
        this.checkFields();
    }
    onRestButtonClick(){
        this.generateOTP();
    }
    onKeyPress(event){
        event.preventDefault();
        // this.isCharacterKey(event, inputIndex)   
    }

    onkeydown(event){
        if (event.keyCode == 13) {
            event.preventDefault();
            return false;
        }
    }

    sendOTP() {
        let password_filed = document.querySelector('.password_field');
        let email_filed = document.querySelector('.email-field');
        let conform_password_filed = document.querySelector('.password_conform_field');
        var send_oTp = document.querySelector('.send_oTp');
        var sendEmailButton = document.querySelector('.SendEmail');
        var infoContainer = document.querySelector('.info_containers');
        var emailInput = document.getElementById('RegisterForm-email');
        var resentOTP = document.querySelector('.resentOTP');
        var timerContainer = document.getElementById("timerContainer");
        var timerDisplay = document.getElementById("timer");
        var timerDuration = 120;
        var successful_send = document.querySelector('.successful_code_send');
        var firstName = document.getElementById('RegisterForm-FirstName').value.trim();
        var lastName = document.getElementById('RegisterForm-LastName').value.trim();
        var gender = document.querySelector('.selectgender').value.trim();
        var password = document.getElementById('RegisterForm-password').value.trim();
        var conformPassword = document.getElementById('RegisterForm-conform-password').value.trim();
        var alertMsgElement = document.querySelector('.alrt-msg');
        var email = emailInput.value.trim(); 
        //console.log('email---', email);
                
        if (!validateEmail(email) ||  email === "" || firstName === "" || lastName === "" || gender === ""  || password === "" ||  conformPassword === "" || password.length < 6 || password !== conformPassword ) {
            if (password !== conformPassword) {
                document.querySelector('.Error-enter-Conform-passwords').style.display = 'block';
            }
            return;
        } 
        else {
            sendEmailButton.setAttribute('disabled', 'disabled');
        }
        sendEmailButton.classList.add("button-loader");
        sendEmailButton.style.color = '#E5337C';
        email_filed.setAttribute('readonly', true);
        conform_password_filed.setAttribute('readonly', true);
        password_filed.setAttribute('readonly', true);
        localStorage.setItem('registeredEmail', email);
        fetch(this.sendOtp, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email_id: email,
            }),
        })
            .then(response => {
                console.log('response1---', response);
                if (response.ok) {
                    return response.json();
                } else {
                    return response.json().then(data => {
                        let message = data.message;
                        alertMsgElement.textContent = message;
                        sendEmailButton.style.display = 'none';
                        if(message == 'Email Already Exists'){
                            email_filed.removeAttribute('readonly');
                            conform_password_filed.removeAttribute('readonly');
                            password_filed.removeAttribute('readonly');
                            sendEmailButton.style.display = 'block';
                            sendEmailButton.classList.remove("button-loader");
                            sendEmailButton.removeAttribute('disabled', 'disabled');
                            sendEmailButton.style.color = '#FFF';
                        }
                    });
                }
            })
            .then(data => {
                 setTimeout(() => { 
                    if(data.message != 'Email Already Exists'){
                        sendEmailButton.classList.add("button-loader"); 
                    }else{
                        sendEmailButton.classList.remove("button-loader"); 
                    }
                }, 100); 
                alertMsgElement.style.display = 'none'
                if (data && data.message === 'OTP Sent') {
                    
                     setTimeout(() => {
                        successful_send.style.display = "block";
                        setTimeout(() => {
                           sendEmailButton.classList.remove("button-loader");
                            sendEmailButton.style.display = "none";
                            if (infoContainer && sendEmailButton && resentOTP) {
                                infoContainer.style.display = 'block';
                                sendEmailButton.style.display = 'none';
                                successful_send.style.display = "none";
                                send_oTp.style.display = 'none';
                                resentOTP.style.display = 'none';
                                startTimer(timerDuration, timerDisplay, timerContainer);
                            }
                        }, 1500);
                        
                    }, 1000);
                }
                else{

                    alertMsgElement.style.display = 'block';
                }
            })
            .catch(error => {
                //console.error('Error sending OTP:', error); /
            });
    }
    generateOTP() {
        var emailInput = document.getElementById('RegisterForm-email');
        var resentOTP = document.querySelector('.resentOTP');
        var send_oTp = document.querySelector('.send_oTp');
        var alertMsgElement = document.querySelector('.alrt-msg');
        var SuccessfulReset = document.querySelector('.successful-OTp-reset');
        var timerContainer = document.getElementById("timerContainer");
        var resetotp_reset = document.getElementsByClassName("error-msg-reset")[0];
        var timerDisplay = document.getElementById("timer");
        var CheckCode = document.querySelector('.error-msg-wrong-verification');
        var email = emailInput.value.trim(); 
        var timerDuration = 120;
        resetotp_reset.style.display = 'none';
        resentOTP.classList.add("button-loader");
        resentOTP.style.color = '#fff';
        fetch(this.ResetOTPApi, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email_id: email,
            }),
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return response.json().then(data => {
                    let message = data.message;
                    console.log('message---',message);
                    if (data.message !== 'Email Already Exists') {
                        alertMsgElement.textContent = message;
                        alertMsgElement.style.display = 'block';
                    }
                    // sendEmailButton.style.display = 'none';
                });
            }
        })
        .then(data => {
            console.log('checkotp--', data);
            // setTimeout(() => { 
            //     resentOTP.classList.add("button-loader");
            // }, 1500);
            if(data && data.message === 'OTP Resent'){
                send_oTp.style.display = 'block';
                CheckCode.style.display = 'none';
                setTimeout(() => {
                    SuccessfulReset.style.display = 'block';
                    setTimeout(() => {
                        resentOTP.classList.remove("button-loader");
                        SuccessfulReset.style.display = 'none';
                        resentOTP.style.color = '#0000FF';
                        resentOTP.style.display = 'none';
                        send_oTp.style.display = 'none';
                    }, 2000);
                    startTimer(timerDuration, timerDisplay, timerContainer);
                }, 1100);
            }
            else{
                resentOTP.classList.add("button-loader");
                resentOTP.style.color = '#fff';
                timerContainer.style.display = 'none';
            }
        })
        .catch(error => {
           // console.error('Error generating OTP:', error);
        });
        
    }
    checkFields() {
        var sendEmailButton = document.querySelector('.SendEmail');
        var isFirstNameValid = this.firstNameInput.value.trim() !== '';
        var isLastNameValid = this.lastNameInput.value.trim() !== '';
        var isGenderValid = this.genderSelect.value !== '';
        var isEmailAddressValid = this.emailAddressInput.value.trim() !== '' && this.validateEmail(this.emailAddressInput.value.trim()) ;
        var isPasswordValid = this.passwordInput.value.trim() !== '' && this.passwordInput.value.trim().length >= 6;
        var isConformPassword = this.ConformPassword.value !== '' ;
        // var storedEmail = localStorage.getItem('registeredEmail');
        // var isEmailSameAsStored = this.emailAddressInput.value.trim() === storedEmail;
       
        if (isFirstNameValid && isLastNameValid && isGenderValid && isEmailAddressValid && isPasswordValid && isConformPassword && this.passwordInput.value == this.ConformPassword.value ) {
            sendEmailButton.removeAttribute('disabled');
        } else {
            sendEmailButton.setAttribute('disabled', 'disabled');
        }
    }
    validateEmail(email) {
        var errorSpan = document.getElementsByClassName('Error-enter-email')[0];
        var validRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (email.match(validRegex)) {
            errorSpan.style.display = 'none';
            return true;
        } else {
            errorSpan.style.display = 'block';
            return false;
        }
    }
  }
  
customElements.define('registration-form', registrationForm);

//input validation 
function handleInput(input) {
    const digit = parseInt(input.value);
    var send_oTp = document.querySelector('.send_oTp');
    var sendEmailButton = document.querySelector('.SendEmail');
    const emailInput = document.getElementById('RegisterForm-email');
    const infoContainer = document.querySelector('.info_containers');
    const resetotp_reset = document.getElementsByClassName("error-msg-reset")[0];
    const alertMsgElement = document.querySelector('.alrt-msg');
    const successful_verify = document.querySelector('.successful-OTp-verify');
    const CheckCode = document.querySelector('.error-msg-wrong-verification');
    const successful_send = document.querySelector('.successful_code_send');
    const OTPInputs = document.querySelectorAll('.opt_values');
    var timerDuration = 120;
    const timerDisplay = document.getElementById("timer");
    var timerContainer = document.getElementById("timerContainer");
      let OTP = '';

    if (!isNaN(digit) && digit >= 0 && digit <= 9) {
        input.value = digit;

        const nextInputId = parseInt(input.dataset.gtmFormInteractFieldId) + 1;

        if (nextInputId <= OTPInputs.length) {
            const nextInput = document.getElementById('OTp-' + nextInputId);
            nextInput.focus();
        }

        OTPInputs.forEach((otpInput, index) => {
            OTP += otpInput.value;
          
            otpInput.addEventListener("input", function (e) {
                const target = e.target;
                const val = target.value;

                if (isNaN(val)) {
                    target.value = "";
                }
                target.value = val;
                if (val !== "") {
                    const next = OTPInputs[index + 1];
                    if (next) {
                        next.focus();
                    }
                }
            });

            otpInput.addEventListener("keyup", function (e) {
                const target = e.target;
                const key = e.key.toLowerCase();

                if (key === "backspace" || key === "delete") {
                    const val = target.value;
                    if (val === "") {
                        const prev = OTPInputs[index - 1];
                        if (prev) {
                            prev.focus();
                        }
                    }
                }
            });
        });
        
        if (OTP.length === 6) {
            const email_id = emailInput.value;
            fetch('https://oyr2io95dd.execute-api.us-east-2.amazonaws.com/PROD/registration/verify_otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email_id: email_id,
                    otp: parseInt(OTP)
                }),
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response.json().then(data => {
                        let message = data.message;
                        console.log('check---', message);
                        if (data.message !== 'Email Already Exists') {
                            alertMsgElement.textContent = message;
                        } 
                    });
                }
            })
            .then(data => {
                successful_send.style.display = 'none';
                timerDisplay.style.display = 'block';
                const registerButton = document.querySelector('.registerbtn');
                const storedEmail = localStorage.getItem('registeredEmail');
                if (data.status === 'Success') {
                    send_oTp.style.display = 'block';
                    successful_verify.style.display = 'block';
                    const email_filed = document.querySelector('.email-field');
                    const conform_password_filed = document.querySelector('.password_conform_field');
                    const password_filed = document.querySelector('.password_field');
                    CheckCode.style.display = 'none';
                    setTimeout(() => {
                        OTPInputs.forEach(function (input) {
                            input.value = ''; 
                        });
                        registerButton.style.display = 'block';
                        email_filed.removeAttribute('disabled');
                        conform_password_filed.removeAttribute('disabled');
                        password_filed.removeAttribute('disabled');
                        password_filed.classList.add("disable");
                        conform_password_filed.removeAttribute('disabled');
                        infoContainer.style.display = 'none';
                        timerDisplay.style.display = 'none';
                        resetotp_reset.style.display = 'none';
                        successful_verify.style.display = 'none';
                    }, 2000);   
                    //startTimer(timerDuration, timerDisplay, timerContainer);
                } else {
                    CheckCode.style.display = 'block';
                    resetotp_reset.style.display = 'none';
                    if(storedEmail != email_id){
                        sendEmailButton.style.display = 'block';
                        registerButton.style.display = 'none';
                    }
                }
                if (alertMsgElement.textContent !== 'Email Already Exists') {
                    alertMsgElement.style.display = 'block';
                }
            })
            .catch(error => {
                //console.error('Error:', error);
            });
        }
    } else {
        input.value = '';
    }
}

//timer
function startTimer(duration, display, container) {
    var resentOTP = document.getElementsByClassName('resentOTP')[0];
    var code_exprier = document.querySelector('.error-msg-reset');
    var resentOTP = document.querySelector('.resentOTP');
    var timer = duration, minutes, seconds;
    container.style.display = "block";

    var intervalId = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(intervalId);
            var otpInputs = document.querySelectorAll('.opt_values');
            var CheckCode = document.querySelector('.error-msg-wrong-verification');
            otpInputs.forEach(function (input) {
                input.value = '';
                code_exprier.style.display = 'block';
                resentOTP.style.color = '#0000FF';
            });
            CheckCode.style.display = 'none';
            
            if (resentOTP && container) {
                container.style.display = "none";
                resentOTP.style.display = "block";
            }
        }
    }, 1000);
}
//validation LAst Name/First Name
function validateInput(element, inputIndex) {
        var ErrorMsgElements = document.getElementsByClassName("Error-enter-msg");
        var regex = /^[a-zA-Z]+$/;

        if (regex.test(element.value)) {
            ErrorMsgElements[inputIndex].style.display = 'none';
        } else {
            ErrorMsgElements[inputIndex].style.display = 'block';
        }
    }

    function isCharacterKey(event, inputIndex) {
        var ErrorMsgElements = document.getElementsByClassName("Error-enter-msg");
        var keyCode = event.keyCode || event.which;
        var charKey = String.fromCharCode(keyCode);
        var regex = /^[a-zA-Z]+$/;

        if (regex.test(charKey)) {
            ErrorMsgElements[inputIndex].style.display = 'none';
            return true;
        } else {
            if (ErrorMsgElements[inputIndex]) {
                ErrorMsgElements[inputIndex].style.display = 'block';
            }
            return false;
        }
    }

// validation mobile number
function isCharacterKeyNumber(event) {
    var ErrorMsgNUmber = document.getElementsByClassName("Error-enter-number")[0];
    var keyCode = event.keyCode || event.which;
    var charKey = String.fromCharCode(keyCode);
    var regex = /^[0-9]+$/;
    if (regex.test(charKey)) {
        ErrorMsgNUmber.style.display = 'none';
        return true;
    } else {
        if (ErrorMsgNUmber) {
            ErrorMsgNUmber.style.display = 'block';
        }
        return false;
    }
}

//validation password
function validatePassword(event) {
    var passwordInput = document.getElementById('RegisterForm-password');
    var errorSpan = document.getElementsByClassName('Error-enter-password')[0];
    var password = passwordInput.value + String.fromCharCode(event.keyCode || event.which);
    if (password.length > 5) {
        errorSpan.style.display = 'none';
    } else {
        errorSpan.style.display = 'block';
       
    }
}
function validateConfirmPassword(event) {
    var passwordInputs = document.getElementById('RegisterForm-conform-password');
    var passwordInput = document.getElementById('RegisterForm-password').value;
    var errorSpans = document.getElementsByClassName('Error-enter-Conform-passwords')[0];
    var Conformpassword = passwordInputs.value + String.fromCharCode(event.keyCode || event.which);
    if(Conformpassword == passwordInput){
        errorSpans.style.display = 'none';
    }
    else{
        errorSpans.style.display = 'block';
    }
}


//validation Email
function validateEmail(input) {
    var errorSpan = document.querySelector('.Error-enter-email');
    var validRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (input.match(validRegex)) {
        errorSpan.style.display = 'none';
        return true;
    } else {
        errorSpan.style.display = 'block';
        return false;
    }
}

function handleEmailChange(email) {
    localStorage.setItem('registeredEmail', email);
    const storedEmail = localStorage.getItem('registeredEmail');
    if (email === storedEmail) {
        document.querySelector('.SendEmail').style.display = 'block';
        document.querySelector('.SendEmail').style.color = '#fff';
        document.querySelector('.registerbtn').style.display = 'none';

    } else {
        document.querySelector('.SendEmail').style.display = 'none';
        document.querySelector('.registerbtn').style.display = 'block';
    }
}



 
