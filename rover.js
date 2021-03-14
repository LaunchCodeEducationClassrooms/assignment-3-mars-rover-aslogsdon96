class Rover {
  constructor(position) {
     this.completed = true;
     this.position = position;
     this.mode = 'NORMAL';
     this.generatorWatts = 110;
   }

   receiveMessage(messageObj) {
     let modeChange = {};
     let moveChange = {};
     let response = {
       message: messageObj.name,
       results: []
     };
    
     let commandBlockRaw = messageObj.commands;
     let commandBlock;

     if (commandBlockRaw.length === undefined) {
       commandBlock = [];
       commandBlock.push(commandBlockRaw);
     } else {
       commandBlock = commandBlockRaw;
     }

     for (let b = 0; b < commandBlock.length; b++) {
       let commandBlockTest = commandBlock[b];
        for (let k in commandBlockTest) {
          if (commandBlockTest[k] === 'STATUS_CHECK') {
            let roverStatus = {
            mode: this.mode,
            generatorWatts: this.generatorWatts,
            position: this.position
            };
            let statusCheck = {
            completed: true,
            roverStatus: roverStatus
            };
           response.results.push(statusCheck);
          };
        }

        for (let m in commandBlockTest) {
          if (commandBlockTest[m] === 'MODE_CHANGE') {
           for (let n in commandBlockTest) {
             if (commandBlockTest[n] === 'LOW_POWER') {
             this.mode = 'LOW_POWER';
             modeChange = {
                completed: true
              };
            } else if (commandBlockTest[n] === 'NORMAL') {
              this.mode = 'NORMAL';
              modeChange = {
               completed: true
             };
            } else {
             modeChange = {
                completed: false
              };
           }
           }
            response.results.push(modeChange);
         } 
        }

       for (let i in commandBlockTest) {
         if (commandBlockTest[i] === 'MOVE') {
            for (let j in commandBlockTest) {
             if (this.mode === 'NORMAL') {
                this.position = commandBlockTest[j];
                moveChange = {
                  completed: true
           };
           } else {
            moveChange = {
             completed: false
           };
           }
           }
         response.results.push(moveChange);
         }
       }
     }
       return response;
   }
};

module.exports = Rover;