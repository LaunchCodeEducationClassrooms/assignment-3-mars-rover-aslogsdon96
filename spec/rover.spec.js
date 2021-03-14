const Rover = require('../rover.js');
const Message = require('../message.js');
const Command = require('../command.js');

// NOTE: If at any time, you want to focus on the output from a single test, feel free to comment out all the others.
//       However, do NOT edit the grading tests for any reason and make sure to un-comment out your code to get the autograder to pass.


describe("Rover class", function() {

  it ("constructor sets position and default values for mode and generatorWatts", function(){
    let rover = new Rover(98382);
    expect(rover.mode).toEqual('NORMAL');
    expect(rover.generatorWatts).toEqual(110);
  });

  it ("response returned by receiveMessage contains name of message", function(){
    let rover = new Rover(98382);
    let command = new Command('STATUS_CHECK');
    let message = new Message('Status Check', command);
    let response = rover.receiveMessage(message).message;
    expect(response).toContain('Status Check');
  });

  it("response returned by recieveMessage includes two results if two commands are sent to the message", function(){
    let rover = new Rover(98382);
    let commands = [
      new Command('MOVE', 4321),
      new Command('STATUS_CHECK')
    ];
    let message = new Message('Test message with two commands', commands)
    let response = rover.receiveMessage(message).message;
    expect(response).toContain('Test message with two commands');
  });

  it("responds correctly to status check command", function(){
    let rover = new Rover(98382);
    let command = new Command('STATUS_CHECK');
    let message = new Message('Status Check', command);
    let response = rover.receiveMessage(message);
    expect(response).toEqual({
      message: 'Status Check',
      results: [{completed: true, roverStatus: { mode: 'NORMAL', generatorWatts: 110, position: 98382 }}]
      });
  });

  it("responds correctly to mode change command", function() {
    let rover = new Rover(98382);
    let command = new Command('MODE_CHANGE','LOW_POWER');
    let message = new Message('Mode Change', command);
    let response = rover.receiveMessage(message);
    expect(response).toEqual({
      message: 'Mode Change', 
      results: [ { completed: true } ]});
  });

  it("responds with false completed value when attempting to move in LOW_POWER mode", function () {
    let rover = new Rover(98382);
    let command = new Command('MOVE');
    let message = new Message('Move', command);
    rover.mode = 'LOW_POWER';
    let response = rover.receiveMessage(message).results;
    expect(response).toContain(({completed: false}));
  });

  it("responds with position for move command", function() {
    let rover = new Rover(98382);
    let command = new Command('MOVE',10000);
    let message = new Message('Move', command);
    rover.mode = 'NORMAL';
    let response = rover.receiveMessage(message);
    expect(rover.position).toBe(10000);
  })

})
