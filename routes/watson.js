var express = require('express');
var router = express.Router();
var auth = require('../auth');
var watson = require('watson-developer-cloud');
//Give it the credentials from your auth file
var conversation = watson.conversation(auth.watson.conversation);


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Watson Conversation' });
});


// Create a post api route to get a user information
// connect with Watson and return an answer from the IBM conversation service
router.post('/watson', function(req, res) {

var spoken = req.body;
console.log(spoken);

conversation.message({
'input' : req.body.input,
'context' : req.body.context,
'workspace_id': auth.watson.conversation.workspace_id
},

function(err, response)
{
if(err)
{
console.log('error:',err);
}
else
{
console.log(response.output.text);
// We then display the JSON to the users
  res.json(response);
}
});



});

module.exports = router;