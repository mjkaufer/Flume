





  // function dbEmpty(){
  //   var x;
  //   Meteor.call('dbEmpty', function(e, r){return r;console.log(r + ":");});

  // }
SessionAmplify = _.extend({}, Session, {
  keys: _.object(_.map(amplify.store(), function(value, key) {
    return [key, JSON.stringify(value)]
  })),
  set: function (key, value) {
    Session.set.apply(this, arguments);
    amplify.store(key, value);
  },
});//for permanent sessions




Meteor.startup(function(){


  Meteor.subscribe('userData');
  // Meteor.subscribe('dbi');
  // Meteor.subscribe('dbm');





    Session.set('empty', false);
    Session.set('name', "Flume");
    Session.set('userL', '');
    // switchTabs('Home');

    Meteor.call('getTabs', function(e, r){


      Session.set('tabs', r);
      console.log(r);


    });



    Meteor.call('dbEmpty', function(e, r){

      Session.set('empty', r);
      console.log(r + ":" + getPerms());
      Template.setup.editDB;
      return r && getPerms() <= -1;
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
    if(user.perms <= -1)
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

      return Session.get('empty') && getPerms() <= -1;
  }

  function getPerms(){
    return Meteor.user().perms;
  }

  function users(){
    return Meteor.users.find({}).count();
  }

  function switchTabs(templateName){

    var fragment = Meteor.render( function() {
      return Template[ templateName ]();
    });
    $('#pageContent').html(fragment);
    console.log("Frag: " + fragment);
  }



  Template.navbar.show = function(){

    var ret = "<div class='pure-menu pure-menu-open pure-menu-horizontal navbar'><a href='#' class='pure-menu-heading' id='dbin'>" + Session.get('name') + "</a><ul>";
    ret+="<li id='aa'><a class='tabSwitch' id='Home'>Home</a></li>";    
    ret+="<li id='aa'><a class='tabSwitch' id='Users'>Users</a></li>";    

    var t = Session.get('tabs');
    for(i in t){
      ret+="<li id='aa'><a class='tabSwitch' id='" + t[i] + "'>" + t[i] + "</a></li>";
    }
    if(Meteor.user()!=null)
    if(getPerms()<=-1)
      ret+="<li id='aa' class='adminNav'><a class='tabSwitch adminNav' id='Admin'>Admin</a></li>";
    ret+="</ul></div>";
    console.log(ret);

    return ret;
        // <li class='pure-menu-selected'><a href='#'>Home</a></li>


  }

  // Template.page.load = function(){
  // }

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
    // return (getPerms() <= -1 && dbEmpty());
    return dbEmpty();
  }


  Template.navbar.tabs = function(){
    return Session.get('tabs');
  }


  Template.Users.listUsers = function(){

    Meteor.call('lu', Meteor.user(), function(e, r){
      console.log(r);
      Session.set('userL', r);
      return Session.get('userL');

    });
    return Session.get('userL');

  }

  Template.Users.events({
      'click .makeAdmin' : function(e, t){
        console.log(e.currentTarget.id + "Current");
        var un = e.currentTarget.id;
        Meteor.call('promoteUser', un, Meteor.user(), function(e, r){
          console.log(r);
        })
      },
      'click .removeAdmin' : function(e, t){
        console.log(e.currentTarget.id + "Current");
        var un = e.currentTarget.id;
        Meteor.call('demoteUser', un, Meteor.user(), function(e, r){
          console.log(r);
        })
      }      
  });


  Template.welcome.events({
    'click input' : function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });

  Template.Admin.events({
    'click #subNew' : function () {

      if(getPerms() <= -1 && $('#newTemp').val() && $('#newTemp').val() != ''){
        var submit = $('#newTemp').val().trim();
        Meteor.call('addNav', submit, Meteor.user(), function(e, r){
          console.log('You added the menu ' + r);

          Meteor.call('writeTemplate', r, 'Nothing here yet.', Meteor.user(), function(e, r){
            console.log(r);
          });
        });
        $('#newTemp').val("");        

      }
    },
    'click #subRem' : function () {

      if(getPerms() <= -1 && $('#remTemp').val() && $('#remTemp').val() != ''){
        var submit = $('#remTemp').val().trim();
        Meteor.call('remNav', submit, Meteor.user(), function(e, r){
          console.log('You removed the menu ' + r);
        });
        $('#remTemp').val("");        


      }
    },
    'click #subEdit' : function () {

      if(getPerms() <= -1 && $('#editTempName').val() && $('#editTempName').val() != '' && $('#editTempData').val() && $('#editTempData').val() != ''){
        var submit = $('#editTempData').val().trim();
        var submitName = $('#editTempName').val().trim();
        Meteor.call('writeTemplate', submitName, submit, Meteor.user(), function(e, r){
          console.log('You edited the menu ' + r);
        });
        $('#editTempData').val("");    
        $('#editTempName').val("");        
      }
    },
    'click #editGetTemp' : function () {

      if(getPerms() <= -1 && $('#editTempName').val() && $('#editTempName').val() != ''){
        var submitName = $('#editTempName').val().trim();
        console.log(submitName + "EDITGETTEMP");
        Meteor.call('retTemplate', submitName, Meteor.user(), function(e, r){
          console.log(r);
          $('#editTempData').val(r);
        });
      }
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
