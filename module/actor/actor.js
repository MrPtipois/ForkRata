/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class ratasenlasparedesActor extends Actor {

  /**
   * Augment the basic actor data with additional dynamic data.
   */
  prepareData() {
    super.prepareData();

    const actorData = this.data;
    const data = actorData.data;
    const flags = actorData.flags;

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    if (actorData.type === 'character') this._prepareCharacterData(actorData);
  }
   /* -------------------------------------------- */
    /*  Socket Listeners and Handlers
    /* -------------------------------------------- */
    /** @override */
    static async create(data, options = {}) {
        let link = true;
        if (data.type === 'npc') {
            link = false;
        }
        data.token = data.token || {};
        mergeObject(data.token, {
            vision: true,
            dimSight: 30,
            brightSight: 0,
            actorLink: link,
            disposition: 1,
        });
        return super.create(data, options);
    }

  /**
   * Prepare Character type specific data 
   */
  _prepareCharacterData(actorData) {
    const data = actorData.data;
    
    // Make modifications to data here
    
    
    let profesions = actorData.items.filter(i => i.type == "profesion");
    if (profesions.length>0) data.profesion = profesions[0].name;
    let reputations = actorData.items.filter(i => i.type == "reputation");
    if (reputations.length>0) data.reputation = reputations[0].name;
    
    let spells = actorData.items.filter(i => i.type == "spell");
    if (spells.length > 0 && this.getFlag("ratasenlasparedes", "hasSpells")!=true){
        this.setFlag("ratasenlasparedes", "hasSpells", true);
    }else if (spells.length <= 0 && this.getFlag("ratasenlasparedes", "hasSpells")) {
        this.unsetFlag("ratasenlasparedes", "hasSpells", false);
    }
    
    
    data.pv.max = 10 + data.abilities.mus.value;
    data.pc.max = 10 + data.abilities.vol.value - spells.length;
    
    data.pc.value = Math.min(data.pc.value, data.pc.max);
    data.pv.value = Math.min(data.pv.value, data.pv.max);
  }
  

  
}
