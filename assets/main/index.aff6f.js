window.__require=function t(e,i,n){function s(a,r){if(!i[a]){if(!e[a]){var c=a.split("/");if(c=c[c.length-1],!e[c]){var l="function"==typeof __require&&__require;if(!r&&l)return l(c,!0);if(o)return o(c,!0);throw new Error("Cannot find module '"+a+"'")}a=c}var u=i[a]={exports:{}};e[a][0].call(u.exports,function(t){return s(e[a][1][t]||t)},u,u.exports,t,e,i,n)}return i[a].exports}for(var o="function"==typeof __require&&__require,a=0;a<n.length;a++)s(n[a]);return s}({HotUpdateModule:[function(t,e){"use strict";cc._RF.push(e,"fe27eoEQN9EtJmz2mdvo4Vg","HotUpdateModule"),cc.Class({extends:cc.Component,properties:{manifestUrl:cc.Asset,versionLabel:{default:null,type:cc.Label},_updating:!1,_canRetry:!1,_storagePath:""},onLoad:function(){cc.sys.isNative&&(this._storagePath=(jsb.fileUtils?jsb.fileUtils.getWritablePath():"/")+"client",this.versionCompareHandle=function(t,e){for(var i=t.split("."),n=e.split("."),s=0;s<i.length;++s){var o=parseInt(i[s]),a=parseInt(n[s]||0);if(o!==a)return o-a}return n.length>i.length?-1:0},this._am=new jsb.AssetsManager(this.manifestUrl.nativeUrl,this._storagePath,this.versionCompareHandle),this._am.setVerifyCallback(function(){return!0}),this.versionLabel&&(this.versionLabel.string="src:"+this._am.getLocalManifest().getVersion()),cc.sys.os,cc.sys.OS_ANDROID,this._am.setMaxConcurrentTask(16))},onDestroy:function(){cc.sys.isNative&&(this._am.setEventCallback(null),this._am=null)},showLog:function(t){cc.log("[HotUpdateModule][showLog]----"+t)},retry:function(){!this._updating&&this._canRetry&&(this._canRetry=!1,this._am.downloadFailedAssets())},updateCallback:function(t){var e=!1,i=!1;switch(t.getEventCode()){case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:this.showLog("The local manifest file was not found, and the hot update was skipped."),i=!0;break;case jsb.EventAssetsManager.UPDATE_PROGRESSION:var n=t.getPercent();if(isNaN(n))return;var s=t.getMessage();this.disPatchRateEvent(n,s),this.showLog("updateCallback Update progress:"+n+", msg: "+s);break;case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:this.showLog("Failed to download manifest file, skip hot update."),i=!0;break;case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:this.showLog("Already the latest version."),i=!0;break;case jsb.EventAssetsManager.UPDATE_FINISHED:this.showLog("The update is over."+t.getMessage()),this.disPatchRateEvent(1),e=!0;break;case jsb.EventAssetsManager.UPDATE_FAILED:this.showLog("Update error."+t.getMessage()),this._updating=!1,this._canRetry=!0,this._failCount++,this.retry();break;case jsb.EventAssetsManager.ERROR_UPDATING:this.showLog("Error during update:"+t.getAssetId()+", "+t.getMessage());break;case jsb.EventAssetsManager.ERROR_DECOMPRESS:this.showLog("unzip error")}if(i&&(this._am.setEventCallback(null),this._updating=!1),e){this._am.setEventCallback(null);var o=jsb.fileUtils.getSearchPaths(),a=this._am.getLocalManifest().getSearchPaths();Array.prototype.unshift.apply(o,a),cc.sys.localStorage.setItem("HotUpdateSearchPaths",JSON.stringify(o)),jsb.fileUtils.setSearchPaths(o),cc.audioEngine.stopAll(),setTimeout(function(){cc.game.restart()},100)}},hotUpdate:function(){if(this._am&&!this._updating){if(this._am.setEventCallback(this.updateCallback.bind(this)),this._am.getState()===jsb.AssetsManager.State.UNINITED){var t=this.manifestUrl.nativeUrl;cc.assetManager.md5Pipe&&(t=cc.assetManager.md5Pipe.transformURL(t)),this._am.loadLocalManifest(t)}this._failCount=0,this._am.update(),this._updating=!0}},checkCallback:function(t){switch(t.getEventCode()){case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:this.showLog("The local manifest file was not found, and the hot update was skipped."),this.hotUpdateFinish(!0);break;case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:this.showLog("Failed to download manifest file, skip hot update."),this.hotUpdateFinish(!1);break;case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:this.showLog("updated."),this.hotUpdateFinish(!0);break;case jsb.EventAssetsManager.NEW_VERSION_FOUND:return this.showLog("There is a new version, need to update"),this._updating=!1,void this.hotUpdate();case jsb.EventAssetsManager.UPDATE_PROGRESSION:var e=t.getPercent();if(isNaN(e))return;var i=t.getMessage();return void this.showLog("checkCallback Update progress:"+e+", msg: "+i);default:return void console.log("event.getEventCode():"+t.getEventCode())}this._am.setEventCallback(null),this._updating=!1},checkUpdate:function(){if(this._updating)cc.log("Checking for updates...");else{if(this._am.getState()===jsb.AssetsManager.State.UNINITED){var t=this.manifestUrl.nativeUrl;cc.assetManager.md5Pipe&&(t=cc.assetManager.md5Pipe.transformURL(t)),this._am.loadLocalManifest(t)}this._am.getLocalManifest()&&this._am.getLocalManifest().isLoaded()?(this._am.setEventCallback(this.checkCallback.bind(this)),this._am.checkUpdate(),this._updating=!0,this.disPatchRateEvent(.01)):this.showLog("Failed to load manifest file")}},hotUpdateFinish:function(t){cc.director.emit("HotUpdateFinish",t)},disPatchRateEvent:function(t){t>1&&(t=1),cc.director.emit("HotUpdateRate",t)}}),cc._RF.pop()},{}],LoginView:[function(t,e){"use strict";cc._RF.push(e,"6033bh2pLFOrIQ6XHG+xlRS","LoginView"),cc.Class({extends:cc.Component,properties:{menuNode:{default:null,type:cc.Node},labelTips:{default:null,type:cc.Label}},onLoad:function(){this.menuNode.active=!0},onDestroy:function(){},onEnable:function(){cc.director.on("HotUpdateFinish",this.onHotUpdateFinish,this),cc.director.on("HotUpdateRate",this.onHotUpdateRate,this)},onDisable:function(){cc.director.off("HotUpdateFinish",this.onHotUpdateFinish,this),cc.director.off("HotUpdateRate",this.onHotUpdateRate,this)},checkVersion:function(){},onUpdateFinish:function(){this.menuNode.active=!0,this.labelTips.string=""},onHotUpdateFinish:function(){this.onUpdateFinish()},onHotUpdateRate:function(t){var e=t;e>1&&(e=1),this._updatePercent=e,this.labelTips.string="\u0110ANG TI\u1ebeN H\xc0NH C\u1eacP NH\u1eacT T\xc0I NGUY\xcaN GAME, TI\u1ebeN \u0110\u1ed8 C\u1eacP NH\u1eacT "+parseInt(1e4*e)/100+"%"},onBtnStartGame:function(){cc.director.loadScene("Game")},onBtnBill:function(){cc.director.loadScene("Game")}}),cc._RF.pop()},{}],SoundMN:[function(t,e){"use strict";cc._RF.push(e,"b32b17638VE4ZIucaXyYSzo","SoundMN"),cc.Class({properties:{n:{default:"",type:cc.String},clip:{default:null,type:cc.AudioClip}}}),cc._RF.pop()},{}],game:[function(t,e){"use strict";cc._RF.push(e,"17a107hOA1DjJdGNDmkBd3y","game");var i=t("reel"),n=t("SoundMN"),s=t("on-off-button"),o=t("user-default"),a=t("paytable-tags")();cc.Class({extends:cc.Component,properties:{musicSound:[n],sfxSound:[n],musicSource:{default:null,type:cc.AudioSource},sfxSource:{default:null,type:cc.AudioSource},state1:{default:!0,visible:!1},state2:{default:!0,visible:!1},winAnimation:{default:null,type:cc.Animation},win_effect:{default:null,type:cc.Animation},reels:{default:[],type:[i]},currentCredit:{default:100,type:cc.Integer},betOneValue:{default:1,type:cc.Integer},betMaxValue:{default:5,type:cc.Integer},spinButton:{default:null,type:s},autoSpinButton:{default:null,type:s},betOneButton:{default:null,type:s},betMaxButton:{default:null,type:s},totalBetLabel:{default:null,type:cc.Label},creditLabel:{default:null,type:cc.Label},betInfoLabel:{default:null,type:cc.Label},rollingCompletedCount:{default:0,visible:!1,type:cc.Integer},isRollingCompleted:{default:!0,visible:!1},totalBetValue:{default:0,visible:!1,type:cc.Integer},currentBetValue:{default:0,visible:!1,type:cc.Integer},currentPayTableTag:{default:0,visible:!1,type:cc.Integer},isAutoSpin:{default:!1,visible:!1},home:{default:null,type:cc.Node},autoSpinTimer:{default:null,visible:!1},musicSlider:{default:null,type:cc.Slider},soundSlider:{default:null,type:cc.Slider},setting:{default:null,type:cc.Node}},onLoad:function(){this.PlayMusic("bg"),this.home.on(cc.Node.EventType.TOUCH_START,this.betHome,this);var t=this;console.log("this::: "+this.spinButton),this.creditLabel.string=this.currentCredit.toString(),this.betInfoLabel.string="",this.spinButton.node.on("reel-spin",function(e){e.isOn&&(t.spin(),t.PlaySFX("spin"))}),this.autoSpinButton.node.on("reel-auto-spin",function(e){!0===t.isAutoSpin?t.isAutoSpin=!1:t.isAutoSpin=!0,t.isAutoSpin?e.isOn&&(t.spin(),t.PlaySFX("spin")):(clearTimeout(t.autoSpinTimer),t.PlaySFX("spin"))}),this.betOneButton.node.on("bet-one",function(e){e.isOn&&(t.betMaxButton.reset(),t.currentBetValue=t.betOneValue,t.currentPayTableTag=a.BET_ONE,t.betInfoLabel.string=t.currentBetValue.toString(),t.PlaySFX("CoinInsert"))}),this.betMaxButton.node.on("bet-max",function(e){e.isOn&&(t.betOneButton.reset(),t.currentBetValue=t.betMaxValue,t.currentPayTableTag=a.BET_MAX,t.betInfoLabel.string=t.currentBetValue.toString(),t.PlaySFX("CoinInsert"))}),this.node.on("rolling-completed",function(){if(t.rollingCompletedCount++,t.PlaySFX("reelStop"),t.rollingCompletedCount==t.reels.length){var e;t.rollingCompletedCount=0,e=t.getLineSymbolsTag();var i=t.getComponent("paytable").isWinning(e,t.currentPayTableTag);Object.keys(i).length>0?(t.isRollingCompleted=!0,t.isAutoSpin?t.autoSpinButton.reset():t.spinButton.reset(),t.isAutoSpin=!1,t.winAnimation.play(),t.win_effect.play(),t.PlaySFX("LineWin"),t.PlaySFX("CoinWin"),t.showWinningSymbolsAndPay(i)):(t.updateCurrenCredit(t.currentCredit-t.currentBetValue),t.betInfoLabel.string=(-t.currentBetValue).toString(),t.isAutoSpin?t.autoSpinTimer=setTimeout(function(){t.spin()},1e3):(t.isRollingCompleted=!0,t.spinButton.reset())),t.isRollingCompleted&&(t.setButtonsLocked(!1),o.instance.setCurrentCredit(t.currentCredit))}})},betMute:function(){},betHome:function(){cc.director.loadScene("spin")},start:function(){this.loadUserDefault(),this.updateCurrenCredit(this.currentCredit+100)},loadUserDefault:function(){this.updateCurrenCredit(o.instance.getCurrentCredit(this.currentCredit))},spin:function(){if(0!==this.currentCredit&&(this.betInfoLabel.string=this.currentBetValue.toString(),this.isRollingCompleted)){this.totalBetValue+=this.currentBetValue,this.totalBetLabel.string=this.totalBetValue.toString(),this.isAutoSpin||(this.isRollingCompleted=!1),this.setButtonsLocked(!0),this.PlaySFX("reelRoll");for(var t=0;t<this.reels.length;t++)this.reels[t].spin()}},setButtonsLocked:function(t){this.isAutoSpin||(this.autoSpinButton.isLocked=t),this.spinButton.isLocked=t,this.betOneButton.isLocked=t,this.betMaxButton.isLocked=t},getLineSymbolsTag:function(){for(var t=[],e=0;e<this.reels.length;e++){var i=this.reels[e].getWinnerStop().getComponent("stop");t.push(i.tag)}return t},showWinningSymbolsAndPay:function(t){for(var e=0,i=0;i<t.length;i++){for(var n=t[i],s=0;s<n.indexes.length;s++)this.reels[n.indexes[s]].getWinnerStop().getComponent("stop").blink();e+=parseInt(n.winningValue)}this.updateCurrenCredit(this.currentCredit+e),this.betInfoLabel.string=e.toString()},updateCurrenCredit:function(t){this.currentCredit=t,this.creditLabel.string=this.currentCredit.toString(),parseInt(this.currentCredit)<=0&&(this.PlaySFX("gameOver"),this.updateCurrenCredit(100))},PlayMusic:function(t){var e=this.musicSound.find(function(e){return e.n===t});null==e?console.log("not found"):(this.musicSource.clip=e.clip,this.musicSource.play())},PlaySFX:function(t){var e=this.sfxSound.find(function(e){return e.n===t});null==e?console.log("not found"):(this.sfxSource.clip=e.clip,this.sfxSource.play())},showsetting:function(){this.setting.setPosition(0,0)},hidesetting:function(){this.setting.setPosition(1e4,1e4)},MusicVolume:function(){this.musicSource.volume=this.musicSlider.progress},SFXVolume:function(){this.sfxSource.volume=this.soundSlider.progress}}),cc._RF.pop()},{SoundMN:"SoundMN","on-off-button":"on-off-button","paytable-tags":"paytable-tags",reel:"reel","user-default":"user-default"}],"on-off-button":[function(t,e){"use strict";cc._RF.push(e,"5357bF9y7pDjoX+fmXrnWY3","on-off-button"),cc.Class({extends:cc.Component,properties:{mouseDownName:{default:"on-off-mousedown"},sprite:{default:null,type:cc.Sprite},spriteTextureDown:{default:null,type:cc.SpriteFrame},isOn:{default:!1},spriteTextureUp:{default:"",visible:!1,url:cc.Sprite},isLocked:{default:!1,visible:!1}},onLoad:function(){var t=this;function e(){}this.spriteTextureUp=this.sprite._spriteFrame._texture,this.spriteTextureDown=this.spriteTextureDown._texture,this.node.on("touchstart",function(){t.onOff()},this.node),this.node.on("touchend",e,this.node),this.node.on("touchcancel",e,this.node)},start:function(){this.isOn&&(this.isOn=!1,this.onOff())},onOff:function(){this.isLocked||(this.isOn?(this.updateSpriteFrame(this.sprite,this.spriteTextureUp),this.isOn=!1):(this.updateSpriteFrame(this.sprite,this.spriteTextureDown),this.isOn=!0),this.node.emit(this.mouseDownName,{isOn:this.isOn}))},reset:function(){this.isOn=!1,this.isLocked=!1,this.updateSpriteFrame(this.sprite,this.spriteTextureUp)},updateSpriteFrame:function(t,e){if(t&&e){var i=t.node.width,n=t.node.height,s=new cc.SpriteFrame(e,cc.rect(0,0,i,n));t.spriteFrame=s}}}),cc._RF.pop()},{}],"paytable-definition":[function(t,e){"use strict";cc._RF.push(e,"4b94bWer2JLr7DA4SmWX2NA","paytable-definition");var i=t("stop-tags")(),n=t("paytable-tags")(),s=[{stopTag:i.BONUS,5:2e3,4:1600,3:1e3,2:800},{stopTag:i.BANANA,5:300,4:260,3:200,2:100},{stopTag:i.BEGAMOT,5:200,4:160,3:100,2:50},{stopTag:i.COCODRILE,5:200,4:160,3:100,2:50},{stopTag:i.COCKTAIL,5:200,4:160,3:100,2:5},{stopTag:i.KAKADU,5:100,4:90,3:75,2:5},{stopTag:i.MAN,5:100,4:90,3:75,2:5},{stopTag:i.MONKEY,5:100,4:90,3:75,2:2},{stopTag:i.LION,5:50,4:40,3:25,2:2}],o=[{stopTag:i.BONUS,5:200,4:170,3:100,2:50},{stopTag:i.BANANA,5:100,4:80,3:20,2:10},{stopTag:i.BEGAMOT,5:50,4:40,3:10,2:5},{stopTag:i.COCODRILE,5:50,4:40,3:10,2:5},{stopTag:i.COCKTAIL,5:20,4:15,3:10,2:2},{stopTag:i.KAKADU,5:10,4:8,3:5,2:2},{stopTag:i.MAN,5:10,4:8,3:5,2:2},{stopTag:i.MONKEY,5:10,4:8,3:5,2:1},{stopTag:i.LION,5:5,4:3,3:2,2:1}];e.exports=function(t){switch(t){case n.BET_ONE:return o;case n.BET_MAX:return s;default:return o}},cc._RF.pop()},{"paytable-tags":"paytable-tags","stop-tags":"stop-tags"}],"paytable-tags":[function(t,e){"use strict";cc._RF.push(e,"ea2e2acVj1Hmpq3sPcOAYmv","paytable-tags"),e.exports=function(){return{BET_ONE:0,BET_MAX:1}},cc._RF.pop()},{}],paytable:[function(t,e){"use strict";cc._RF.push(e,"91f5f5bVWpFDYv2UMKKXJYb","paytable");var i=t("paytable-definition");t("stop-tags")(),cc.Class({extends:cc.Component,properties:{},onLoad:function(){},isWinning:function(t){for(var e={},i=0;i<t.length;i++){var n=t[i],s=i>0?t[i-1]:-1,o=[];o.push(i);for(var a=i+1;a<t.length;a++){var r=t[a];if(n!=r||r==s)break;o.push(a),e[n]={indexes:o}}}return Object.keys(e).length>0?this.check(e):[]},check:function(t,e){var n=i(e),s=[];for(var o in t)t.hasOwnProperty(o)&&n.filter(function(e){e.stopTag==o&&parseInt(e[t[o].indexes.length].toString())>0&&s.push({indexes:t[o].indexes,winningValue:e[t[o].indexes.length].toString(),winningTag:o})});return s}}),cc._RF.pop()},{"paytable-definition":"paytable-definition","stop-tags":"stop-tags"}],prng:[function(t,e){"use strict";cc._RF.push(e,"f86f5iz5DNJDqogRC4T+OHu","prng"),e.exports=function(){return{newValue:function(t,e){return Math.floor(Math.random()*(e-t+1))+t}}},cc._RF.pop()},{}],reel:[function(t,e){"use strict";cc._RF.push(e,"3d805IS8GdKi4fpFoRADeDr","reel");var i=t("prng")();cc.Class({extends:cc.Component,properties:{stops:{default:[],type:[cc.Prefab]},prngMinRange:{default:1,type:cc.Integer},prngMaxRange:{default:1e9,type:cc.Integer},stopNodes:{default:[],visible:!1,type:[cc.Node]},tailNode:{default:null,visible:!1,type:cc.Node},visibleStops:{default:3,visible:!1,type:cc.Integer},padding:{default:0,visible:!1,type:cc.Integer},stopHeight:{default:0,visible:!1,type:cc.Integer},stepY:{default:0,visible:!1,type:cc.Integer},rollingCount:{default:0,visible:!1,type:cc.Integer},winnerIndex:{default:0,visible:!1,type:cc.Integer},stopAfterRollingCount:{default:0,visible:!1,type:cc.Integer},winnerLineY:{default:0,visible:!1,type:cc.Integer},isRollingCompleted:{default:!1,visible:!1}},onLoad:function(){console.log("reelllll"),console.log(this.node.height),this.winnerLineY=this.node.height/2;var t=cc.instantiate(this.stops[0]);this.stopHeight=t.height,this.padding=(this.node.height-this.visibleStops*this.stopHeight)/(this.visibleStops+1),this.stepY=this.stopHeight/5;for(var e=this.node.height-this.padding-this.stopHeight,i=this.node.width/2-t.width/2,n=0;n<this.stops.length;n++){var s=cc.instantiate(this.stops[n]);this.node.addChild(s),s.setPosition(cc.v2(i,e)),e=e-this.padding-this.stopHeight,this.stopNodes.push(s)}this.tailNode=this.stopNodes[this.stopNodes.length-1],this.isRollingCompleted=!0},update:function(){if(!this.isRollingCompleted)for(var t=0;t<this.stopNodes.length;t++){var e=this.stopNodes[t];e.y=e.y+this.stepY,e.y-this.padding>this.node.height&&(t+1==this.stopNodes.length&&this.rollingCount++,e.y=this.tailNode.y-this.tailNode.height-this.padding,this.tailNode=e),this.stopAfterRollingCount==this.rollingCount&&t==this.winnerIndex&&e.y>=this.winnerLineY&&(0===this.winnerIndex&&(this.tailNode.y=e.y+e.height,this.tailNode=this.stopNodes[this.stopNodes.length-2]),this.resetY(e),this.isRollingCompleted=!0,this.node.dispatchEvent(new cc.Event.EventCustom("rolling-completed",!0)))}},resetY:function(t){for(var e=t.y-this.winnerLineY+t.height/2,i=this.winnerIndex===this.stopNodes.length-1,n=0;n<this.stopNodes.length;n++){var s=this.stopNodes[n];s.y=s.y-e,i&&s.y<this.winnerLineY&&n!=this.winnerIndex&&(s.y=s.y+this.padding)}},spin:function(){this.rollingCount=0,this.stopAfterRollingCount=Math.floor(2*Math.random())+1;var t=i.newValue(this.prngMinRange,this.prngMaxRange);this.winnerIndex=t%this.stops.length,this.isRollingCompleted=!1},getWinnerStop:function(){return this.stopNodes[this.winnerIndex]}}),cc._RF.pop()},{prng:"prng"}],spin:[function(t,e,i){"use strict";cc._RF.push(e,"b5310q1UndOT7hwfPFfPSNo","spin");var n,s=this&&this.__extends||(n=function(t,e){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i])})(t,e)},function(t,e){function i(){this.constructor=t}n(t,e),t.prototype=null===e?Object.create(e):(i.prototype=e.prototype,new i)}),o=this&&this.__decorate||function(t,e,i,n){var s,o=arguments.length,a=o<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,n);else for(var r=t.length-1;r>=0;r--)(s=t[r])&&(a=(o<3?s(a):o>3?s(e,i,a):s(e,i))||a);return o>3&&a&&Object.defineProperty(e,i,a),a};Object.defineProperty(i,"__esModule",{value:!0});var a=cc._decorator,r=a.ccclass,c=a.property,l=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e.node1=null,e.node2=null,e.spin=null,e.bgSound=null,e.bigWin=null,e.spinWin=null,e.isSpinning=!1,e.spinDuration=2,e}return s(e,t),e.prototype.onLoad=function(){this.node2.on(cc.Node.EventType.TOUCH_END,this.startSpin.bind(this)),cc.audioEngine.playMusic(this.bgSound,!0)},e.prototype.startSpin=function(){cc.audioEngine.playMusic(this.spin,!0),this.isSpinning||(this.isSpinning=!0,this.node1.runAction(cc.sequence(cc.rotateBy(this.spinDuration,900*this.spinDuration),cc.callFunc(this.stopSpin.bind(this)))))},e.prototype.delayTime=function(){var t=cc.delayTime(1.1),e=cc.callFunc(function(){cc.delayTime(1.1),cc.director.loadScene("Game")}),i=cc.sequence(t,e);this.node.runAction(i)},e.prototype.stopSpin=function(){this.isSpinning=!1,cc.audioEngine.stopAll(),this.spinWin.play(),cc.audioEngine.playMusic(this.bigWin,!0),this.delayTime(),cc.audioEngine.playMusic(this.bigWin,!1)},o([c(cc.Node)],e.prototype,"node1",void 0),o([c(cc.Node)],e.prototype,"node2",void 0),o([c(cc.AudioClip)],e.prototype,"spin",void 0),o([c(cc.AudioClip)],e.prototype,"bgSound",void 0),o([c(cc.AudioClip)],e.prototype,"bigWin",void 0),o([c(cc.Animation)],e.prototype,"spinWin",void 0),o([r],e)}(cc.Component);i.default=l,cc._RF.pop()},{}],"stop-tags":[function(t,e){"use strict";cc._RF.push(e,"b1f8fcCyUlAQYXKla3YDX5/","stop-tags"),e.exports=function(){return{BANANA:1,BEGAMOT:2,BONUS:3,COCKTAIL:4,COCODRILE:5,KAKADU:6,LION:7,MAN:8,MONKEY:9}},cc._RF.pop()},{}],stop:[function(t,e){"use strict";cc._RF.push(e,"7c9d92+IOBMGKwSTChSoIVi","stop"),cc.Class({extends:cc.Component,properties:{tag:{default:0,type:cc.Integer},blinkTimer:{default:null,visible:!1},blinkCounter:{default:0,visible:!1}},onLoad:function(){},blink:function(){var t=this;this.blinkTimer=setInterval(function(){t.blinkCounter++,!0===t.node.active?t.node.active=!1:t.node.active=!0,10==t.blinkCounter&&(t.blinkCounter=0,t.node.active=!0,clearInterval(t.blinkTimer))},300)}}),cc._RF.pop()},{}],"use_v2.0.x_cc.Toggle_event":[function(t,e){"use strict";cc._RF.push(e,"8c22eSyM3hMNLZSDMPpSIrC","use_v2.0.x_cc.Toggle_event"),cc.Toggle&&(cc.Toggle._triggerEventInScript_check=!0),cc._RF.pop()},{}],"user-default-keys":[function(t,e){"use strict";cc._RF.push(e,"246ab4anldKkYCjr7FirIEK","user-default-keys"),e.exports=function(){return{CURRENT_CREDIT:"Current_Credit"}},cc._RF.pop()},{}],"user-default":[function(t,e){"use strict";cc._RF.push(e,"ac85aN0yDZAy5qM8en8FeDQ","user-default");var i=t("user-default-keys")(),n=cc.Class({extends:cc.Component,properties:{localStorage:{default:null,visible:!1,type:Object}},onLoad:function(){this.localStorage=cc.sys.localStorage,n.instance=this},statics:{instance:null},getCurrentCredit:function(t){var e=this.localStorage.getItem(i.CURRENT_CREDIT);return e||(e=t),e?parseInt(e):0},setCurrentCredit:function(t){this.localStorage.setItem(i.CURRENT_CREDIT,t)}});cc._RF.pop()},{"user-default-keys":"user-default-keys"}]},{},["use_v2.0.x_cc.Toggle_event","SoundMN","game","paytable-definition","paytable-tags","paytable","prng","reel","spin","stop-tags","stop","user-default-keys","user-default","HotUpdateModule","LoginView","on-off-button"]);