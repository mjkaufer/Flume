

dbi = new Meteor.Collection("dbi");
//Structure {Name:_}
dbd = new Meteor.Collection("dbd"); //Will contain database data. To be determined based on structure of CMS
dbm = new Meteor.Collection("dbm");//Database menu header things, {Name:_}






Meteor.methods({

	dbEmpty: function(){
	  return dbi.find({}).count() == 0;
	},
	setDBName: function(n){
  	if(dbi.find({}).count() != 0)
  		return;
  	dbi.insert({Name: n});
  	console.log(dbi.find({Name:n}));

  }, getDBName: function(){
  	if(dbi.find({}).count() > 0)
  		return dbi.findOne({}).Name;
  }, getTabs: function(){

  	var ret = new Array();

  	dbm.find({}).forEach(function(a){
  		ret.push(a.Name);
  	});
  	return ret;
  }, writeTemplate: function(templateName, input, user){

  	if(user.perms != -1){
  		console.log('not an admin');
  		return;
  	}
	var fs = Npm.require('fs');
	var templateInput = "<template name='" + templateName + "'>\n" + input + "\n</template>";
    fs.writeFile("./../../../../../client/" + templateName + ".html", templateInput, function(err) {
    if(err){
        console.log(err + ":ABCDEFG");
        return "ERROR!!!!!";
    }
    else{
        console.log("The template " + templateName + " was saved!");

        return "It is done";
    }

    // fs.readFile("./../../../../../server/test.txt",{encoding: 'utf8'}, function(err, data){
    // 	if(err)throw err;
    // 	console.log(data);
    // });

    }); 


  }, addNav: function(navName, user){
  	if(user.perms != -1)
  		return;
  	dbm.insert({Name: navName});
  	return navName;
  }, remNav: function(navName, user){
  	if(user.perms != -1)
  		return;
  	dbm.remove({Name: navName});
  	return navName;
  }, retTemplate: function(templateName, user){

  	if(user.perms != -1){
  		console.log('not an admin');
  		return;
  	}
 	
  	var Future = Npm.require('fibers/future');
  	var fut = new Future();

	var fs = Npm.require('fs');
	var ret;
    fs.readFile("./../../../../../client/" + templateName + ".html",{encoding: 'utf8'}, function(err, data) {

    if(err){
        console.log(err + ":ABCDEFG");
        return "ERROR!!!!!";
    }
    	console.log('a');
    	console.log(templateName + ".html");
    	console.log(data + "");
    	console.log(data);
    	 // var firstTemp = "<template name='" + templateName + "'>";
      //    data = data.substr(firstTemp.length, data.length - 11);//11 is the charcount of </template>
      	data = data.replace("<template name='" + templateName + "'>", "");
      	data = data.replace("</template>", "");
        fut['return'](data);

    }); 

    console.log(ret);
    console.log("ret above");
    console.log(!ret || ret == null || ret == 'undefined' || ret==undefined);
    return fut.wait();
    // while(!ret || ret == null || ret == 'undefined' || ret==undefined){
    // 	setTimeout(function(){console.log('waiting');}, 10);
    // }
    // return ret;    
  }

 //  getUserData: function(){
	// return Meteor.users.find({_id: this.userId});  	
 //  },
 //  getPerms: function(){
 //  	Meteor.call('getUserData', function(e, r){
 //  		return r.perms;
 //  	});
 //  }  
});




Meteor.publish("userData", function () {
  return Meteor.users.find({_id: this.userId});
});	

  Accounts.onCreateUser(function(options, user) {

		var r = Meteor.users.find({}).count();
      if(r == 0)
      {
      	console.log('admin');
      	user.perms = -1;
      }
      else{
      console.log('normal');
      user.perms = 0;
  	  }
	  if (options.profile)
	    user.profile = options.profile;
	  return user;    	  




  });


  // We still want the default hook's 'profile' behavior.