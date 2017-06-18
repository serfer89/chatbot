
var Client = require('node-rest-client').Client;


client = new Client();
// Provide user credentials, which will be used to log in to JIRA.


var loginArgs = {
        data: {
                "username": "s.pavlov@planeta-kino.com.ua",
                "password": "Veronika87"
        },
        headers: {
                "Content-Type": "application/json"
        } 
};


client.post("https://planetakino.atlassian.net/rest/auth/1/session", loginArgs, function(data, response){
        if (response.statusCode == 200) {
                console.log('succesfully logged in, session:', data.session);
                var session = data.session;
                // Get the session information and store it in a cookie in the header
                var searchArgs = {
                        headers: {
								// Set the cookie from the session information
                                cookie: session.name + '=' + session.value,
                                "Content-Type": "application/json"
                        },
                   /*     data: {
								// Provide additional data for the JIRA search. You can modify the JQL to search for whatever you want.
                                jql: "project='BOT'"
                        }*/
                };
				// Make the request return the search results, passing the header information including the cookie.
                client.post("http://planetakino.atlassian.net/rest/api/2/project", searchArgs, function(searchResult, response) {
                        console.log('status code:', response.statusCode);
                        console.log('search result:', searchResult.length);
			var i=searchResult.length;
   			searchResult.forEach(function(item, i, searchResult) { console.log( searchResult[i].name );});
                        console.log('search result:', searchResult[1].name);
                });
        }
        else {
                throw "Login failed :(";
        }
});


