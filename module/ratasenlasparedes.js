// Import Modules
import { ratasenlasparedesActor } from "./actor/actor.js";
import { ratasenlasparedesActorSheet } from "./actor/actor-sheet.js";
import { ratasenlasparedesNpcSheet } from "./actor/npc-sheet.js";
import { ratasenlasparedesItem } from "./item/item.js";
import { ratasenlasparedesItemSheet } from "./item/item-sheet.js";


Hooks.once('setup', async function() {
  CONFIG.ChatMessage.template = "systems/ratasenlasparedes/templates/chat/chat-message.html";
  CONFIG.Dice.template = "systems/ratasenlasparedes/templates/dice/roll.html";
  CONFIG.Dice.tooltip = "systems/ratasenlasparedes/templates/dice/tooltip.html";
  Roll.CHAT_TEMPLATE = "systems/ratasenlasparedes/templates/dice/roll.html"
  Roll.TOOLTIP_TEMPLATE = "systems/ratasenlasparedes/templates/dice/tooltip.html"
});

Hooks.once('init', async function() {

  game.ratasenlasparedes = {
    ratasenlasparedesActor,
    ratasenlasparedesItem
  };

  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "1d6",
    decimals: 2
  };
  
  // Define chat templateData
  CONFIG.ChatMessage.template = "systems/ratasenlasparedes/templates/chat/chat-message.html";
  CONFIG.Dice.template = "systems/ratasenlasparedes/templates/dice/roll.html";
  CONFIG.Dice.tooltip = "systems/ratasenlasparedes/templates/dice/tooltip.html";
  // Define custom Entity classes
  CONFIG.Actor.entityClass = ratasenlasparedesActor;
  CONFIG.Item.entityClass = ratasenlasparedesItem;

  // Register sheet application classes
  Actors.registerSheet("ratasenlasparedes", ratasenlasparedesActorSheet, { 
      types: ['character'], 
      makeDefault: true 
    });
  Actors.registerSheet("ratasenlasparedes", ratasenlasparedesNpcSheet, { 
      types: ['npc'], 
      makeDefault: true
    });  
  Actors.unregisterSheet("core", ActorSheet);
  
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("ratasenlasparedes", ratasenlasparedesItemSheet, { makeDefault: true });
  
  document.getElementById("logo").src="/systems/ratasenlasparedes/img/thp.png";
    
  // If you need to add Handlebars helpers, here are a few useful examples:
  Handlebars.registerHelper('concat', function() {
    var outStr = '';
    for (var arg in arguments) {
      if (typeof arguments[arg] != 'object') {
        outStr += arguments[arg];
      }
    }
    return outStr;
  });

  Handlebars.registerHelper('toLowerCase', function(str) {
    return str.toLowerCase();
  });
});

Handlebars.registerHelper('json', function(context) {
    return JSON.stringify(context);
});

Hooks.on('createOwnedItem', (actor, item) => {
    //console.log(actor);
    //console.log(item);
    let profesions = actor.data.items.filter(i => i.type == "profesion");
    let reputations = actor.data.items.filter(i => i.type == "reputation");
    console.log(profesions);
    if(item.type == "profesion" && profesions.length>1){
        actor.deleteOwnedItem(profesions[0]._id);
    }
    if(item.type == "reputation" && reputations.length>1){
        actor.deleteOwnedItem(reputations[0]._id);
    }
});

Hooks.on("preCreateScene", (createData, options, userID) => {
    createData.backgroundColor = '#000000';
})


/* hide ui elements on logo click */
Hooks.on('ready', () => {
    $('#logo').click(ev => {
        window.hideUI = !window.hideUI;
        if (window.hideUI) {
            $('#sidebar').hide();
            $('#navigation').hide();
            $('#controls').hide();
            $('#players').hide();
            $('#hotbar').hide();
        } else {
            $('#sidebar').show();
            $('#navigation').show();
            $('#controls').show();
            $('#players').show();
            $('#hotbar').show();
        }
    });
    
    $('#chat-controls .fa-dice-d20').addClass("fa-dice-d6");
    $('#chat-controls .fa-dice-d20').removeClass("fa-dice-d20");
    
    

    $(document).on('click', '#chat-controls .fa-dice-d6', ev => {
        const dialogOptions = {
            width: 420,
            top: event.clientY - 80,
            left: window.innerWidth - 710,
            classes: ['dialog', 'ratas-dice-roller'],
        };
        let templateData = {
            title: 'Lanzador',
            rollClass: 'ratas-simple-roller-roll',
        };
        // Render the modal.
      renderTemplate('systems/ratasenlasparedes/templates/roller.html', templateData).then(dlg => {
        let dialogRoller = new Dialog({
          title: 'Lanzador',
          content: dlg,
          buttons: {
//             close: {
//               label: 'd3-3',
//               callback: () => console.log("Cerrado ratas-simple-dice-roller")
//             }
          }
        }, dialogOptions);
        console.log(dialogRoller);
        dialogRoller.render(true);
      });  
    });
    
    $(document).on('click', '.ratas-simple-roller-roll', ev => {
        let roll = new Roll(String($(ev.currentTarget).data('formula')));
        roll.roll();
        roll.toMessage();
    });
    
    $(document).on('click', '.ratas-sanity-check', ev => {
        let roll = new Roll(String($(ev.currentTarget).data('formula')));
        let actorId = String($(ev.currentTarget).data('actor-id'));
        roll.roll();
        roll.toMessage();
        console.log(game.actors.get(actorId).data.data.pc.value);
        let pcMinus = game.actors.get(actorId).data.data.pc.value - roll._total;
        (pcMinus < 0) ? pcMinus = 0 : pcMinus = pcMinus;
        game.actors.get(actorId).update({_id: actorId, 'data.pc.value': pcMinus});
    });
    
});

Hooks.on('renderSceneNavigation', (app,html) => {
    if (window.hideUI) {
        html.hide();
    }
});

Hooks.on('renderSceneControls', (app, html) => {
    if (window.hideUI) {
        html.hide();
    }
});

Hooks.on('renderSidebarTab', (app, html) => {
    if (window.hideUI) {
        html.hide();
    }
});

Hooks.on('renderCombatTracker', (app, html) => {
    if (window.hideUI) {
        html.hide();
    }
});


//Chat Messages
Hooks.on("createChatMessage", async (chatMSG, flags, userId) => {

    
    
//         chatMSG.setFlag("ratasenlasparedes", "actorImg", "/manuel.jpg");
     console.log(chatMSG);
//     let linear = chatMSG._roll.parts.filter((part) => part.rolls !== undefined).map(part => part.rolls.reduce(function(a, rolls){a.push(rolls.roll); return a;}, []));
     
     let linearDices = [];
     let linearMods = [];
     
     
     let fvttVersion = game.data.version;
     
     if (fvttVersion.startsWith("0.6.")) {
        //FVTT 0.6.X
        chatMSG._roll.parts.forEach(
            function(part){
                if (part.rolls !== undefined){
                    part.rolls.forEach(roll => linearDices.push(roll.roll));
                }else{
                    linearMods.push(part);
                }
            }
        );
     }else{
         //FVTT 0.7.x
        chatMSG._roll.terms.forEach(
            function(term){
                if (term.results !== undefined){
                    term.results.forEach(result => linearDices.push(result.result));
                }else{
                    linearMods.push(term);
                }
            }
        );
     }

     

    let linearRoll = linearDices.join(' + ') + ' ' + linearMods.join(' ');
    
    


    let actor = game.actors.entries.find(actor => actor._id == chatMSG.data.speaker.actor);
    chatMSG.setFlag("ratasenlasparedes", "profileImg", actor ? actor.data.img : game.user.avatar);
    chatMSG.setFlag("ratasenlasparedes", "detail", linearRoll);
//     console.log(actor);
    
    let messageId = chatMSG.data._id;
    let msg = game.messages.get(messageId);
    let msgIndex = game.messages.entities.indexOf(msg);
    
    if (chatMSG.isRoll && chatMSG.isContentVisible) {
      let rollData = {
            //flavor: ChatMSG.getFlag('ratasenlasparedes', 'text'),
            formula: chatMSG._roll.formula,
            username: game.user.name,
        };
        console.log(rollData);
    }


});


