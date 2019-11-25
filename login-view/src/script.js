var AWS = require('aws-sdk')
var AWSCognito = require('amazon-cognito-identity-js');
var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
var poolData = {
  UserPoolId: 'us-east-1_ibYDmzY8b',
  ClientId: '1alp6a20v4emq85m529sennfsg'
};
var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
// var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);

window.signUp = function (username, password,){
  var attributeList = [];

  var dataEmail = {
    Name: 'email',
    Value: email
  }

  var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
  console.log(attributeEmail);
  var attributeName = new AmazonCognitoIdentity.CognitoUserAttribute(dataName);
  console.log(attributeName);

  attributeList.push(attributeEmail);
  attributeList.push(attributeName);
  
 userPool.signUp(username, password, attributeList, null, function(err, result){
    if(err){
      alert(err);
      return;
    }
    var cognitoUser = result.user;
    console.log('user name is '  + cognitoUser.getUsername());
  });
}

window.confirmUser = function (code, user){
  user.confirmRegistration(code, true, function(err, result){
    if (err){
      alert(err);
      return;
    }
    console.console.log('call result: ' + result);
  });
}
