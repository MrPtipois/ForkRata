/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class ratasenlasparedesNpcSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
      console.log('error1');
    return mergeObject(super.defaultOptions, {
      classes: ["ratasenlasparedes", "sheet", "actor", "npc"],
      //template: "systems/ratasenlasparedes/templates/actor/npc-sheet.html",
      width: 600,
      height: 600,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
    });
  }

  get template() {
        // Later you might want to return a different template
        // based on user permissions.
        if (!game.user.isGM && this.actor.limited)
            return 'systems/ratasenlasparedes/templates/actor/limited-sheet.html';
        return 'systems/ratasenlasparedes/templates/actor/npc-sheet.html';
    }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    const data = super.getData();
    data.dtypes = ["String", "Number", "Boolean"];

    // Prepare items.
    if (this.actor.data.type == 'character') {
      //////this._prepareCharacterItems(data);
    }

    return data;
  }
  



  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    // Add Inventory Item
    html.find('.item-create').click(this._onItemCreate.bind(this));

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



}
