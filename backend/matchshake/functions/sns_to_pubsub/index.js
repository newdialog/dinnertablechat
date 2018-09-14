// const _ = require('lodash');
/*
console.log('starting function')
exports.handle = function(e, ctx, cb) {
  console.log('processing event: %j', e)
  cb(null, { hello: 'world' })
}
*/

// var AWS = require('aws-sdk');
// Set the region 
// AWS.config.update({region: 'us-east-1'});

import Pubsub from '@aws-amplify/pubsub';
import { AWSIoTProvider } from '@aws-amplify/pubsub/lib/Providers';
// import { AWSIoTProvider } from 'aws-amplify/lib/PubSub/Providers';
Pubsub.configure(new AWSIoTProvider ({
  aws_pubsub_region: 'us-east-1',
  aws_pubsub_endpoint: 'wss://a23rmqrj31k0l4-ats.iot.us-east-1.amazonaws.com/mqtt',
}));

console.log('Loading function');
 
exports.handle = function(event, context, callback) {
// console.log('Received event:', JSON.stringify(event, null, 4));
    console.log('event.Records', event.Records.length);
    var message = JSON.parse(event.Records[0].Sns.Message);
    var tickets = message.detail.tickets;
    var type = message.detail.type;
    var accepted = type === 'PotentialMatchCreated';
    if(accepted) {

    }
    console.log('Message received from SNS:', message.length, message); 
    console.log(type, accepted, 'tickets', tickets)
    callback(null, "Success");
};
