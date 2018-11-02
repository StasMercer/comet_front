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
		registrationLink: "https://comeandmeet.herokuapp.com/api/",
		verificationLink: "http://comeandmeet.herokuapp.com/accounts/verify_email/",
		trueVerificationCode: "",
		userVerificationCode:"",
		axiosConfig : {
			  headers: {
			      'Content-Type': 'application/json',
			  }
		},
		userName:'',
		userSurname: '',
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
			uniqLogin: "This login alredy exists",
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

					param = JSON.stringify({
						"username": login,
						"email": "",
						"password": "",
						"date_of_birth": ""
					});
					this.loaders.loginLoader = true;
					this.isErrors[0].uniqLogin = false;
					let self = this;
					axios.post(this.registrationLink,param,this.axiosConfig).then(function(response){
						self.loaders.loginLoader = false;
						self.isErrors[0].uniqLogin = false;

					}, 
					function(error){
						self.loaders.loginLoader = false;
						let loginError = error.response.data.errors;
						for(key in loginError){
							if(			loginError[key].source.pointer == '/data/attributes/username' && 
							  			loginError[key].detail 		   == "This field must be unique."	){
								self.isErrors[0].uniqLogin = true;
							}
						}
					});
				},

		checkUniqueMail: function(mail){

				param = JSON.stringify({
					"username": "",
					"email": mail,
					"password": "",
					"date_of_birth": ""
				});

				let self = this;
				this.isErrors[0].uniqMail = false;
				this.loaders.mailLoader = true;
				axios.post(this.registrationLink,param,this.axiosConfig).then(function(response){	
							self.loaders.mailLoader = false;
							self.isErrors[0].uniqMail = false;
					}, 
					function(error){
						self.loaders.mailLoader = false;
						let mailError = error.response.data.errors;
						for(key in mailError){
							if(mailError[key].source.pointer == '/data/attributes/email'){
								self.isErrors[0].uniqMail = true;
								self.errorMessages[0].validateMail = "This E-mail is alredy exists";
							}
						}
					});
				},

		getVerificationCode: function(){
			let link = this.verificationLink + this.userMail+"/";
			let self = this;
			axios.get(link).then(function(response){
				console.log(response);
				let code = response.data.data["verification_code:"];
				self.trueVerificationCode = code;
			},
			function(error){
				console.log(error.response);
			});
		},
		postUser: function(){
			param = JSON.stringify({
				"username": this.userLogin,
				"email": this.userMail,
				"password": this.userPassword,
				"date_of_birth": this.getDateOfBirth
			});
			let self = this;
			self.loaders.signUpLoader = true;
			axios.post(this.registrationLink,param,this.axiosConfig).then(function(response){
				self.loaders.signUpLoader = false;
				self.getVerificationCode();
				self.signUpEnd = true;
			},
			function(error){
				//error
				self.loaders.signUpLoader = false;
				self.isErrors[0].signUpErr = true;

			});
		},

		checkVerifCode: function(){
			this.isErrors[0].verifErr = false;
			if(this.userVerificationCode == this.trueVerificationCode){
				alert("You were registered")
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
				if(this.userName.length==0    || 
				   this.userSurname.length==0 ||
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