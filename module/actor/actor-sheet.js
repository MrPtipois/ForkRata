/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class ratasenlasparedesActorSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["ratasenlasparedes", "sheet", "actor"],
      template: "systems/ratasenlasparedes/templates/actor/actor-sheet.html",
      width: 600,
      height: 600,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
    });
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    const data = super.getData();
    data.dtypes = ["String", "Number", "Boolean"];
    for (let attr of Object.values(data.data.attributes)) {
      attr.isCheckbox = attr.dtype === "Boolean";
    }

    // Prepare items.
    if (this.actor.data.type == 'character') {
      this._prepareCharacterItems(data);
    }

    return data;
  }
  



  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    // Add Inventory Item
    //html.find('.item-create').click(this._onItemCreate.bind(this));
    html.find('.item-create').click(ev => this._onCreate(ev));
    
    // Update Inventory Item
    html.find('.item-edit').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.getOwnedItem(li.data("itemId"));
      item.sheet.render(true);
    });

    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      this.actor.deleteOwnedItem(li.data("itemId"));
      li.slideUp(200, () => this.render(false));
    });

    // Rollable abilities.
    html.find('.rollable').click(this._onRoll.bind(this));
    
    // profesion show.
    html.find('.profesion').click( ev => {
     const profesion = this.actor.data.items.find(i => i.type == "profesion");
     if(profesion){
         const item = this.actor.getOwnedItem(profesion._id);
         item.sheet.render(true);
     }
    });
    // profesion show.
    html.find('.reputation').click( ev => {
     const reputation = this.actor.data.items.find(i => i.type == "reputation");
     if(reputation){
         const item = this.actor.getOwnedItem(reputation._id);
         item.sheet.render(true);
     }
    });
    
  }

  /* -------------------------------------------- */

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
  _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    // Get the type of item to create.
    const type = header.dataset.type;
    // Grab any data associated with this control.
    const data = duplicate(header.dataset);
    // Initialize a default name.
    const name = `New ${type.capitalize()}`;
    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      data: data
    };
    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.data["type"];

    // Finally, create the item!
    return this.actor.createOwnedItem(itemData);
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  _onRoll(event) {
    event.preventDefault();
    console.log(event.currentTarget);
    const element = event.currentTarget;
    const dataset = element.dataset;
    const rollType = dataset.rollType;
    let difficulty = ["0", ""];
    let rollString = "";
    
      if (event.ctrlKey)
        //alert('Ctrl down');
        difficulty = ["-2", "difícil"];
        
      if (event.shiftKey)
        //alert('Alt down');
        difficulty = ["+2", "fácil"];
    
    
    if (rollType == "ability"){
        if (dataset.roll) {
            if (difficulty[0] != "0") {
                rollString = dataset.roll + ' ' + difficulty[0];
            }else{
                rollString = dataset.roll;
            }
            let roll = new Roll(rollString, this.actor.data.data);
            let label = dataset.label ? `Realiza una tirada ${difficulty[1]} de ${dataset.label}` : '';
            roll.roll().toMessage({
                speaker: ChatMessage.getSpeaker({ actor: this.actor }),
                flavor: label
            });
        }
    }
    
    if (rollType == "weapon") {
        let difficultyString = "";
        if (dataset.roll) {
            if (difficulty[0] != "0") {
                rollString = dataset.roll + ' ' + difficulty[0];
                difficultyString = ` en una situación ${difficulty[1]}`;
            }else{
                rollString = dataset.roll;
            }
            let roll = new Roll(rollString, this.actor.data.data);
            let damageRoll = new Roll(dataset.damage, this.actor.data.data);
            let label = dataset.label ? `Usa su ${dataset.label} ${difficultyString}.` : '';
            let attackResult = roll.roll();
            let damageResult = damageRoll.roll();
            let showDamage = false;
            console.log (attackResult._total);
            
            if (attackResult._total <= 7){
                label += ` Falla y sufre dos <a class="entity-link" draggable="true" data-entity="JournalEntry" data-id="1WWvPB8D9WDiEn5Q"><i class="fas fa-book-open"></i> Consecuencias</a>.`;
            } else if (attackResult._total <= 9){
                label += ` Acierta, pero sufre una <a class="entity-link" draggable="true" data-entity="JournalEntry" data-id="1WWvPB8D9WDiEn5Q"><i class="fas fa-book-open"></i> Consecuencia</a>.`;
                showDamage = true;
            } else if (attackResult._total <= 11){
                label += ` Acierta y elige una <a class="entity-link" draggable="true" data-entity="JournalEntry" data-id="1WWvPB8D9WDiEn5Q"><i class="fas fa-book-open"></i> Consecuencia</a> para su objetivo.`;
                showDamage = true;
            } else {
                label += ` Acierta y elige dos <a class="entity-link" draggable="true" data-entity="JournalEntry" data-id="1WWvPB8D9WDiEn5Q"><i class="fas fa-book-open"></i> Consecuencias</a> para su objetvo.`;
                showDamage = true;
            }
            
                attackResult.toMessage({
                    speaker: ChatMessage.getSpeaker({ actor: this.actor }),
                    flavor: label
                });
                
                if (showDamage) {
                    damageResult.toMessage({
                        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
                        flavor: 'Daño'
                    });
                }
        }
    }

    
  }
  
  /**
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  _prepareCharacterItems(sheetData) {
    const actorData = sheetData.actor;

    // Initialize containers.
    const gear = [];
    const profesion = [];
    const reputation = [];
    const weapon = [];
    const scar = [];
    const mean = [];
    const spell = [];

    // Iterate through items, allocating to containers
    // let totalWeight = 0;
    for (let i of sheetData.items) {
      let item = i.data;
      i.img = i.img || DEFAULT_TOKEN;
      // Append to gear.
      if (i.type === 'item') {
        gear.push(i);
      }
      // Append to profesion.
      else if (i.type === 'profesion') {
        profesion.push(i);
      }
      // Append to reputation.
      else if (i.type === 'reputation') {
        reputation.push(i);
      }
      // Append to weapons.
      else if (i.type === 'weapon') {
        weapon.push(i);
      }
      // Append to scar.
      else if (i.type === 'scar') {
        scar.push(i);
      }
      // Append to mean.
      else if (i.type === 'mean') {
        mean.push(i);
      }
      // Append to spell.
      else if (i.type === 'spell') {
        spell.push(i);
      }
    }

    // Assign and return
    actorData.gear = gear;
    actorData.profesion = profesion;
    actorData.reputation = reputation;
    actorData.weapon = weapon;
    actorData.scar = scar;
    actorData.mean = mean;
    actorData.spell = spell;
  }

}
