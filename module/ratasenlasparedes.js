// Import Modules
import { ratasenlasparedesActor } from "./actor/actor.js";
import { ratasenlasparedesActorSheet } from "./actor/actor-sheet.js";
import { ratasenlasparedesNpcSheet } from "./actor/npc-sheet.js";
import { ratasenlasparedesItem } from "./item/item.js";
import { ratasenlasparedesItemSheet } from "./item/item-sheet.js";

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
