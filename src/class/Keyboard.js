export default class Keyboard {
    constructor(caseSensitive=false){
        this.pubSub = $({});
        this.keys = new Map();
        $(window).on("keydown", evt => this._manageKeydown(evt));
        $(window).on("keyup", evt => this._manageKeyup(evt));
    }

    _manageKeydown(evt) {
        let key = evt.key;        
        if (!this.caseSensitive) key = key.toUpperCase();
        this.keys.set(key, key);   
        this.pubSub.trigger(`keyboard:${key}`, this.keyPressed);     
    }

    _manageKeyup(evt) {
        let key = evt.key;        
        if (!this.caseSensitive) key = key.toUpperCase();
        this.keys.delete(key);
    }

    isKeyDown(key) {
        if (!this.caseSensitive) key = key.toUpperCase();
        return this.keys.has(key);
    }

    isKeysDown(key1, key2){
		let first = this.isKeyDown(key1);
		let second = this.isKeyDown(key2);
		if(first === true && second === true){
			return true;
		}else{
			return false;
		}
    }
    
    onKey(key, callback) {
        if (!this.caseSensitive) {
          key = key.toUpperCase();
        }
        this.pubSub.on(`keyboard:${key}`, callback);
      }

}