





  // function dbEmpty(){
  //   var x;
  //   Meteor.call('dbEmpty', function(e, r){return r;console.log(r + ":");});

  // }


Meteor.startup(function(){


  Meteor.subscribe('userData');
  Meteor.subscribe('dbi');
  Meteor.subscribe('dbm');


    Session.set('empty', false);
    Session.set('name', "Flume");



    Meteor.call('getTabs', function(e, r){


      Session.set('tabs', r);
      console.log(r);

      for(i in r){
        var bn = r[i] + 'bool';
        if(r[i] == 'Home')
        Session.set(bn, true);
        else
        Session.set(bn, false);


        console.log('bn: ' + bn)


        // Handlebars.registerHelper(bn + 'e',function(){
        //   console.log(r[i] + 'bool : handle' + ":" + bn)
        //   return Session.get(bn);
        // });

      }
      // Handlebars.registerHelper('Homeboole', function(){
      //   return Session.get('Homebool');
      // })

      Handlebars.registerHelper('test', function(a){
        return Session.get(a + 'bool');
      });

    });



    Meteor.call('dbEmpty', function(e, r){

      Session.set('empty', r);
      console.log(r + ":" + getPerms());
      Template.setup.editDB;
      return r && getPerms() == -1;
      // console.log(r + ":" + getPerms());
    });

    // Session.set('tabs', tempInfo);


});

Meteor.methods({
  uc: function(){
    console.log("Asdfrag" + users());
    alert(users());
    return users();
    // if(dbi.Name)
    //  return dbi.Name;
  }
  });


Handlebars.registerHelper('username', function () {
    var user = Meteor.user();
    if (_.isUndefined(user) || _.isNull(user)) {
        return false;
    }
    return user.username;
});

Handlebars.registerHelper('page', function(a){
    console.log(Session.get(a));
    console.log(a);
    return Session.get(a);

});


Handlebars.registerHelper('isAdmin', function () {
    var user = Meteor.user();
    if (_.isUndefined(user) || _.isNull(user)) {
      return false;
    }
    if(user.perms == -1)
      return true;
    return false;
});


Handlebars.registerHelper('dbName', function () {
    Meteor.call('getDBName', function(e, r){
      Session.set('name', r);
      return Session.get('name');
    });
      return Session.get('name');
  });

Handlebars.registerHelper('users', function () {
    return users();

  });



  function dbEmpty(){
      console.log(Session.get('empty') + ":" + getPerms());

      return Session.get('empty') && getPerms() == -1;
  }

  function getPerms(){
    return Meteor.user().perms;
  }

  function users(){
    return Meteor.users.find({}).count();
  }

  function switchTabs(templateName){
    var t = Session.get('tabs');
    for(i in t)
    {
      console.log(t[i] + ":" + templateName);
      console.log(t[i] + ":" + (t[i] == templateName) + " switch")
      if(t[i] == templateName)
        Session.set(t[i] + 'bool', true);
      else
        Session.set(t[i] + 'bool', false);
    }
  }



  Template.navbar.show = function(){

    var ret = "<div class='pure-menu pure-menu-open pure-menu-horizontal'><a href='#' class='pure-menu-heading' id='dbin'>" + Session.get('name') + "</a><ul>";
    var t = Session.get('tabs');
    for(i in t){
      ret+="<li id='aa'><a href=" /*todo*/ + "'#' class='tabSwitch' id='" + t[i] + "'>" + t[i] + "</a></li>";
    }
    ret+="</ul></div>";
    console.log(ret);

    return ret;
        // <li class='pure-menu-selected'><a href='#'>Home</a></li>


  }



  Template.welcome.greeting = function () {
    return "Welcome to Flume.";
  };

  Template.accountData.perms = function(){
    return Meteor.user().perms;
  }

  Template.accountData.name = function(){
    return Meteor.user().username;
  }


  Template.setup.editDB = function(){
    // console.log("GP: " + getPerms() + ":" + "DBF" + dbEmpty());
    // return (getPerms() == -1 && dbEmpty());
    return dbEmpty();
  }


  Template.navbar.tabs = function(){
    return Session.get('tabs');
  }


  Template.welcome.events({
    'click input' : function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });

  Template.navbar.events({
      'click .tabSwitch' : function(e, t){
        // console.log(this == $(this)[0]);
        // console.log($(this)[0].id);
        // console.log(this.id);
        // console.log(t.find(this))
        console.log(e.currentTarget.id + "Current");
        switchTabs(e.currentTarget.id);
      }
  });

  Template.setup.events({
    'click #send' : function () {
      // template data, if any, is available in 'this'
      console.log('a');
      Session.set('name', $('#dbn').val());      
      $('#dbin').text(Session.get('name'));
      Meteor.call('setDBName', $('#dbn').val(), function(e, r){
      console.log(r);
      Session.set('empty', false);
      console.log("Done");

    });
  }
});  

Accounts.ui.config({

  passwordSignupFields: 'USERNAME_AND_EMAIL'

});
