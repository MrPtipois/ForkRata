// Import Modules
import { ratasenlasparedesActor } from "./actor/actor.js";
import { ratasenlasparedesActorSheet } from "./actor/actor-sheet.js";
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
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("ratasenlasparedes", ratasenlasparedesActorSheet, { makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("ratasenlasparedes", ratasenlasparedesItemSheet, { makeDefault: true });

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
