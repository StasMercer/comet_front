Vue.component('aboutinput',{
	data: function(){
		return{
			hovered: false
		}
	},
	props: ['title','content'],
	template: '<div class="userData__aboutInput" v-on:mouseenter="hovered = true" v-on:mouseleave="hovered = false">?<transition name="slide-fade"><div class="tipBlock"  v-show="hovered"><h3>{{title}}</h3><p>{{content}}</p></div></transition></div>'
});


let signUp = new Vue({
	el: "#signUpBlock",
	data: {
		registrationLink: "https://comeandmeet.herokuapp.com/accounts/",
		trueVerificationCode: "",
		userVerificationCode:"",
		axiosConfig : {
			  headers: {
			      'Content-Type': 'application/json',
			  }
		},
		userFirstName:'',
		userLastName: '',
		userMail: '',
		userPassword:'',
		userLogin: '',
		isErrors:[{
			validateMail: false,
			password: false,
			uniqLogin: false,
			uniqMail: false,
			signUpErr: false,
			verifErr: false
		}],
		errorMessages: [{
			validateMail: "",
			password: "Password can`t be less then 6 symbols",
			uniqLogin: "This login already exists",
			signUpErrMsg: "Getting some trouble. Please, try singUp again",
			verifErrMsg: "You entered wrong verification code"
		}],
		errorClass: 'errorInput',

		disableSubmit: true,
		days:[],
		months:[],
		years:[],
		selectedDay: '1',
		selectedMonth: 'Jan',
		selectedYear:'2017',
		loaders: {
			mailLoader:false,
			loginLoader: false,
			signUpLoader: false
		},

		signUpEnd:false

	},
	methods: {
		checkUniqueLogin: function(login){


					this.loaders.loginLoader = true;
					this.isErrors[0].uniqLogin = false;
					let self = this;
					axios.get(`${this.registrationLink}check_username/${this.userLogin}/`).then(function(response){
						self.loaders.loginLoader = false;
						self.isErrors[0].uniqLogin = false;


						self.loaders.loginLoader = false;
						let result = response.data.data;

						if(result != "username is unique"){
								self.isErrors[0].uniqLogin = true;
						}

					},
					function(error){
						//error
					});
				},

		checkUniqueMail: function(mail){


				let self = this;
				this.isErrors[0].uniqMail = false;
				this.loaders.mailLoader = true;
				axios.get(`${this.registrationLink}check_email/${this.userMail}/`).then(function(response){
							let result = response.data.data;
							self.loaders.mailLoader = false;
								if(result != "email is unique"){
									self.isErrors[0].uniqMail = true;
									self.errorMessages[0].validateMail = "This E-mail is alredy exists";
								}
					},
					function(error){
							//error
					});
				},

		getVerificationCode: function(){
			let link = this.verificationLink + this.userMail+"/";
			let self = this;
			self.loaders.signUpLoader = true;
			axios.get(`${this.registrationLink}verify_email/${this.userMail}/`).then(function(response){
				console.log(response);
				self.loaders.signUpLoader = false;
				let code = response.data.data["verification_code"];
				self.trueVerificationCode = code;
				self.signUpEnd = true;
			},
			function(error){
				//error
			});
		},
		postUser: function(){
			param = JSON.stringify({
				"email": this.userMail,
				"username": this.userLogin,
				"password": this.userPassword,
				"first_name": this.userFirstName,
				"last_name": this.userLastName,
				"date_of_birth": this.getDateOfBirth
			});




			axios.post(`${this.registrationLink}users/`,param,this.axiosConfig).then(function(response){

				alert('you were registered');
			},
			function(error){
				//error
			});
		},

		checkVerifCode: function(){
			this.isErrors[0].verifErr = false;
			console.log(this.trueVerificationCode);
			if(this.userVerificationCode == this.trueVerificationCode){
					this.postUser();
			} else {
				this.isErrors[0].verifErr = true;
			}
		}



	},



	computed: {
		checkMail: function(){
			regExp = /^\w+@\w+\.\w{2,4}$/i;
			if(!regExp.test(this.userMail)){
				this.errorMessages[0].validateMail = "incorrect E-mail address";
				this.isErrors[0].validateMail = true;
			} else {
				this.isErrors[0].validateMail = false;

				this.checkUniqueMail(this.userMail);

			}
		},
		checkPass: function(){
			if(this.userPassword.length < 6){
				this.isErrors[0].password = true;
			} else {
				this.isErrors[0].password = false;
			}
		},
		checkUniqLogin: function(){

			this.checkUniqueLogin(this.userLogin);

		},
		disableSubmitCheck: function(){
			for(key in this.isErrors[0]){
				if(this.userFirstName.length==0    ||
				   this.userLastName.length==0 ||
				   this.userLogin.length==0   ||
				   this.userPassword.length<6 ||
				   this.userMail.length==0){
					return true;
				}
				if(this.isErrors[0][key] == true){
					return true;
				}

			}

			return false;
		},

		getDateOfBirth: function(){
			let monthNum = this.months.indexOf(this.selectedMonth) +1;
			let birthDay = this.selectedYear+"-"+monthNum+"-"+this.selectedDay;
			return birthDay;
		},



	},

	created: function(){
				for(let i =1;i<32;i++){
					this.days.push(i);
				}

				let monthsArray = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

				for(let i = 0; i<monthsArray.length;i++){
					this.months.push(monthsArray[i]);
				}
				let startYear = 2017;
				for(let i = 0;i<100;i++){
					this.years.push(startYear);
					startYear--;
				}



			}



});
