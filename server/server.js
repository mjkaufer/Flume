dbi = new Meteor.Collection("dbi");
//Structure {Name:_}
dbd = new Meteor.Collection("dbd"); //Will contain database data. To be determined based on structure of CMS
dbm = new Meteor.Collection("dbm");//Database menu header things, {Name:_}

dbm.insert({Name:"Home", Template:"home"});



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