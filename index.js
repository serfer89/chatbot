'use strict';
var login = "s.pavlov@planeta-kino.com.ua";
var	pass = "Veronika87";
const TelegramBot = require('node-telegram-bot-api'),
      request = require('request'),
      fs = require('fs'),
      token = '322237854:AAFh-FrdOO1As5LxIXx7rHEet6iiCRYvAHw',
	bot = new TelegramBot(token, {polling:true});
var auth = require("./jira.js");
    var t = auth.t();
	var session_token = auth.token(login, pass);
	console.log("text"+session_token);

	

 let stateSetName = false;
 let notes = [];
 let userName;
    var main_options = {
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [{ text: 'Погода', callback_data: 'погода' }],
          [{ text: 'Курс', callback_data: 'курс' }],
          [{ text: 'Нагадати', callback_data: 'нагадай' }],
          [{ text: 'Інше', callback_data: 'інше' }]
        ]
      })
    };
	
	function stock(id){
	request('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5', function(error, 		response, body){
	if(!error && response.statusCode === 200)
		{
		const data = JSON.parse(body);
		data.forEach(function(value, index){
			bot.sendMessage(id, (`Валюта: ${value.ccy} | Код національної валюти: ${value.base_ccy} | Купівля: ${value.buy}`));
			
			}); bot.sendMessage(id, 'поїхали далі', main_options);
		}	
	})
				
	}

	function weather(id){
	request('http://api.openweathermap.org/data/2.5/forecast/daily?q=Kyiv&appid=d01946c71f847270df726ba46cc786b6&mode=json&units=metric&cnt=7', function(error, 		response, body){
	if(!error && response.statusCode === 200)
		{
		const data = JSON.parse(body);


               
let data_html = "Температура сьогодні "+data.list[0].temp.day.toFixed(1)+", "+data.list[0].weather[0].description+"http://openweathermap.org/img/w/"+data.list[0].weather[0].icon+".png";

 

var data_html_t = "Температура на завтра "+data.list[1].temp.day.toFixed(1)+", "+data.list[0].weather[0].description+"http://openweathermap.org/img/w/"+data.list[1].weather[0].icon+".png";

			bot.sendMessage(id, data_html),
			bot.sendMessage(id, data_html_t),
			bot.sendMessage(id, 'поїхали далі', main_options);	
			
		}	
	})
	} 



bot.on('callback_query', function (msg) { 
	const id = msg.from.id;
	let answer = msg.data;
	switch (answer) {
	case 'погода': weather(id); 
	break;
	case 'курс': stock(id); 
	break;
	};
	

});

    bot.onText(/\/напомни (.+) в (.+)/, function (msg, match) {
      var userId = msg.from.id;
      var text = match[1];
      var time = match[2];

      notes.push( { 'uid':userId, 'time':time, 'text':text } );

      bot.sendMessage(userId, 'Отлично! Я обязательно напомню, если не сдохну :)');

    setInterval(function(){
        for (var i = 0; i < notes.length; i++){
            var curDate = new Date().getHours() + ':' + new Date().getMinutes();
                if ( notes[i]['time'] == curDate ) {
                    bot.sendMessage(notes[i]['uid'], 'Напоминаю, что вы должны: '+ notes[i]['text'] + ' сейчас.');
                    notes.splice(i,1);
                }
            }
    },1000);


    });


bot.onText(/\/setname/, function (msg, match) {
  
  var fromId = msg.from.id;
  bot.sendMessage(fromId, "Введите имя").then(answer => {
  console.log('He said ', answer.text); // He said all fine
});


  /*stateSetName =true;
 setTimeout(function(){   bot.sendMessage(fromId, "Отмена!"); stateSetName =false;},30000);*/
});




bot.on('message', function(msg){ 
	const id = msg.from.id,
	_msgTxt = msg.text,
	msgTxt = _msgTxt.toLowerCase();
	
	if(msgTxt == '/start' || msgTxt == 'привет' || msgTxt == 'привіт') {
	bot.sendMessage(id, 'Привіт, я бот Альфред! Я знаю яка зараз погода і курс валют',  main_options);	
	//getname(msgTxt, id);
	}


else if (msgTxt == 'курс') {stock(id);}




else if (msgTxt == 'погода') {weather(id);}






	function getname(msgTxt, id){
	if (msgTxt != null)
	{	
	let username = msgTxt;
		bot.sendMessage(id, 'What about your email?');	}
	else {bot.sendMessage(id, 'Pls enter your name'); }
	}
});
