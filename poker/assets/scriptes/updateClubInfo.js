// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
var Title = require("Title");
var GlobalData = require("GlobalData");
var NetUtil = require("NetUtil");
var HeadPortraitsLoad = require("HeadPortraitsLoad");
var ButAnimation = require("ButAnimation");
var Alert = require("Alert");
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        updateNameEditBox:{
            default: null,                
            type: cc.EditBox   
        },
        nameLabel:{
            default: null,                
            type: cc.Label   
        },
        txSprite:{
            default: null,                
            type: cc.Sprite    
        },
        saveBut:{
            default: null,                
            type: cc.Sprite   
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        let self = this;
        Title.creation("俱乐部设置");
        this.clubInfo =  GlobalData.getScenesParameter();
        if( this.clubInfo ){
            HeadPortraitsLoad.Load(self.txSprite.node,this.clubInfo.txUrl);
            this.nameLabel.string = this.clubInfo.name;
        }
        this.queryCreationClubJewel();
        self.saveBut.node.on(cc.Node.EventType.TOUCH_START,function (args) {
            ButAnimation.play(self.saveBut.node,function(){
                self.saveClubInfo();
            });
        },self); 
    },
    queryCreationClubJewel(){
        let self = this;
        NetUtil.pomeloRequest("game.gameHandler.queryUpdateClubNameJewel",{},function(data){
            if(data.code!=200){
                return ;
            }
            self.updateNameEditBox.placeholder = "(修改名称将花费"+data.data.value+"钻石)";
        },false);

    },
    saveClubInfo(){
        let self = this;
        let name = self.updateNameEditBox.string;
        
        if(!name){
            Alert.show("名称不能为空！");
            return ;
        }
        NetUtil.pomeloRequest("game.gameHandler.updateClubInfo", {clubName:name,clubid:self.clubInfo.id},function(data){
            if(data.code!=200){
                if(data.msg){
                    Alert.show(data.msg);
                }
                return ;
            }     
            self.clubInfo.name = name;      
            Alert.show("保存成功！",function(){
                cc.director.loadScene("clubManagement");  
            });
        });         
    },
    start () {

    },

    // update (dt) {},
});
